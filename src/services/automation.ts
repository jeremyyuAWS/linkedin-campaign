import { linkedInApi } from './linkedin-api';
import { aiEngine, type AIInsight } from './ai-engine';

interface AutomationRule {
  id: string;
  name: string;
  type: 'budget' | 'pause' | 'bid' | 'creative';
  enabled: boolean;
  conditions: {
    metric: string;
    operator: 'gt' | 'lt' | 'eq';
    value: number;
    timeframe: number; // hours
  }[];
  actions: {
    type: string;
    parameters: any;
  }[];
  lastTriggered?: Date;
  triggerCount: number;
}

interface AutomationHistory {
  id: string;
  ruleId: string;
  campaignId: string;
  action: string;
  timestamp: Date;
  success: boolean;
  details: any;
}

class AutomationEngine {
  private rules: AutomationRule[] = [];
  private history: AutomationHistory[] = [];
  private isRunning = false;

  // Initialize default automation rules
  initializeDefaultRules(): void {
    this.rules = [
      {
        id: 'auto_pause_low_ctr',
        name: 'Auto-pause low CTR campaigns',
        type: 'pause',
        enabled: true,
        conditions: [
          { metric: 'ctr', operator: 'lt', value: 1.0, timeframe: 24 }
        ],
        actions: [
          { type: 'pause_campaign', parameters: {} }
        ],
        triggerCount: 0
      },
      {
        id: 'budget_reallocation',
        name: 'Reallocate budget to high performers',
        type: 'budget',
        enabled: true,
        conditions: [
          { metric: 'ctr', operator: 'gt', value: 4.0, timeframe: 24 },
          { metric: 'budget_remaining', operator: 'gt', value: 1000, timeframe: 1 }
        ],
        actions: [
          { type: 'increase_budget', parameters: { percentage: 20 } }
        ],
        triggerCount: 0
      },
      {
        id: 'creative_rotation',
        name: 'Rotate creative when CTR declines',
        type: 'creative',
        enabled: false, // Disabled by default for safety
        conditions: [
          { metric: 'ctr_decline', operator: 'gt', value: 25, timeframe: 168 } // 7 days
        ],
        actions: [
          { type: 'enable_backup_creative', parameters: {} }
        ],
        triggerCount: 0
      }
    ];
  }

  // Start automation monitoring
  startAutomation(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('Automation engine started');
    
    // Run checks every 15 minutes
    setInterval(() => {
      this.runAutomationCycle();
    }, 15 * 60 * 1000);
  }

  // Stop automation monitoring
  stopAutomation(): void {
    this.isRunning = false;
    console.log('Automation engine stopped');
  }

  // Main automation cycle
  private async runAutomationCycle(): Promise<void> {
    if (!this.isRunning) return;

    try {
      console.log('Running automation cycle...');
      
      // Get current campaigns (in production, this would be real data)
      const campaigns = await this.getCurrentCampaigns();
      
      // Check each rule against each campaign
      for (const rule of this.rules.filter(r => r.enabled)) {
        for (const campaign of campaigns) {
          const shouldTrigger = await this.evaluateRule(rule, campaign);
          
          if (shouldTrigger) {
            await this.executeRule(rule, campaign);
          }
        }
      }
    } catch (error) {
      console.error('Automation cycle error:', error);
    }
  }

  // Evaluate if a rule should trigger for a campaign
  private async evaluateRule(rule: AutomationRule, campaign: any): Promise<boolean> {
    for (const condition of rule.conditions) {
      const conditionMet = await this.evaluateCondition(condition, campaign);
      if (!conditionMet) return false;
    }
    return true;
  }

  // Evaluate individual condition
  private async evaluateCondition(condition: any, campaign: any): Promise<boolean> {
    let actualValue: number;

    // Get the metric value
    switch (condition.metric) {
      case 'ctr':
        actualValue = campaign.last_7_days?.ctr || campaign.metrics.ctr;
        break;
      case 'ctr_decline':
        const weeklyTrend = this.calculateWeeklyTrend(campaign);
        actualValue = Math.abs(weeklyTrend);
        break;
      case 'budget_remaining':
        actualValue = campaign.budget.remaining;
        break;
      case 'cost_per_conversion':
        actualValue = campaign.metrics.cost_per_conversion;
        break;
      default:
        return false;
    }

    // Apply the operator
    switch (condition.operator) {
      case 'gt':
        return actualValue > condition.value;
      case 'lt':
        return actualValue < condition.value;
      case 'eq':
        return actualValue === condition.value;
      default:
        return false;
    }
  }

