// Competitive intelligence simulation

interface CompetitorData {
  id: string;
  name: string;
  domain: string;
  industry: string;
  estimatedAdSpend: number;
  marketShare: number;
  topKeywords: string[];
  adExamples: CompetitorAd[];
  performance: {
    estimatedCTR: number;
    estimatedImpressions: number;
    shareOfVoice: number;
  };
  trends: {
    spendTrend: 'increasing' | 'decreasing' | 'stable';
    activityLevel: 'high' | 'medium' | 'low';
    newCampaigns: number;
  };
}

interface CompetitorAd {
  id: string;
  headline: string;
  description: string;
  callToAction: string;
  firstSeen: Date;
  lastSeen: Date;
  estimatedImpressionsPerDay: number;
  adFormat: 'single_image' | 'video' | 'carousel' | 'text';
}

class CompetitiveIntelligenceGenerator {
  private competitors = [
    { name: 'DataDog', domain: 'datadog.com', industry: 'DevOps Monitoring' },
    { name: 'New Relic', domain: 'newrelic.com', industry: 'Application Performance' },
    { name: 'Splunk', domain: 'splunk.com', industry: 'Data Analytics' },
    { name: 'AWS', domain: 'aws.amazon.com', industry: 'Cloud Infrastructure' },
    { name: 'MongoDB', domain: 'mongodb.com', industry: 'Database Technology' },
    { name: 'GitLab', domain: 'gitlab.com', industry: 'DevOps Platform' }
  ];

  generateCompetitorAnalysis(): CompetitorData[] {
    return this.competitors.map((comp, index) => ({
      id: `competitor_${index + 1}`,
      name: comp.name,
      domain: comp.domain,
      industry: comp.industry,
      estimatedAdSpend: this.generateAdSpend(),
      marketShare: this.generateMarketShare(),
      topKeywords: this.generateKeywords(comp.industry),
      adExamples: this.generateAdExamples(comp.name),
      performance: this.generatePerformanceMetrics(),
      trends: this.generateTrends()
    }));
  }

  private generateAdSpend(): number {
    // Estimated monthly ad spend
    return Math.floor(Math.random() * 200000) + 50000;
  }

  private generateMarketShare(): number {
    return Math.round((Math.random() * 25 + 5) * 100) / 100; // 5-30%
  }

  private generateKeywords(industry: string): string[] {
    const industryKeywords: { [key: string]: string[] } = {
      'DevOps Monitoring': ['application monitoring', 'infrastructure monitoring', 'DevOps tools', 'observability'],
      'Application Performance': ['APM', 'application performance', 'monitoring tools', 'performance optimization'],
      'Data Analytics': ['data analytics', 'business intelligence', 'data visualization', 'machine learning'],
      'Cloud Infrastructure': ['cloud computing', 'AWS services', 'cloud migration', 'serverless'],
      'Database Technology': ['database management', 'NoSQL', 'database performance', 'data storage'],
      'DevOps Platform': ['CI/CD', 'version control', 'DevOps automation', 'code collaboration']
    };

    return industryKeywords[industry] || ['software development', 'enterprise software', 'business tools'];
  }

  private generateAdExamples(companyName: string): CompetitorAd[] {
    const headlines = [
      `${companyName}: Transform Your Development Process`,
      `See Why 50,000+ Companies Choose ${companyName}`,
      `Get Started with ${companyName} - Free Trial`,
      `The Future of Development is Here`,
      `Scale Your Infrastructure with ${companyName}`
    ];

    return headlines.slice(0, 3).map((headline, index) => ({
      id: `ad_${companyName}_${index + 1}`,
      headline,
      description: `Discover how ${companyName} helps teams build better software faster. Join thousands of developers already using our platform.`,
      callToAction: 'Start Free Trial',
      firstSeen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      lastSeen: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
      estimatedImpressionsPerDay: Math.floor(Math.random() * 10000) + 2000,
      adFormat: this.getRandomFromArray(['single_image', 'video', 'carousel'] as const)
    }));
  }

  private generatePerformanceMetrics(): CompetitorData['performance'] {
    return {
      estimatedCTR: Math.round((Math.random() * 2 + 1.5) * 100) / 100,
      estimatedImpressions: Math.floor(Math.random() * 100000) + 50000,
      shareOfVoice: Math.round((Math.random() * 20 + 5) * 100) / 100
    };
  }

  private generateTrends(): CompetitorData['trends'] {
    return {
      spendTrend: this.getRandomFromArray(['increasing', 'decreasing', 'stable'] as const),
      activityLevel: this.getRandomFromArray(['high', 'medium', 'low'] as const),
      newCampaigns: Math.floor(Math.random() * 5) + 1
    };
  }

  // Generate competitive insights
  generateCompetitiveInsights(userCampaigns: any[]): Array<{
    type: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    recommendation: string;
    competitorExample?: string;
  }> {
    return [
      {
        type: 'messaging',
        priority: 'high',
        title: 'Competitor Messaging Gap',
        description: 'DataDog emphasizes "observability" while you focus on "monitoring" - consider broader positioning.',
        recommendation: 'Test "Full-Stack Observability" messaging to capture broader search intent.',
        competitorExample: 'DataDog: "Modern monitoring & security platform for cloud applications"'
      },
      {
        type: 'audience',
        priority: 'medium',
        title: 'Untapped Audience Segment',
        description: 'Competitors are heavily targeting DevOps Engineers but missing Platform Engineers.',
        recommendation: 'Create dedicated campaigns for Platform Engineering roles.',
        competitorExample: 'New Relic targets 85% DevOps vs 15% Platform Engineers'
      },
      {
        type: 'creative',
        priority: 'medium',
        title: 'Video Ad Format Opportunity',
        description: 'Only 30% of competitors use video ads, representing an engagement opportunity.',
        recommendation: 'Test video creative formats to stand out in the feed.',
        competitorExample: 'AWS uses 60% static images vs 40% video content'
      },
      {
        type: 'timing',
        priority: 'low',
        title: 'Market Timing Advantage',
        description: 'Competitors reduce spend 20% during Q1 - opportunity for increased share.',
        recommendation: 'Maintain or increase Q1 budget when competition decreases.',
        competitorExample: 'MongoDB reduced Q1 spend by 25% last year'
      }
    ];
  }

  // Monitor competitor campaign changes
  generateCompetitorAlerts(): Array<{
    id: string;
    competitorName: string;
    alertType: 'new_campaign' | 'budget_change' | 'creative_change' | 'keyword_change';
    description: string;
    impact: 'high' | 'medium' | 'low';
    timestamp: Date;
  }> {
    return [
      {
        id: 'comp_alert_001',
        competitorName: 'DataDog',
        alertType: 'new_campaign',
        description: 'Launched new campaign targeting "Cloud Security" keywords with $50K+ daily budget',
        impact: 'high',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'comp_alert_002',
        competitorName: 'New Relic',
        alertType: 'budget_change',
        description: 'Increased "Application Performance" campaign budget by 40%',
        impact: 'medium',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  private getRandomFromArray<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}

export const competitiveIntelligenceGenerator = new CompetitiveIntelligenceGenerator();