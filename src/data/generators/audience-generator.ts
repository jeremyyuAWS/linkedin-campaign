import { AudienceInsight } from '../../types';

interface JobTitleProfile {
  title: string;
  seniority: 'entry' | 'mid' | 'senior' | 'executive';
  industry: string[];
  expectedCTR: number;
  expectedCost: number;
  volume: 'high' | 'medium' | 'low';
}

interface CompanySizeProfile {
  size: string;
  category: 'startup' | 'scale-up' | 'mid-market' | 'enterprise';
  decisionSpeed: 'fast' | 'medium' | 'slow';
  expectedCTR: number;
  expectedCost: number;
}

class AudienceDataGenerator {
  private jobTitleProfiles: JobTitleProfile[] = [
    {
      title: "Software Engineer",
      seniority: "mid",
      industry: ["tech", "saas", "fintech"],
      expectedCTR: 3.8,
      expectedCost: 120,
      volume: "high"
    },
    {
      title: "Engineering Manager",
      seniority: "senior", 
      industry: ["tech", "enterprise"],
      expectedCTR: 3.2,
      expectedCost: 145,
      volume: "medium"
    },
    {
      title: "CTO",
      seniority: "executive",
      industry: ["startup", "tech", "enterprise"],
      expectedCTR: 4.2,
      expectedCost: 280,
      volume: "low"
    },
    {
      title: "VP Engineering",
      seniority: "executive",
      industry: ["scale-up", "enterprise"],
      expectedCTR: 3.6,
      expectedCost: 195,
      volume: "medium"
    },
    {
      title: "Technical Lead",
      seniority: "senior",
      industry: ["tech", "consulting"],
      expectedCTR: 3.1,
      expectedCost: 165,
      volume: "medium"
    },
    {
      title: "DevOps Engineer",
      seniority: "mid",
      industry: ["cloud", "infrastructure"],
      expectedCTR: 3.9,
      expectedCost: 135,
      volume: "medium"
    },
    {
      title: "Product Manager",
      seniority: "senior",
      industry: ["product", "saas"],
      expectedCTR: 2.8,
      expectedCost: 175,
      volume: "high"
    },
    {
      title: "Data Scientist",
      seniority: "mid",
      industry: ["analytics", "ai"],
      expectedCTR: 4.1,
      expectedCost: 190,
      volume: "medium"
    }
  ];

  private companySizeProfiles: CompanySizeProfile[] = [
    {
      size: "1-10 employees",
      category: "startup",
      decisionSpeed: "fast",
      expectedCTR: 4.2,
      expectedCost: 85
    },
    {
      size: "11-50 employees", 
      category: "scale-up",
      decisionSpeed: "fast",
      expectedCTR: 3.8,
      expectedCost: 105
    },
    {
      size: "51-200 employees",
      category: "mid-market",
      decisionSpeed: "medium", 
      expectedCTR: 3.2,
      expectedCost: 145
    },
    {
      size: "201-500 employees",
      category: "mid-market",
      decisionSpeed: "medium",
      expectedCTR: 2.9,
      expectedCost: 185
    },
    {
      size: "501-1000 employees",
      category: "enterprise",
      decisionSpeed: "slow",
      expectedCTR: 2.6,
      expectedCost: 220
    },
    {
      size: "1000+ employees",
      category: "enterprise", 
      decisionSpeed: "slow",
      expectedCTR: 2.3,
      expectedCost: 275
    }
  ];

  generateAudienceInsights(): AudienceInsight {
    return {
      job_titles: this.generateJobTitleInsights(),
      company_sizes: this.generateCompanySizeInsights()
    };
  }

