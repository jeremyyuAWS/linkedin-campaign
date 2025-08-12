export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  metrics: {
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    conversions: number;
    spend: number;
    cost_per_conversion: number;
  };
  trend: 'improving' | 'declining' | 'stable' | 'strong' | 'poor';
  last_7_days: {
    impressions: number;
    clicks: number;
    ctr: number;
    spend: number;
  };
}

export interface Creative {
  id: string;
  campaign_id: string;
  type: string;
  headline: string;
  description: string;
  image_url: string;
  performance: {
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
  };
  status: 'active' | 'paused';
}

export interface Alert {
  id: string;
  type: 'performance_drop' | 'budget_warning' | 'opportunity' | 'optimization';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  campaign: string;
  recommendation: string;
  timestamp: string;
  status: 'read' | 'unread';
}

export interface AudienceInsight {
  job_titles: Array<{
    title: string;
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
    cost_per_conversion: number;
  }>;
  company_sizes: Array<{
    size: string;
    impressions: number;
    clicks: number;
    ctr: number;
    conversions: number;
    cost_per_conversion: number;
  }>;
}