  // Execute rule actions
  private async executeRule(rule: AutomationRule, campaign: any): Promise<void> {
    console.log(`Executing rule "${rule.name}" for campaign ${campaign.name}`);

    for (const action of rule.actions) {
      try {
        await this.executeAction(action, campaign, rule);
        
        // Log successful execution
        this.history.push({
          id: `${Date.now()}_${Math.random()}`,
          ruleId: rule.id,
          campaignId: campaign.id,
          action: action.type,
          timestamp: new Date(),
          success: true,
          details: action.parameters
        });

        rule.triggerCount++;
        rule.lastTriggered = new Date();

      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error);
        
        // Log failed execution
        this.history.push({
          id: `${Date.now()}_${Math.random()}`,
          ruleId: rule.id,
          campaignId: campaign.id,
          action: action.type,
          timestamp: new Date(),
          success: false,
          details: { error: error.message }
        });
      }
    }
  }

  // Execute individual action
  private async executeAction(action: any, campaign: any, rule: AutomationRule): Promise<void> {
    switch (action.type) {
      case 'pause_campaign':
        await linkedInApi.pauseCampaign(campaign.id);
        console.log(`Paused campaign ${campaign.name} due to rule ${rule.name}`);
        break;

      case 'increase_budget':
        const currentBudget = campaign.budget.total;
        const increase = action.parameters.percentage / 100;
        const newBudget = currentBudget * (1 + increase);
        await linkedInApi.updateCampaignBudget(campaign.id, newBudget);
        console.log(`Increased budget for ${campaign.name} by ${action.parameters.percentage}%`);
        break;

      case 'decrease_budget':
        const currentBudget2 = campaign.budget.total;
        const decrease = action.parameters.percentage / 100;
        const newBudget2 = currentBudget2 * (1 - decrease);
        await linkedInApi.updateCampaignBudget(campaign.id, newBudget2);
        console.log(`Decreased budget for ${campaign.name} by ${action.parameters.percentage}%`);
        break;

      case 'enable_backup_creative':
        // This would enable a backup creative asset
        console.log(`Enabled backup creative for ${campaign.name}`);
        break;

      case 'send_alert':
        await this.sendAlert(rule, campaign, action.parameters);
        break;

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  // Smart budget reallocation
  async reallocateBudget(campaigns: any[]): Promise<void> {
    const insights = await aiEngine.generateInsights(campaigns);
    const reallocationInsight = insights.find(i => i.type === 'optimization' && i.title.includes('Budget Reallocation'));
    
    if (reallocationInsight) {
      const { topPerformer, underPerformers } = reallocationInsight.data;
      
      // Calculate reallocation amount
      const totalToReallocate = underPerformers.reduce((sum: number, id: string) => {
        const campaign = campaigns.find(c => c.id === id);
        return sum + (campaign?.last_7_days?.spend / 7 || 0);
      }, 0);

      // Reduce budget from underperformers
      for (const underperformerId of underPerformers) {
        const campaign = campaigns.find(c => c.id === underperformerId);
        if (campaign) {
          const reduction = (campaign.last_7_days.spend / 7) * 0.5; // 50% reduction
          await linkedInApi.updateCampaignBudget(campaign.id, campaign.budget.total - reduction);
        }
      }

      // Increase budget for top performer
      const topCampaign = campaigns.find(c => c.id === topPerformer);
      if (topCampaign) {
        await linkedInApi.updateCampaignBudget(
          topCampaign.id, 
          topCampaign.budget.total + totalToReallocate * 0.5
        );
      }

      console.log(`Reallocated $${totalToReallocate.toFixed(2)} from underperformers to top performer`);
    }
  }

  // Performance-based automation
  async performanceBasedOptimization(campaigns: any[]): Promise<void> {
    for (const campaign of campaigns) {
      const prediction = await aiEngine.predictCampaignPerformance(campaign, 7);
      
      // If predicted performance is poor, take action
      if (prediction.predictedCTR < 1.5) {
        if (campaign.status === 'active') {
          await linkedInApi.pauseCampaign(campaign.id);
          console.log(`Auto-paused ${campaign.name} due to poor predicted performance`);
        }
      }
      
      // If predicted performance is excellent, increase budget
      if (prediction.predictedCTR > 4.0 && campaign.budget.remaining > 1000) {
        const newBudget = campaign.budget.total * 1.2; // 20% increase
        await linkedInApi.updateCampaignBudget(campaign.id, newBudget);
        console.log(`Auto-increased budget for ${campaign.name} due to excellent predicted performance`);
      }
    }
  }

  // Send automation alerts
  private async sendAlert(rule: AutomationRule, campaign: any, parameters: any): Promise<void> {
    const alert = {
      title: `Automation Alert: ${rule.name}`,
      message: `Rule "${rule.name}" was triggered for campaign "${campaign.name}"`,
      timestamp: new Date(),
      campaign: campaign.name,
      details: parameters
    };

    // In production, this would send to Slack, email, etc.
    console.log('Alert sent:', alert);
  }

  // Getter methods for UI
  getRules(): AutomationRule[] {
    return this.rules;
  }

  getHistory(): AutomationHistory[] {
    return this.history.slice(-50); // Last 50 entries
  }

  // Rule management
  addRule(rule: Omit<AutomationRule, 'id' | 'triggerCount'>): void {
    this.rules.push({
      ...rule,
      id: `rule_${Date.now()}`,
      triggerCount: 0
    });
  }

  updateRule(ruleId: string, updates: Partial<AutomationRule>): void {
    const ruleIndex = this.rules.findIndex(r => r.id === ruleId);
    if (ruleIndex >= 0) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
    }
  }

  deleteRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId);
  }

  // Helper methods
  private async getCurrentCampaigns(): Promise<any[]> {
    // In production, this would fetch from LinkedIn API
    // For now, return mock data or cached campaigns
    return JSON.parse(localStorage.getItem('cached_campaigns') || '[]');
  }

  private calculateWeeklyTrend(campaign: any): number {
    const currentCTR = campaign.metrics.ctr;
    const weeklyCTR = campaign.last_7_days.ctr;
    return ((weeklyCTR - currentCTR) / currentCTR) * 100;
  }

  // Advanced automation features
  async setupSmartBidding(campaignId: string): Promise<void> {
    // Implement smart bidding based on performance data
    console.log(`Setting up smart bidding for campaign ${campaignId}`);
  }

  async scheduleCreativeRotation(campaignId: string, schedule: any): Promise<void> {
    // Schedule automatic creative rotation
    console.log(`Scheduled creative rotation for campaign ${campaignId}`);
  }
}

export const automationEngine = new AutomationEngine();
export type { AutomationRule, AutomationHistory };