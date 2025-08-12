// Conversion funnel and attribution modeling simulation

interface ConversionFunnel {
  campaignId: string;
  stages: FunnelStage[];
  totalValue: number;
  conversionWindows: {
    view: number; // days
    click: number; // days
  };
  attributionModel: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based';
}

interface FunnelStage {
  name: string;
  visitors: number;
  conversionRate: number;
  dropoffRate: number;
  averageTimeToNext: number; // hours
  value: number;
}

interface TouchPoint {
  id: string;
  type: 'impression' | 'click' | 'email' | 'direct' | 'organic';
  source: string;
  timestamp: Date;
  value: number;
  attribution: number; // percentage of credit
}

class ConversionFunnelGenerator {
  generateConversionFunnels(campaigns: any[]): ConversionFunnel[] {
    return campaigns.map(campaign => ({
      campaignId: campaign.id,
      stages: this.generateFunnelStages(campaign),
      totalValue: this.calculateTotalValue(campaign),
      conversionWindows: { view: 7, click: 30 },
      attributionModel: this.getRandomAttributionModel()
    }));
  }

  private generateFunnelStages(campaign: any): FunnelStage[] {
    const impressions = campaign.metrics.impressions;
    
    return [
      {
        name: 'Ad View',
        visitors: impressions,
        conversionRate: 100,
        dropoffRate: 0,
        averageTimeToNext: 0,
        value: 0
      },
      {
        name: 'Click',
        visitors: campaign.metrics.clicks,
        conversionRate: (campaign.metrics.clicks / impressions) * 100,
        dropoffRate: 100 - (campaign.metrics.clicks / impressions) * 100,
        averageTimeToNext: this.getRandomBetween(0.1, 2), // minutes to hours
        value: 0
      },
      {
        name: 'Landing Page Visit',
        visitors: Math.floor(campaign.metrics.clicks * 0.95), // 95% reach landing page
        conversionRate: 95,
        dropoffRate: 5,
        averageTimeToNext: this.getRandomBetween(1, 5),
        value: 0
      },
      {
        name: 'Form Start',
        visitors: Math.floor(campaign.metrics.clicks * 0.45), // 45% start form
        conversionRate: 47.4, // 45/95
        dropoffRate: 52.6,
        averageTimeToNext: this.getRandomBetween(0.5, 3),
        value: 5 // micro-conversion value
      },
      {
        name: 'Form Submit',
        visitors: Math.floor(campaign.metrics.clicks * 0.25), // 25% submit form
        conversionRate: 55.6, // 25/45
        dropoffRate: 44.4,
        averageTimeToNext: this.getRandomBetween(24, 168), // 1-7 days
        value: 25
      },
      {
        name: 'Lead Qualified',
        visitors: Math.floor(campaign.metrics.conversions * 0.8), // 80% of conversions qualify
        conversionRate: (campaign.metrics.conversions * 0.8) / (campaign.metrics.clicks * 0.25) * 100,
        dropoffRate: 100 - (campaign.metrics.conversions * 0.8) / (campaign.metrics.clicks * 0.25) * 100,
        averageTimeToNext: this.getRandomBetween(168, 720), // 1-4 weeks
        value: 100
      },
      {
        name: 'Opportunity',
        visitors: Math.floor(campaign.metrics.conversions * 0.4), // 40% become opportunities
        conversionRate: 50,
        dropoffRate: 50,
        averageTimeToNext: this.getRandomBetween(720, 2160), // 4-12 weeks
        value: 500
      },
      {
        name: 'Customer',
        visitors: Math.floor(campaign.metrics.conversions * 0.15), // 15% close
        conversionRate: 37.5, // 15/40
        dropoffRate: 62.5,
        averageTimeToNext: 0,
        value: 5000
      }
    ];
  }

  private calculateTotalValue(campaign: any): number {
    const closedDeals = Math.floor(campaign.metrics.conversions * 0.15);
    const avgDealSize = this.getRandomBetween(8000, 25000);
    return closedDeals * avgDealSize;
  }

