interface MetricsTrend {
  metric: string;
  currentValue: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  confidence: number;
}

interface BenchmarkData {
  industry: string;
  metric: string;
  value: number;
  source: string;
  date: string;
}

class MetricsDataGenerator {
  private industryBenchmarks: BenchmarkData[] = [
    { industry: 'SaaS', metric: 'CTR', value: 2.7, source: 'LinkedIn', date: '2024-Q1' },
    { industry: 'Technology', metric: 'CTR', value: 3.1, source: 'LinkedIn', date: '2024-Q1' },
    { industry: 'Enterprise Software', metric: 'CTR', value: 2.9, source: 'LinkedIn', date: '2024-Q1' },
    { industry: 'SaaS', metric: 'CPC', value: 5.85, source: 'LinkedIn', date: '2024-Q1' },
    { industry: 'Technology', metric: 'CPC', value: 6.20, source: 'LinkedIn', date: '2024-Q1' },
    { industry: 'SaaS', metric: 'CVR', value: 2.8, source: 'Internal', date: '2024-Q1' },
    { industry: 'Technology', metric: 'CVR', value: 3.2, source: 'Internal', date: '2024-Q1' }
  ];

  generateMetricsTrends(campaigns: any[]): MetricsTrend[] {
    const trends: MetricsTrend[] = [];

    campaigns.forEach(campaign => {
      // CTR trend
      const currentCTR = campaign.metrics.ctr;
      const previousCTR = this.calculatePreviousPeriodValue(currentCTR, campaign.trend);
      trends.push(this.createTrend('CTR', currentCTR, previousCTR, campaign.name));

      // CPC trend
      const currentCPC = campaign.metrics.cpc;
      const previousCPC = this.calculatePreviousPeriodValue(currentCPC, campaign.trend, true);
      trends.push(this.createTrend('CPC', currentCPC, previousCPC, campaign.name));

      // Conversion rate trend
      const currentCVR = (campaign.metrics.conversions / campaign.metrics.clicks) * 100;
      const previousCVR = this.calculatePreviousPeriodValue(currentCVR, campaign.trend);
      trends.push(this.createTrend('CVR', currentCVR, previousCVR, campaign.name));
    });

    return trends;
  }

  private createTrend(metric: string, current: number, previous: number, campaignName: string): MetricsTrend {
    const changePercent = ((current - previous) / previous) * 100;
    const trend = Math.abs(changePercent) < 2 ? 'stable' : changePercent > 0 ? 'up' : 'down';
    
    // For CPC, inverse the trend logic (lower is better)
    const adjustedTrend = metric === 'CPC' ? 
      (trend === 'up' ? 'down' : trend === 'down' ? 'up' : 'stable') : trend;

    return {
      metric: `${campaignName} - ${metric}`,
      currentValue: Math.round(current * 100) / 100,
      previousValue: Math.round(previous * 100) / 100,
      trend: adjustedTrend,
      changePercent: Math.round(Math.abs(changePercent) * 100) / 100,
      confidence: this.getRandomBetween(0.75, 0.95)
    };
  }

  private calculatePreviousPeriodValue(currentValue: number, campaignTrend: string, inverse: boolean = false): number {
    let multiplier = 1.0;

    switch (campaignTrend) {
      case 'strong':
        multiplier = inverse ? this.getRandomBetween(1.05, 1.25) : this.getRandomBetween(0.8, 0.95);
        break;
      case 'improving':
        multiplier = inverse ? this.getRandomBetween(1.02, 1.15) : this.getRandomBetween(0.85, 0.98);
        break;
      case 'stable':
        multiplier = this.getRandomBetween(0.95, 1.05);
        break;
      case 'declining':
        multiplier = inverse ? this.getRandomBetween(0.85, 0.98) : this.getRandomBetween(1.05, 1.20);
        break;
      case 'poor':
        multiplier = inverse ? this.getRandomBetween(0.75, 0.90) : this.getRandomBetween(1.15, 1.40);
        break;
    }

    return currentValue * multiplier;
  }

  // Generate comparative benchmarks
  generateBenchmarkComparisons(campaigns: any[]): Array<{
    campaign: string;
    metric: string;
    value: number;
    benchmark: number;
    performance: 'above' | 'below' | 'at';
    percentageDiff: number;
  }> {
    const comparisons: any[] = [];

    campaigns.forEach(campaign => {
      // CTR comparison
      const ctrBenchmark = this.getBenchmark('SaaS', 'CTR');
      const ctrPerformance = this.compareTobenchmark(campaign.metrics.ctr, ctrBenchmark);
      comparisons.push({
        campaign: campaign.name,
        metric: 'CTR',
        value: campaign.metrics.ctr,
        benchmark: ctrBenchmark,
        ...ctrPerformance
      });

      // CPC comparison
      const cpcBenchmark = this.getBenchmark('SaaS', 'CPC');
      const cpcPerformance = this.compareTobenchmark(campaign.metrics.cpc, cpcBenchmark);
      comparisons.push({
        campaign: campaign.name,
        metric: 'CPC',
        value: campaign.metrics.cpc,
        benchmark: cpcBenchmark,
        ...cpcPerformance
      });
    });

    return comparisons;
  }

