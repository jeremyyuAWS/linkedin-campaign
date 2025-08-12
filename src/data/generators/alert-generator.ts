import { Alert } from '../../types';

interface AlertTemplate {
  type: Alert['type'];
  priority: Alert['priority'];
  titlePatterns: string[];
  messagePatterns: string[];
  recommendationPatterns: string[];
  triggers: string[];
}

class AlertDataGenerator {
  private templates: AlertTemplate[] = [
    {
      type: 'performance_drop',
      priority: 'high',
      titlePatterns: [
        "CTR Decline Detected",
        "Performance Drop Alert",
        "Campaign Underperforming",
        "Engagement Decrease Detected"
      ],
      messagePatterns: [
        "{campaign} CTR dropped {percentage}% in the last {timeframe}. Possible {cause} detected.",
        "{campaign} showing {percentage}% decline in {metric} over {timeframe}.",
        "Performance alert: {campaign} {metric} decreased by {percentage}% - {cause} suspected."
      ],
      recommendationPatterns: [
        "Consider refreshing ad creatives or adjusting targeting parameters.",
        "Review audience fatigue metrics and consider creative rotation.",
        "Analyze competitor activity and adjust bidding strategy.",
        "Test new messaging or expand audience targeting."
      ],
      triggers: ['creative_fatigue', 'audience_saturation', 'increased_competition', 'seasonal_decline']
    },
    {
      type: 'budget_warning',
      priority: 'medium',
      titlePatterns: [
        "Budget Threshold Reached",
        "Spend Alert",
        "Budget Utilization Warning",
        "Daily Spend Limit Approaching"
      ],
      messagePatterns: [
        "{campaign} has spent {percentage}% of allocated budget with {days} days remaining.",
        "Budget alert: {campaign} at {percentage}% utilization - {status}.",
        "{campaign} burn rate suggests budget depletion in {days} days."
      ],
      recommendationPatterns: [
        "Pause campaign or increase budget allocation to maintain delivery.",
        "Adjust daily spend limits to extend campaign duration.",
        "Consider reallocating budget from underperforming campaigns.",
        "Review performance metrics before increasing budget."
      ],
      triggers: ['high_utilization', 'fast_burn', 'approaching_limit']
    },
    {
      type: 'opportunity',
      priority: 'low',
      titlePatterns: [
        "High-Performing Audience Identified",
        "Scaling Opportunity Detected",
        "Budget Reallocation Opportunity",
        "Performance Opportunity"
      ],
      messagePatterns: [
        "{campaign} shows exceptional performance with {metric} {value}. Consider scaling budget.",
        "Opportunity: {campaign} outperforming benchmarks by {percentage}%.",
        "{campaign} audience segment showing {percentage}% higher {metric} than average."
      ],
      recommendationPatterns: [
        "Increase daily budget by {percentage}% to capitalize on strong performance.",
        "Scale audience targeting to similar segments for expansion.",
        "Reallocate budget from underperforming campaigns to this opportunity.",
        "Create lookalike audiences based on top-performing segments."
      ],
      triggers: ['high_performance', 'audience_expansion', 'budget_opportunity']
    },
    {
      type: 'optimization',
      priority: 'medium',
      titlePatterns: [
        "Audience Expansion Opportunity",
        "Creative Optimization Suggestion",
        "Targeting Refinement Available",
        "Performance Optimization"
      ],
      messagePatterns: [
        "Consider adding '{suggestion}' to {campaign}. Similar {entity} show {improvement} higher engagement.",
        "Optimization opportunity: {campaign} could benefit from {optimization_type}.",
        "Analysis suggests {campaign} performance could improve with {suggestion}."
      ],
      recommendationPatterns: [
        "Add suggested job titles to targeting criteria.",
        "Test recommended creative variations.",
        "Implement suggested bidding strategy adjustments.",
        "Expand to recommended audience segments."
      ],
      triggers: ['audience_insights', 'creative_testing', 'bidding_optimization']
    }
  ];

  private campaigns = [
    "Q4 Developer Persona - Cloud Solutions",
    "Enterprise CTO Outreach - AI Platform", 
    "Mid-Market SaaS Leaders - Integration Tools",
    "Startup Founders - Growth Analytics"
  ];

  private variables = {
    percentage: () => (Math.random() * 30 + 10).toFixed(1),
    timeframe: () => this.getRandomFromArray(["7 days", "14 days", "last week", "past month"]),
    days: () => Math.floor(Math.random() * 20 + 5).toString(),
    metric: () => this.getRandomFromArray(["CTR", "engagement rate", "click volume", "conversion rate"]),
    value: () => this.getRandomFromArray(["4.05%", "3.8%", "2.1x", "150% improvement"]),
    improvement: () => this.getRandomFromArray(["2x", "3x", "50%", "40%"]),
    suggestion: () => this.getRandomFromArray(["VP, Data Science", "Senior Product Manager", "Director of Engineering"]),
    entity: () => this.getRandomFromArray(["roles", "segments", "audiences", "demographics"]),
    optimization_type: () => this.getRandomFromArray(["creative refresh", "audience expansion", "bidding adjustment"]),
    cause: () => this.getRandomFromArray(["creative fatigue", "audience saturation", "increased competition"]),
    status: () => this.getRandomFromArray(["rapid depletion", "budget strain", "overspend risk"])
  };

