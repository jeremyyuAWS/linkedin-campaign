import { Campaign, Creative, Alert, AudienceInsight } from '../types';

// Import all demo data modules
import { campaignDataGenerator } from '../data/generators/campaign-generator';
import { creativeDataGenerator } from '../data/generators/creative-generator';
import { alertDataGenerator } from '../data/generators/alert-generator';
import { audienceDataGenerator } from '../data/generators/audience-generator';
import { metricsDataGenerator } from '../data/generators/metrics-generator';

// Import static demo data as fallback
import staticCampaigns from '../data/campaigns.json';
import staticCreatives from '../data/creatives.json';
import staticAlerts from '../data/alerts.json';
import staticAudienceData from '../data/audience_insights.json';

interface DataServiceConfig {
  mode: 'demo' | 'production';
  useGeneratedData: boolean;
  refreshInterval?: number;
}

class DataService {
  private config: DataServiceConfig;
  private lastRefresh: Date = new Date();

  constructor(config: DataServiceConfig = { mode: 'demo', useGeneratedData: true }) {
    this.config = config;
  }

  // Main data fetching methods
  async getCampaigns(): Promise<Campaign[]> {
    if (this.config.mode === 'production') {
      return this.fetchRealCampaigns();
    }
    
    if (this.config.useGeneratedData) {
      return campaignDataGenerator.generateCampaigns();
    }
    
    return staticCampaigns as Campaign[];
  }

  async getCreatives(): Promise<Creative[]> {
    if (this.config.mode === 'production') {
      return this.fetchRealCreatives();
    }
    
    if (this.config.useGeneratedData) {
      return creativeDataGenerator.generateCreatives();
    }
    
    return staticCreatives as Creative[];
  }

  async getAlerts(): Promise<Alert[]> {
    if (this.config.mode === 'production') {
      return this.fetchRealAlerts();
    }
    
    if (this.config.useGeneratedData) {
      return alertDataGenerator.generateAlerts();
    }
    
    return staticAlerts as Alert[];
  }

  async getAudienceInsights(): Promise<AudienceInsight> {
    if (this.config.mode === 'production') {
      return this.fetchRealAudienceInsights();
    }
    
    if (this.config.useGeneratedData) {
      return audienceDataGenerator.generateAudienceInsights();
    }
    
    return staticAudienceData as AudienceInsight;
  }

  // Refresh data (simulates API calls in demo mode)
  async refreshData(): Promise<{
    campaigns: Campaign[];
    creatives: Creative[];
    alerts: Alert[];
    audienceInsights: AudienceInsight;
  }> {
    console.log(`Refreshing data in ${this.config.mode} mode...`);
    this.lastRefresh = new Date();

    if (this.config.mode === 'demo') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const [campaigns, creatives, alerts, audienceInsights] = await Promise.all([
      this.getCampaigns(),
      this.getCreatives(),
      this.getAlerts(),
      this.getAudienceInsights()
    ]);

    return { campaigns, creatives, alerts, audienceInsights };
  }

  // Campaign-specific operations (ready for LinkedIn API)
  async updateCampaign(campaignId: string, updates: Partial<Campaign>): Promise<Campaign> {
    if (this.config.mode === 'production') {
      // Will call LinkedIn API
      return this.updateRealCampaign(campaignId, updates);
    }

    // Demo mode - simulate update
    console.log(`Demo: Updating campaign ${campaignId}`, updates);
    const campaigns = await this.getCampaigns();
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) throw new Error('Campaign not found');
    
    return { ...campaign, ...updates };
  }

  async pauseCampaign(campaignId: string): Promise<void> {
    if (this.config.mode === 'production') {
      return this.pauseRealCampaign(campaignId);
    }

    console.log(`Demo: Paused campaign ${campaignId}`);
  }

  // Configuration methods
  setMode(mode: 'demo' | 'production'): void {
    this.config.mode = mode;
    console.log(`Data service switched to ${mode} mode`);
  }

  toggleGeneratedData(): void {
    this.config.useGeneratedData = !this.config.useGeneratedData;
    console.log(`Generated data: ${this.config.useGeneratedData ? 'enabled' : 'disabled'}`);
  }

  getLastRefresh(): Date {
    return this.lastRefresh;
  }

  getConfig(): DataServiceConfig {
    return { ...this.config };
  }

  // Production API methods (placeholders for real implementation)
  private async fetchRealCampaigns(): Promise<Campaign[]> {
    // TODO: Implement LinkedIn API calls
    throw new Error('Production LinkedIn API not yet implemented');
  }

  private async fetchRealCreatives(): Promise<Creative[]> {
    // TODO: Implement LinkedIn API calls
    throw new Error('Production LinkedIn API not yet implemented');
  }

  private async fetchRealAlerts(): Promise<Alert[]> {
    // TODO: Implement real alert generation
    throw new Error('Production alert system not yet implemented');
  }

  private async fetchRealAudienceInsights(): Promise<AudienceInsight> {
    // TODO: Implement LinkedIn API calls
    throw new Error('Production LinkedIn API not yet implemented');
  }

  private async updateRealCampaign(campaignId: string, updates: Partial<Campaign>): Promise<Campaign> {
    // TODO: Implement LinkedIn API calls
    throw new Error('Production LinkedIn API not yet implemented');
  }

  private async pauseRealCampaign(campaignId: string): Promise<void> {
    // TODO: Implement LinkedIn API calls
    throw new Error('Production LinkedIn API not yet implemented');
  }
}

// Export singleton instance
export const dataService = new DataService();
export type { DataServiceConfig };