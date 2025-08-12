// API Adapter that can switch between mock and real LinkedIn API

import { mockLinkedInApi } from '../data/mock-api';
import { linkedInApi } from './linkedin-api';
import { Campaign, Creative, Alert, AudienceInsight } from '../types';

interface ApiAdapter {
  getCampaigns(): Promise<Campaign[]>;
  getCreatives(): Promise<Creative[]>;
  getAudienceInsights(): Promise<AudienceInsight>;
  updateCampaign(campaignId: string, updates: any): Promise<Campaign>;
  pauseCampaign(campaignId: string): Promise<void>;
  resumeCampaign(campaignId: string): Promise<void>;
}

class LinkedInApiAdapter implements ApiAdapter {
  private useMockApi: boolean;

  constructor(useMockApi: boolean = true) {
    this.useMockApi = useMockApi;
  }

  async getCampaigns(): Promise<Campaign[]> {
    if (this.useMockApi) {
      const accounts = await mockLinkedInApi.getAdAccounts();
      const campaigns = await mockLinkedInApi.getCampaigns(accounts[0]?.id || 'demo_account');
      return campaigns;
    } else {
      // Real LinkedIn API implementation
      const accounts = await linkedInApi.getAdAccounts();
      const campaigns = await linkedInApi.getCampaigns(accounts[0]?.id || '');
      return campaigns;
    }
  }

  async getCreatives(): Promise<Creative[]> {
    if (this.useMockApi) {
      const campaigns = await this.getCampaigns();
      const allCreatives: Creative[] = [];
      
      for (const campaign of campaigns) {
        const creatives = await mockLinkedInApi.getCreatives(campaign.id);
        allCreatives.push(...creatives);
      }
      
      return allCreatives;
    } else {
      // Real LinkedIn API implementation
      const campaigns = await this.getCampaigns();
      const allCreatives: Creative[] = [];
      
      for (const campaign of campaigns) {
        const creatives = await linkedInApi.getAdCreatives(campaign.id);
        allCreatives.push(...creatives);
      }
      
      return allCreatives;
    }
  }

  async getAudienceInsights(): Promise<AudienceInsight> {
    if (this.useMockApi) {
      const campaigns = await this.getCampaigns();
      return mockLinkedInApi.getAudienceInsights(campaigns[0]?.id || 'demo');
    } else {
      // Real LinkedIn API implementation
      const campaigns = await this.getCampaigns();
      return linkedInApi.getAudienceInsights(campaigns[0]?.id || '');
    }
  }

  async updateCampaign(campaignId: string, updates: any): Promise<Campaign> {
    if (this.useMockApi) {
      return mockLinkedInApi.updateCampaign(campaignId, updates);
    } else {
      await linkedInApi.updateCampaign(campaignId, updates);
      // Return updated campaign (would need to fetch it in real implementation)
      const campaigns = await this.getCampaigns();
      return campaigns.find(c => c.id === campaignId) || campaigns[0];
    }
  }

  async pauseCampaign(campaignId: string): Promise<void> {
    if (this.useMockApi) {
      return mockLinkedInApi.pauseCampaign(campaignId);
    } else {
      return linkedInApi.pauseCampaign(campaignId);
    }
  }

  async resumeCampaign(campaignId: string): Promise<void> {
    if (this.useMockApi) {
      return mockLinkedInApi.resumeCampaign(campaignId);
    } else {
      return linkedInApi.resumeCampaign(campaignId);
    }
  }

  // Mode switching
  switchToMockApi(): void {
    this.useMockApi = true;
    console.log('Switched to Mock API mode');
  }

  switchToRealApi(): void {
    this.useMockApi = false;
    console.log('Switched to Real LinkedIn API mode');
  }

  isMockMode(): boolean {
    return this.useMockApi;
  }

  // Configuration for mock API
  configureMockApi(config: { latency?: number; errorRate?: number }) {
    if (this.useMockApi) {
      if (config.latency) mockLinkedInApi.setLatency(config.latency);
      if (config.errorRate) mockLinkedInApi.setErrorRate(config.errorRate);
    }
  }
}

// Export singleton instance
export const apiAdapter = new LinkedInApiAdapter(true); // Start in mock mode
export type { ApiAdapter };