  generateAlerts(count: number = 5): Alert[] {
    const alerts: Alert[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const template = this.getRandomFromArray(this.templates);
      const alert = this.generateAlertFromTemplate(template, i + 1, now);
      alerts.push(alert);
    }

    // Sort by priority and timestamp
    return alerts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  private generateAlertFromTemplate(template: AlertTemplate, index: number, baseTime: Date): Alert {
    const campaign = this.getRandomFromArray(this.campaigns);
    const title = this.getRandomFromArray(template.titlePatterns);
    const message = this.generateText(this.getRandomFromArray(template.messagePatterns), campaign);
    const recommendation = this.getRandomFromArray(template.recommendationPatterns);
    
    // Generate timestamp in the last 3 days
    const timestamp = new Date(baseTime.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000);
    
    // Status based on age and priority
    const hoursOld = (baseTime.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    const status: Alert['status'] = (hoursOld > 24 || template.priority === 'low') ? 'read' : 'unread';

    return {
      id: `alert_${String(index).padStart(3, '0')}`,
      type: template.type,
      priority: template.priority,
      title,
      message,
      campaign,
      recommendation: this.generateText(recommendation),
      timestamp: timestamp.toISOString(),
      status
    };
  }

  private generateText(pattern: string, campaign?: string): string {
    let text = pattern;
    
    // Replace campaign placeholder
    if (campaign) {
      text = text.replace('{campaign}', campaign);
    }
    
    // Replace variable placeholders
    Object.entries(this.variables).forEach(([key, generator]) => {
      const placeholder = `{${key}}`;
      while (text.includes(placeholder)) {
        text = text.replace(placeholder, generator());
      }
    });

    return text;
  }

  private getRandomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Generate time-sensitive alerts based on current conditions
  generateRealTimeAlerts(campaigns: any[]): Alert[] {
    const alerts: Alert[] = [];
    const now = new Date();

    campaigns.forEach((campaign, index) => {
      // Budget alerts
      const spentPercentage = (campaign.budget.spent / campaign.budget.total) * 100;
      if (spentPercentage > 90) {
        alerts.push({
          id: `rt_budget_${index}`,
          type: 'budget_warning',
          priority: 'high',
          title: 'Critical Budget Alert',
          message: `${campaign.name} has spent ${spentPercentage.toFixed(1)}% of allocated budget.`,
          campaign: campaign.name,
          recommendation: 'Immediate action required: pause campaign or increase budget allocation.',
          timestamp: now.toISOString(),
          status: 'unread'
        });
      }

      // Performance alerts
      const weeklyTrend = ((campaign.last_7_days.ctr - campaign.metrics.ctr) / campaign.metrics.ctr) * 100;
      if (weeklyTrend < -20) {
        alerts.push({
          id: `rt_performance_${index}`,
          type: 'performance_drop',
          priority: 'high',
          title: 'Significant Performance Decline',
          message: `${campaign.name} CTR dropped ${Math.abs(weeklyTrend).toFixed(1)}% in the last 7 days.`,
          campaign: campaign.name,
          recommendation: 'Consider creative refresh or audience adjustment.',
          timestamp: now.toISOString(),
          status: 'unread'
        });
      }

      // Opportunity alerts
      if (campaign.metrics.ctr > 3.5 && campaign.budget.remaining > 1000) {
        alerts.push({
          id: `rt_opportunity_${index}`,
          type: 'opportunity',
          priority: 'medium',
          title: 'Scaling Opportunity',
          message: `${campaign.name} shows exceptional ${campaign.metrics.ctr}% CTR with budget remaining.`,
          campaign: campaign.name,
          recommendation: `Consider increasing budget by 25% to capitalize on performance.`,
          timestamp: new Date(now.getTime() - Math.random() * 2 * 60 * 60 * 1000).toISOString(),
          status: 'unread'
        });
      }
    });

    return alerts;
  }

  // Generate historical alert trends
  generateAlertHistory(days: number = 30): Alert[] {
    const alerts: Alert[] = [];
    const now = new Date();

    for (let day = 0; day < days; day++) {
      const dayDate = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
      const alertsPerDay = Math.floor(Math.random() * 3) + 1; // 1-3 alerts per day

      for (let i = 0; i < alertsPerDay; i++) {
        const template = this.getRandomFromArray(this.templates);
        const alert = this.generateAlertFromTemplate(template, day * 10 + i, dayDate);
        alert.status = 'read'; // Historical alerts are read
        alerts.push(alert);
      }
    }

    return alerts;
  }
}

export const alertDataGenerator = new AlertDataGenerator();