  private generateJobTitleInsights() {
    return this.jobTitleProfiles.map(profile => {
      const baseImpressions = this.getVolumeBasedImpressions(profile.volume);
      const actualCTR = this.applyRandomVariation(profile.expectedCTR, 0.3);
      const clicks = Math.round(baseImpressions * (actualCTR / 100));
      const actualCost = this.applyRandomVariation(profile.expectedCost, 0.2);
      
      // Calculate conversions based on seniority (higher seniority = higher conversion rate)
      const conversionRate = this.getConversionRateForSeniority(profile.seniority);
      const conversions = Math.round(clicks * (conversionRate / 100));

      return {
        title: profile.title,
        impressions: baseImpressions,
        clicks,
        ctr: Math.round(actualCTR * 100) / 100,
        conversions,
        cost_per_conversion: Math.round(actualCost * 100) / 100
      };
    });
  }

  private generateCompanySizeInsights() {
    return this.companySizeProfiles.map(profile => {
      const baseImpressions = this.getCompanySizeImpressions(profile.category);
      const actualCTR = this.applyRandomVariation(profile.expectedCTR, 0.25);
      const clicks = Math.round(baseImpressions * (actualCTR / 100));
      const actualCost = this.applyRandomVariation(profile.expectedCost, 0.25);
      
      // Smaller companies typically convert better but with lower volume
      const conversionRate = this.getConversionRateForCompanySize(profile.category);
      const conversions = Math.round(clicks * (conversionRate / 100));

      return {
        size: profile.size,
        impressions: baseImpressions,
        clicks,
        ctr: Math.round(actualCTR * 100) / 100,
        conversions,
        cost_per_conversion: Math.round(actualCost * 100) / 100
      };
    });
  }

  private getVolumeBasedImpressions(volume: 'high' | 'medium' | 'low'): number {
    const baseRanges = {
      high: [40000, 60000],
      medium: [25000, 40000], 
      low: [10000, 25000]
    };

    const [min, max] = baseRanges[volume];
    return Math.floor(Math.random() * (max - min) + min);
  }

  private getCompanySizeImpressions(category: 'startup' | 'scale-up' | 'mid-market' | 'enterprise'): number {
    const baseRanges = {
      startup: [20000, 35000],
      'scale-up': [30000, 45000],
      'mid-market': [35000, 55000],
      enterprise: [45000, 70000]
    };

    const [min, max] = baseRanges[category];
    return Math.floor(Math.random() * (max - min) + min);
  }

  private getConversionRateForSeniority(seniority: string): number {
    const rates = {
      entry: this.getRandomBetween(1.5, 2.5),
      mid: this.getRandomBetween(2.0, 3.5),
      senior: this.getRandomBetween(2.5, 4.0),
      executive: this.getRandomBetween(3.0, 5.0)
    };

    return rates[seniority as keyof typeof rates] || 2.5;
  }

  private getConversionRateForCompanySize(category: string): number {
    const rates = {
      startup: this.getRandomBetween(3.5, 5.0),
      'scale-up': this.getRandomBetween(3.0, 4.5),
      'mid-market': this.getRandomBetween(2.0, 3.5),
      enterprise: this.getRandomBetween(1.5, 2.5)
    };

    return rates[category as keyof typeof rates] || 2.5;
  }

  private applyRandomVariation(baseValue: number, variationPercent: number): number {
    const variation = (Math.random() - 0.5) * 2 * variationPercent;
    return baseValue * (1 + variation);
  }

  private getRandomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // Generate audience expansion recommendations
  generateAudienceExpansionSuggestions(): Array<{
    title: string;
    reasoning: string;
    expectedLift: string;
    confidence: number;
  }> {
    return [
      {
        title: "VP, Data Science",
        reasoning: "Shows 2x higher engagement than similar technical leadership roles",
        expectedLift: "+25% CTR",
        confidence: 0.85
      },
      {
        title: "Director of Engineering",
        reasoning: "High-converting audience with strong budget authority", 
        expectedLift: "+18% conversions",
        confidence: 0.78
      },
      {
        title: "Senior Product Manager",
        reasoning: "Strong performance in related product-focused campaigns",
        expectedLift: "+15% engagement",
        confidence: 0.72
      },
      {
        title: "Lead Developer",
        reasoning: "Similar interests and pain points to top-performing segments",
        expectedLift: "+12% CTR",
        confidence: 0.68
      }
    ];
  }

