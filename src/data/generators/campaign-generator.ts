import { Campaign } from '../../types';

interface CampaignTemplate {
  namePattern: string;
  industryFocus: string;
  targetAudience: string;
  baseBudget: number;
  expectedCTR: number;
  seasonalMultiplier: number;
}

class CampaignDataGenerator {
  private templates: CampaignTemplate[] = [
    {
      namePattern: "Q{quarter} {audience} - {product}",
      industryFocus: "SaaS",
      targetAudience: "Developer Persona",
      baseBudget: 25000,
      expectedCTR: 2.8,
      seasonalMultiplier: 1.0
    },
    {
      namePattern: "Enterprise {role} Outreach - {solution}",
      industryFocus: "Enterprise",
      targetAudience: "C-Suite",
      baseBudget: 40000,
      expectedCTR: 3.2,
      seasonalMultiplier: 1.2
    },
    {
      namePattern: "{segment} {audience} - {category}",
      industryFocus: "Mid-Market",
      targetAudience: "SaaS Leaders",
      baseBudget: 15000,
      expectedCTR: 2.1,
      seasonalMultiplier: 0.9
    },
    {
      namePattern: "Startup {role} - {focus}",
      industryFocus: "Startup",
      targetAudience: "Founders",
      baseBudget: 20000,
      expectedCTR: 3.8,
      seasonalMultiplier: 1.1
    }
  ];

  private products = ["Cloud Solutions", "AI Platform", "Integration Tools", "Growth Analytics", "Data Pipeline", "Security Suite"];
  private roles = ["CTO", "VP Engineering", "Product Manager", "Founders", "Data Scientists"];
  private solutions = ["AI Platform", "DevOps Tools", "Analytics Suite", "Security Platform"];
  private segments = ["Mid-Market", "Enterprise", "SMB", "Global"];
  private categories = ["Integration Tools", "Analytics Platform", "Workflow Automation", "Business Intelligence"];

  generateCampaigns(count: number = 4): Campaign[] {
    const campaigns: Campaign[] = [];
    const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);

    for (let i = 0; i < count; i++) {
      const template = this.templates[i % this.templates.length];
      const campaign = this.generateCampaignFromTemplate(template, i, currentQuarter);
      campaigns.push(campaign);
    }

    return campaigns;
  }

  private generateCampaignFromTemplate(template: CampaignTemplate, index: number, quarter: number): Campaign {
    const name = this.generateCampaignName(template, quarter);
    const baseMetrics = this.generateBaseMetrics(template, index);
    const budget = this.generateBudgetData(template.baseBudget, baseMetrics.spend);
    const weeklyData = this.generateWeeklyData(baseMetrics);

    return {
      id: `camp_${String(index + 1).padStart(3, '0')}`,
      name,
      status: this.getRandomStatus(),
      budget,
      metrics: baseMetrics,
      trend: this.calculateTrend(baseMetrics.ctr, template.expectedCTR),
      last_7_days: weeklyData
    };
  }

  private generateCampaignName(template: CampaignTemplate, quarter: number): string {
    const replacements: { [key: string]: string } = {
      '{quarter}': `Q${quarter}`,
      '{audience}': template.targetAudience,
      '{product}': this.getRandomFromArray(this.products),
      '{role}': this.getRandomFromArray(this.roles),
      '{solution}': this.getRandomFromArray(this.solutions),
      '{segment}': this.getRandomFromArray(this.segments),
      '{category}': this.getRandomFromArray(this.categories),
      '{focus}': this.getRandomFromArray(["Growth Analytics", "Performance Tools", "Optimization Suite"])
    };

    let name = template.namePattern;
    Object.entries(replacements).forEach(([key, value]) => {
      name = name.replace(key, value);
    });

    return name;
  }

  private generateBaseMetrics(template: CampaignTemplate, index: number) {
    const impressions = this.getRandomBetween(80000, 130000);
    const ctrVariation = this.getRandomBetween(-0.8, 1.2);
    const ctr = Math.max(0.5, template.expectedCTR + ctrVariation);
    const clicks = Math.round(impressions * (ctr / 100));
    
    const cpcBase = this.getRandomBetween(3.50, 8.00);
    const spend = Math.round(clicks * cpcBase);
    
    const conversionRate = this.getRandomBetween(0.8, 4.2);
    const conversions = Math.round(clicks * (conversionRate / 100));
    const costPerConversion = conversions > 0 ? spend / conversions : 0;

    return {
      impressions,
      clicks,
      ctr: Math.round(ctr * 100) / 100,
      cpc: Math.round(cpcBase * 100) / 100,
      conversions,
      spend,
      cost_per_conversion: Math.round(costPerConversion * 100) / 100
    };
  }

  private generateBudgetData(baseBudget: number, spent: number) {
    const total = baseBudget + this.getRandomBetween(-5000, 10000);
    const actualSpent = Math.min(spent, total * 0.95); // Cap at 95% of budget
    const remaining = total - actualSpent;

    return {
      total,
      spent: actualSpent,
      remaining: Math.max(0, remaining)
    };
  }

  private generateWeeklyData(baseMetrics: any) {
    const weeklyMultiplier = this.getRandomBetween(0.15, 0.25);
    const trendMultiplier = this.getRandomBetween(0.8, 1.3);
    
    return {
      impressions: Math.round(baseMetrics.impressions * weeklyMultiplier),
      clicks: Math.round(baseMetrics.clicks * weeklyMultiplier * trendMultiplier),
      ctr: Math.round((baseMetrics.clicks * weeklyMultiplier * trendMultiplier) / (baseMetrics.impressions * weeklyMultiplier) * 10000) / 100,
      spend: Math.round(baseMetrics.spend * weeklyMultiplier * trendMultiplier)
    };
  }

  private calculateTrend(actualCTR: number, expectedCTR: number): Campaign['trend'] {
    const ratio = actualCTR / expectedCTR;
    
    if (ratio >= 1.4) return 'strong';
    if (ratio >= 1.1) return 'improving';
    if (ratio >= 0.9) return 'stable';
    if (ratio >= 0.7) return 'declining';
    return 'poor';
  }

  private getRandomStatus(): Campaign['status'] {
    const statuses: Campaign['status'][] = ['active', 'active', 'active', 'paused']; // 75% active
    return this.getRandomFromArray(statuses);
  }

  private getRandomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // Time-based variations for realistic data changes
  applyTimeBasedVariations(campaigns: Campaign[]): Campaign[] {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    return campaigns.map(campaign => {
      let multiplier = 1.0;

      // Business hours boost (9 AM - 5 PM)
      if (hour >= 9 && hour <= 17) {
        multiplier *= 1.2;
      }

      // Weekday boost
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        multiplier *= 1.1;
      }

      // Random small variations
      multiplier *= this.getRandomBetween(0.95, 1.05);

      return {
        ...campaign,
        metrics: {
          ...campaign.metrics,
          spend: Math.round(campaign.metrics.spend * multiplier),
          clicks: Math.round(campaign.metrics.clicks * multiplier),
          impressions: Math.round(campaign.metrics.impressions * multiplier)
        }
      };
    });
  }
}

export const campaignDataGenerator = new CampaignDataGenerator();