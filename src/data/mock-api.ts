// Mock API layer that simulates real LinkedIn API responses

interface MockApiConfig {
  latency: number; // Simulated API latency in ms
  errorRate: number; // Percentage of requests that should fail (0-100)
  enableLogging: boolean;
}

class MockLinkedInApi {
  private config: MockApiConfig = {
    latency: 800,
    errorRate: 2,
    enableLogging: true
  };

  private log(message: string, data?: any) {
    if (this.config.enableLogging) {
      console.log(`[Mock LinkedIn API] ${message}`, data || '');
    }
  }

  private async simulateApiCall<T>(
    endpoint: string,
    operation: () => T,
    customLatency?: number
  ): Promise<T> {
    const latency = customLatency || this.config.latency;
    
    this.log(`API Call: ${endpoint} (${latency}ms latency)`);
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, latency));
    
    // Simulate random errors
    if (Math.random() * 100 < this.config.errorRate) {
      const error = new Error(`Simulated API error for ${endpoint}`);
      this.log(`API Error: ${endpoint}`, error.message);
      throw error;
    }

    const result = operation();
    this.log(`API Success: ${endpoint}`, result);
    return result;
  }

  // Account management
  async getAdAccounts(): Promise<any[]> {
    return this.simulateApiCall('GET /adAccounts', () => [
      {
        id: 'account_123',
        name: 'Workjam Marketing',
        status: 'ACTIVE',
        currency: 'USD',
        timezone: 'America/New_York',
        type: 'BUSINESS'
      }
    ]);
  }

  // Campaign management
  async getCampaigns(accountId: string): Promise<any[]> {
    return this.simulateApiCall(`GET /adCampaigns?account=${accountId}`, () => {
      // Return campaigns from our data generators
      const { campaignDataGenerator } = require('./generators/campaign-generator');
      return campaignDataGenerator.generateCampaigns(4);
    });
  }

  async createCampaign(accountId: string, campaignData: any): Promise<any> {
    return this.simulateApiCall(
      'POST /adCampaigns',
      () => ({
        id: `camp_${Date.now()}`,
        ...campaignData,
        status: 'DRAFT',
        createdAt: new Date().toISOString()
      }),
      1200 // Longer latency for create operations
    );
  }

  async updateCampaign(campaignId: string, updates: any): Promise<any> {
    return this.simulateApiCall(
      `PATCH /adCampaigns/${campaignId}`,
      () => ({
        id: campaignId,
        ...updates,
        lastModified: new Date().toISOString()
      }),
      600
    );
  }

  async pauseCampaign(campaignId: string): Promise<void> {
    return this.simulateApiCall(
      `POST /adCampaigns/${campaignId}/pause`,
      () => {
        this.log(`Campaign ${campaignId} paused successfully`);
      },
      400
    );
  }

  async resumeCampaign(campaignId: string): Promise<void> {
    return this.simulateApiCall(
      `POST /adCampaigns/${campaignId}/resume`,
      () => {
        this.log(`Campaign ${campaignId} resumed successfully`);
      },
      400
    );
  }

  // Analytics
  async getCampaignAnalytics(
    campaignIds: string[],
    dateRange: { start: string; end: string },
    metrics: string[]
  ): Promise<any[]> {
    return this.simulateApiCall(
      `GET /adAnalytics?campaigns=${campaignIds.join(',')}`,
      () => {
        return campaignIds.map(campaignId => ({
          campaignId,
          dateRange,
          metrics: {
            impressions: Math.floor(Math.random() * 50000) + 30000,
            clicks: Math.floor(Math.random() * 2000) + 800,
            spend: Math.floor(Math.random() * 5000) + 2000,
            conversions: Math.floor(Math.random() * 50) + 10
          }
        }));
      },
      1500 // Analytics queries typically take longer
    );
  }

  async getAudienceInsights(campaignId: string): Promise<any> {
    return this.simulateApiCall(
      `GET /audienceInsights/${campaignId}`,
      () => {
        const { audienceDataGenerator } = require('./generators/audience-generator');
        return audienceDataGenerator.generateAudienceInsights();
      },
      2000 // Audience insights are complex queries
    );
  }

  // Creative management
  async getCreatives(campaignId: string): Promise<any[]> {
    return this.simulateApiCall(
      `GET /adCreatives?campaign=${campaignId}`,
      () => {
        const { creativeDataGenerator } = require('./generators/creative-generator');
        return creativeDataGenerator.generateCreatives([campaignId]);
      }
    );
  }

  async createCreative(creativeData: any): Promise<any> {
    return this.simulateApiCall(
      'POST /adCreatives',
      () => ({
        id: `creative_${Date.now()}`,
        ...creativeData,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      }),
      900
    );
  }

  // Batch operations
  async batchUpdateCampaigns(updates: Array<{ id: string; data: any }>): Promise<any[]> {
    return this.simulateApiCall(
      'POST /adCampaigns/batch',
      () => {
        return updates.map(update => ({
          id: update.id,
          success: Math.random() > 0.1, // 90% success rate
          data: update.data
        }));
      },
      2500 // Batch operations take longer
    );
  }

  // Rate limiting simulation
  async checkRateLimit(): Promise<{ remaining: number; resetTime: string }> {
    return this.simulateApiCall(
      'GET /rateLimit',
      () => ({
        remaining: Math.floor(Math.random() * 500) + 100,
        resetTime: new Date(Date.now() + 60 * 60 * 1000).toISOString()
      }),
      100 // Rate limit checks are fast
    );
  }

  // Configuration methods
  setLatency(ms: number): void {
    this.config.latency = ms;
    this.log(`API latency set to ${ms}ms`);
  }

  setErrorRate(percentage: number): void {
    this.config.errorRate = Math.max(0, Math.min(100, percentage));
    this.log(`API error rate set to ${this.config.errorRate}%`);
  }

  enableLogging(enabled: boolean): void {
    this.config.enableLogging = enabled;
    if (enabled) {
      this.log('API logging enabled');
    }
  }

  // Webhook simulation (for real-time updates)
  simulateWebhook(eventType: string, data: any): void {
    setTimeout(() => {
      const event = {
        timestamp: new Date().toISOString(),
        type: eventType,
        data
      };
      
      // In a real app, this would trigger WebSocket or Server-Sent Events
      window.dispatchEvent(new CustomEvent('linkedinWebhook', { detail: event }));
      this.log(`Webhook simulated: ${eventType}`, event);
    }, Math.random() * 5000); // Random delay 0-5 seconds
  }

  // Simulate connection issues
  simulateConnectionIssue(durationMs: number = 5000): void {
    const originalErrorRate = this.config.errorRate;
    this.config.errorRate = 100; // All requests fail
    
    this.log(`Simulating connection issues for ${durationMs}ms`);
    
    setTimeout(() => {
      this.config.errorRate = originalErrorRate;
      this.log('Connection restored');
    }, durationMs);
  }
}

export const mockLinkedInApi = new MockLinkedInApi();
export type { MockApiConfig };