  // Generate lookalike audience suggestions
  generateLookalikeAudiences(topPerformingSegment: string): Array<{
    name: string;
    similarity: number;
    estimatedReach: number;
    expectedPerformance: string;
  }> {
    return [
      {
        name: `${topPerformingSegment} - Lookalike 1%`,
        similarity: 0.95,
        estimatedReach: 45000,
        expectedPerformance: "90-95% of source audience performance"
      },
      {
        name: `${topPerformingSegment} - Lookalike 3%`,
        similarity: 0.82,
        estimatedReach: 135000,
        expectedPerformance: "75-85% of source audience performance"
      },
      {
        name: `${topPerformingSegment} - Lookalike 5%`,
        similarity: 0.71,
        estimatedReach: 225000,
        expectedPerformance: "65-75% of source audience performance"
      }
    ];
  }

  // Time-based audience insights (business hours, days of week, etc.)
  generateTimeBasedInsights() {
    return {
      hourly_performance: this.generateHourlyData(),
      daily_performance: this.generateDailyData(),
      optimal_times: this.getOptimalTimes()
    };
  }

  private generateHourlyData() {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(hour => ({
      hour,
      ctr: this.getHourBasedCTR(hour),
      volume: this.getHourBasedVolume(hour),
      cost: this.getHourBasedCost(hour)
    }));
  }

  private generateDailyData() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => ({
      day,
      ctr: this.getDayBasedCTR(day),
      volume: this.getDayBasedVolume(day),
      cost: this.getDayBasedCost(day)
    }));
  }

  private getOptimalTimes() {
    return {
      best_hours: ['9-11 AM', '2-4 PM'],
      best_days: ['Tuesday', 'Wednesday', 'Thursday'],
      worst_hours: ['12-1 PM', '6-8 PM'],
      worst_days: ['Saturday', 'Sunday']
    };
  }

  private getHourBasedCTR(hour: number): number {
    // Business hours typically perform better
    if (hour >= 9 && hour <= 17) {
      return this.getRandomBetween(3.2, 4.5);
    } else if (hour >= 7 && hour <= 21) {
      return this.getRandomBetween(2.8, 3.8);
    } else {
      return this.getRandomBetween(1.5, 2.5);
    }
  }

  private getHourBasedVolume(hour: number): number {
    if (hour >= 9 && hour <= 17) {
      return this.getRandomBetween(1500, 2500);
    } else if (hour >= 7 && hour <= 21) {
      return this.getRandomBetween(800, 1500);
    } else {
      return this.getRandomBetween(200, 600);
    }
  }

  private getHourBasedCost(hour: number): number {
    // Higher competition during business hours
    if (hour >= 9 && hour <= 17) {
      return this.getRandomBetween(5.50, 7.50);
    } else {
      return this.getRandomBetween(3.50, 5.50);
    }
  }

  private getDayBasedCTR(day: string): number {
    const weekdayBonus = ['Tuesday', 'Wednesday', 'Thursday'].includes(day) ? 0.5 : 0;
    const weekendPenalty = ['Saturday', 'Sunday'].includes(day) ? -0.8 : 0;
    
    return this.getRandomBetween(2.8, 3.8) + weekdayBonus + weekendPenalty;
  }

  private getDayBasedVolume(day: string): number {
    const weekendMultiplier = ['Saturday', 'Sunday'].includes(day) ? 0.4 : 1.0;
    return Math.round(this.getRandomBetween(8000, 15000) * weekendMultiplier);
  }

  private getDayBasedCost(day: string): number {
    const competitionMultiplier = ['Tuesday', 'Wednesday', 'Thursday'].includes(day) ? 1.2 : 1.0;
    return this.getRandomBetween(4.50, 6.50) * competitionMultiplier;
  }
}

export const audienceDataGenerator = new AudienceDataGenerator();