import { authService } from './auth';

interface CampaignData {
  id: string;
  name: string;
  status: string;
  dailyBudget: number;
  totalBudget: number;
  startDate: string;
  endDate?: string;
  objective: string;
  targeting: any;
  creativeIds: string[];
}

interface CampaignMetrics {
  campaignId: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  dateRange: {
    start: string;
    end: string;
  };
}

interface AdCreative {
  id: string;
  campaignId: string;
  headline: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  callToAction: string;
  landingPageUrl: string;
}

class LinkedInApiService {
  private readonly baseUrl = 'https://api.linkedin.com/rest';
  private readonly apiVersion = '202309';

  // Get all ad accounts
  async getAdAccounts(): Promise<any[]> {
    const token = authService.getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${this.baseUrl}/adAccounts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': this.apiVersion,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ad accounts');
    }

    const data = await response.json();
    return data.elements || [];
  }

  // Get campaigns for an ad account
  async getCampaigns(adAccountId: string): Promise<CampaignData[]> {
    const token = authService.getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const params = new URLSearchParams({
      q: 'search',
      search: JSON.stringify({
        account: {
          values: [adAccountId]
        }
      })
    });

    const response = await fetch(`${this.baseUrl}/adCampaigns?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': this.apiVersion,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    const data = await response.json();
    return this.transformCampaignData(data.elements || []);
  }

  // Get campaign analytics
  async getCampaignAnalytics(
    campaignIds: string[], 
    dateRange: { start: string; end: string }
  ): Promise<CampaignMetrics[]> {
    const token = authService.getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const params = new URLSearchParams({
      q: 'analytics',
      pivot: 'CAMPAIGN',
      dateRange: JSON.stringify({
        start: { year: 2024, month: 1, day: 1 },
        end: { year: 2024, month: 12, day: 31 }
      }),
      campaigns: JSON.stringify(campaignIds),
      fields: 'impressions,clicks,costInLocalCurrency,externalWebsiteConversions'
    });

    const response = await fetch(`${this.baseUrl}/adAnalytics?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': this.apiVersion,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    const data = await response.json();
    return this.transformAnalyticsData(data.elements || []);
  }

  // Get ad creatives
  async getAdCreatives(campaignId: string): Promise<AdCreative[]> {
    const token = authService.getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const params = new URLSearchParams({
      q: 'search',
      search: JSON.stringify({
        campaign: {
          values: [campaignId]
        }
      })
    });

    const response = await fetch(`${this.baseUrl}/adCreatives?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': this.apiVersion,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch creatives');
    }

    const data = await response.json();
    return this.transformCreativeData(data.elements || []);
  }

  // Update campaign (for automation)
  async updateCampaign(campaignId: string, updates: Partial<CampaignData>): Promise<void> {
    const token = authService.getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${this.baseUrl}/adCampaigns/${campaignId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': this.apiVersion,
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error('Failed to update campaign');
    }
  }

  // Pause campaign
  async pauseCampaign(campaignId: string): Promise<void> {
    await this.updateCampaign(campaignId, { status: 'PAUSED' });
  }

  // Resume campaign
  async resumeCampaign(campaignId: string): Promise<void> {
    await this.updateCampaign(campaignId, { status: 'ACTIVE' });
  }

  // Update campaign budget
  async updateCampaignBudget(campaignId: string, newBudget: number): Promise<void> {
    await this.updateCampaign(campaignId, { dailyBudget: newBudget });
  }

  // Transform LinkedIn API campaign data to our format
  private transformCampaignData(apiData: any[]): CampaignData[] {
    return apiData.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.runSchedule?.runScheduleType || 'UNKNOWN',
      dailyBudget: campaign.dailyBudget?.amount || 0,
      totalBudget: campaign.totalBudget?.amount || 0,
      startDate: campaign.runSchedule?.start ? 
        this.formatLinkedInDate(campaign.runSchedule.start) : '',
      endDate: campaign.runSchedule?.end ? 
        this.formatLinkedInDate(campaign.runSchedule.end) : undefined,
      objective: campaign.objective || 'UNKNOWN',
      targeting: campaign.targeting || {},
      creativeIds: campaign.associatedEntity || []
    }));
  }

  // Transform LinkedIn API analytics data
  private transformAnalyticsData(apiData: any[]): CampaignMetrics[] {
    return apiData.map(analytics => ({
      campaignId: analytics.pivot,
      impressions: analytics.impressions || 0,
      clicks: analytics.clicks || 0,
      spend: analytics.costInLocalCurrency || 0,
      conversions: analytics.externalWebsiteConversions || 0,
      dateRange: {
        start: analytics.dateRange?.start || '',
        end: analytics.dateRange?.end || ''
      }
    }));
  }

  // Transform LinkedIn API creative data
  private transformCreativeData(apiData: any[]): AdCreative[] {
    return apiData.map(creative => ({
      id: creative.id,
      campaignId: creative.campaign,
      headline: creative.content?.title || '',
      description: creative.content?.description || '',
      imageUrl: creative.content?.primaryImageAsset || undefined,
      videoUrl: creative.content?.videoAsset || undefined,
      callToAction: creative.content?.callToAction?.type || '',
      landingPageUrl: creative.content?.landingPage || ''
    }));
  }

  // Helper to format LinkedIn date objects
  private formatLinkedInDate(dateObj: any): string {
    if (!dateObj) return '';
    return `${dateObj.year}-${String(dateObj.month).padStart(2, '0')}-${String(dateObj.day).padStart(2, '0')}`;
  }

  // Get audience insights
  async getAudienceInsights(campaignId: string): Promise<any> {
    const token = authService.getAccessToken();
    if (!token) throw new Error('Not authenticated');

    // This would be a custom endpoint for audience analytics
    const response = await fetch(`${this.baseUrl}/audienceInsights/${campaignId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': this.apiVersion
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch audience insights');
    }

    return response.json();
  }
}

export const linkedInApi = new LinkedInApiService();
export type { CampaignData, CampaignMetrics, AdCreative };