  private getBenchmark(industry: string, metric: string): number {
    const benchmark = this.industryBenchmarks.find(b => 
      b.industry === industry && b.metric === metric
    );
    return benchmark ? benchmark.value : 0;
  }

  private compareTobenchmark(value: number, benchmark: number) {
    const diff = ((value - benchmark) / benchmark) * 100;
    const performance = Math.abs(diff) < 5 ? 'at' : diff > 0 ? 'above' : 'below';
    
    return {
      performance,
      percentageDiff: Math.round(Math.abs(diff) * 100) / 100
    };
  }

  // Generate forecasting data
  generateForecast(campaigns: any[], days: number = 30): Array<{
    date: string;
    campaign: string;
    predictedCTR: number;
    predictedSpend: number;
    predictedConversions: number;
    confidence: number;
  }> {
    const forecasts: any[] = [];
    const startDate = new Date();

    for (let day = 1; day <= days; day++) {
      const forecastDate = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);
      
      campaigns.forEach(campaign => {
        const seasonalMultiplier = this.getSeasonalMultiplier(forecastDate);
        const trendMultiplier = this.getTrendMultiplier(campaign.trend, day);
        const randomVariation = this.getRandomBetween(0.95, 1.05);
        
        const predictedCTR = campaign.metrics.ctr * seasonalMultiplier * trendMultiplier * randomVariation;
        const predictedSpend = (campaign.metrics.spend / 30) * seasonalMultiplier * trendMultiplier;
        const predictedConversions = Math.round((campaign.metrics.conversions / 30) * seasonalMultiplier * trendMultiplier);
        
        // Confidence decreases over time
        const confidence = Math.max(0.5, 0.9 - (day * 0.01));

        forecasts.push({
          date: forecastDate.toISOString().split('T')[0],
          campaign: campaign.name,
          predictedCTR: Math.round(predictedCTR * 100) / 100,
          predictedSpend: Math.round(predictedSpend),
          predictedConversions,
          confidence: Math.round(confidence * 100) / 100
        });
      });
    }

    return forecasts;
  }

  private getSeasonalMultiplier(date: Date): number {
    const month = date.getMonth();
    const dayOfWeek = date.getDay();
    
    // Monthly seasonality (Q4 boost, summer dip)
    let monthlyMultiplier = 1.0;
    if (month >= 9) monthlyMultiplier = 1.15; // Q4 boost
    if (month >= 5 && month <= 7) monthlyMultiplier = 0.9; // Summer dip
    
    // Weekly seasonality (weekday boost)
    let weeklyMultiplier = 1.0;
    if (dayOfWeek >= 1 && dayOfWeek <= 5) weeklyMultiplier = 1.1; // Weekdays
    if (dayOfWeek === 0 || dayOfWeek === 6) weeklyMultiplier = 0.7; // Weekends
    
    return monthlyMultiplier * weeklyMultiplier;
  }

  private getTrendMultiplier(trend: string, daysOut: number): number {
    const trendImpact = {
      strong: 0.002,
      improving: 0.001,
      stable: 0,
      declining: -0.001,
      poor: -0.002
    };

    const dailyChange = trendImpact[trend as keyof typeof trendImpact] || 0;
    return 1 + (dailyChange * daysOut);
  }

  // Performance scoring
  generatePerformanceScores(campaigns: any[]): Array<{
    campaign: string;
    overallScore: number;
    efficiencyScore: number;
    growthScore: number;
    qualityScore: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
  }> {
    return campaigns.map(campaign => {
      const efficiencyScore = this.calculateEfficiencyScore(campaign);
      const growthScore = this.calculateGrowthScore(campaign);
      const qualityScore = this.calculateQualityScore(campaign);
      const overallScore = (efficiencyScore + growthScore + qualityScore) / 3;
      
      return {
        campaign: campaign.name,
        overallScore: Math.round(overallScore),
        efficiencyScore: Math.round(efficiencyScore),
        growthScore: Math.round(growthScore),
        qualityScore: Math.round(qualityScore),
        grade: this.getGrade(overallScore)
      };
    });
  }

  private calculateEfficiencyScore(campaign: any): number {
    // Based on cost efficiency metrics
    const cpcScore = Math.min(100, (10 / campaign.metrics.cpc) * 100);
    const costPerConversionScore = Math.min(100, (200 / campaign.metrics.cost_per_conversion) * 100);
    return (cpcScore + costPerConversionScore) / 2;
  }

  private calculateGrowthScore(campaign: any): number {
    // Based on trend and volume
    const trendScores = { strong: 95, improving: 80, stable: 65, declining: 40, poor: 20 };
    const trendScore = trendScores[campaign.trend as keyof typeof trendScores] || 50;
    
    const volumeScore = Math.min(100, (campaign.metrics.impressions / 1000));
    return (trendScore + volumeScore) / 2;
  }

  private calculateQualityScore(campaign: any): number {
    // Based on engagement metrics
    const ctrScore = Math.min(100, (campaign.metrics.ctr / 5) * 100);
    const conversionScore = Math.min(100, (campaign.metrics.conversions / 100) * 100);
    return (ctrScore + conversionScore) / 2;
  }

  private getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private getRandomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}

export const metricsDataGenerator = new MetricsDataGenerator();