  private getRandomAttributionModel(): ConversionFunnel['attributionModel'] {
    const models: ConversionFunnel['attributionModel'][] = [
      'first_touch', 'last_touch', 'linear', 'time_decay', 'position_based'
    ];
    return models[Math.floor(Math.random() * models.length)];
  }

  // Generate multi-touch attribution data
  generateAttributionJourney(campaignId: string): TouchPoint[] {
    const journey: TouchPoint[] = [];
    const totalTouchpoints = Math.floor(Math.random() * 8) + 3; // 3-10 touchpoints
    
    for (let i = 0; i < totalTouchpoints; i++) {
      const timestamp = new Date(Date.now() - (totalTouchpoints - i) * 24 * 60 * 60 * 1000 * Math.random());
      
      journey.push({
        id: `touchpoint_${i + 1}`,
        type: this.getTouchpointType(i, totalTouchpoints),
        source: this.getTouchpointSource(i),
        timestamp,
        value: this.getTouchpointValue(i, totalTouchpoints),
        attribution: this.calculateAttribution(i, totalTouchpoints, 'linear')
      });
    }

    return journey;
  }

  private getTouchpointType(index: number, total: number): TouchPoint['type'] {
    if (index === 0) return 'impression';
    if (index === total - 1) return 'click';
    
    const types: TouchPoint['type'][] = ['impression', 'click', 'email', 'direct', 'organic'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getTouchpointSource(index: number): string {
    const sources = [
      'LinkedIn Ads', 'Google Search', 'Email Campaign', 'Direct Traffic', 
      'Organic Social', 'Referral', 'Content Marketing', 'Webinar'
    ];
    return sources[Math.floor(Math.random() * sources.length)];
  }

  private getTouchpointValue(index: number, total: number): number {
    // First and last touches are more valuable
    if (index === 0 || index === total - 1) {
      return this.getRandomBetween(800, 1500);
    }
    return this.getRandomBetween(200, 800);
  }

  private calculateAttribution(index: number, total: number, model: string): number {
    switch (model) {
      case 'first_touch':
        return index === 0 ? 100 : 0;
      case 'last_touch':
        return index === total - 1 ? 100 : 0;
      case 'linear':
        return 100 / total;
      case 'time_decay':
        // More recent touchpoints get more credit
        const decayRate = 0.8;
        const weight = Math.pow(decayRate, total - index - 1);
        return weight * 100 / total;
      case 'position_based':
        // 40% first, 40% last, 20% distributed among middle
        if (index === 0) return 40;
        if (index === total - 1) return 40;
        return 20 / (total - 2);
      default:
        return 100 / total;
    }
  }

  // Generate funnel optimization recommendations
  generateFunnelRecommendations(funnel: ConversionFunnel): Array<{
    stage: string;
    issue: string;
    recommendation: string;
    expectedImprovement: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    const recommendations = [];
    
    // Analyze each stage for improvement opportunities
    funnel.stages.forEach((stage, index) => {
      if (stage.dropoffRate > 60 && index > 1) {
        recommendations.push({
          stage: stage.name,
          issue: `High dropoff rate (${stage.dropoffRate.toFixed(1)}%)`,
          recommendation: `Optimize ${stage.name.toLowerCase()} experience with A/B testing`,
          expectedImprovement: `+${Math.floor(stage.dropoffRate * 0.2)}% conversion rate`,
          priority: stage.dropoffRate > 80 ? 'high' as const : 'medium' as const
        });
      }
      
      if (stage.averageTimeToNext > 48 && index < funnel.stages.length - 2) {
        recommendations.push({
          stage: stage.name,
          issue: `Long time to next stage (${stage.averageTimeToNext.toFixed(1)} hours)`,
          recommendation: 'Implement lead nurturing automation to accelerate progression',
          expectedImprovement: `Reduce time by 30-40%`,
          priority: 'medium' as const
        });
      }
    });

    return recommendations;
  }

  private getRandomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}

export const conversionFunnelGenerator = new ConversionFunnelGenerator();