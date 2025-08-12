// A/B Testing simulation for creative and audience variations

interface ABTestConfig {
  id: string;
  name: string;
  type: 'creative' | 'audience' | 'bidding' | 'landing_page';
  status: 'draft' | 'running' | 'completed' | 'paused';
  variants: ABTestVariant[];
  trafficSplit: number[];
  startDate: Date;
  endDate?: Date;
  confidence: number;
  significance: number;
  winner?: string;
}

interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cvr: number;
    cost: number;
  };
  isControl: boolean;
}

class ABTestGenerator {
  generateABTests(campaigns: any[]): ABTestConfig[] {
    const tests: ABTestConfig[] = [];

    campaigns.forEach((campaign, index) => {
      // Creative A/B Test
      tests.push(this.generateCreativeTest(campaign, index));
      
      // Audience A/B Test
      if (Math.random() > 0.5) {
        tests.push(this.generateAudienceTest(campaign, index));
      }
    });

    return tests;
  }

  private generateCreativeTest(campaign: any, index: number): ABTestConfig {
    const variants = this.generateCreativeVariants();
    const confidence = this.calculateConfidence(variants);
    
    return {
      id: `ab_creative_${index + 1}`,
      name: `${campaign.name} - Headline Test`,
      type: 'creative',
      status: this.getRandomStatus(),
      variants,
      trafficSplit: [50, 50],
      startDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
      confidence,
      significance: confidence > 95 ? 0.05 : 0.1,
      winner: confidence > 95 ? (variants[0].metrics.ctr > variants[1].metrics.ctr ? variants[0].id : variants[1].id) : undefined
    };
  }

  private generateAudienceTest(campaign: any, index: number): ABTestConfig {
    const variants = this.generateAudienceVariants();
    const confidence = this.calculateConfidence(variants);
    
    return {
      id: `ab_audience_${index + 1}`,
      name: `${campaign.name} - Audience Test`,
      type: 'audience',
      status: this.getRandomStatus(),
      variants,
      trafficSplit: [50, 50],
      startDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
      confidence,
      significance: confidence > 95 ? 0.05 : 0.1,
      winner: confidence > 95 ? (variants[0].metrics.cvr > variants[1].metrics.cvr ? variants[0].id : variants[1].id) : undefined
    };
  }

  private generateCreativeVariants(): ABTestVariant[] {
    const controlMetrics = this.generateVariantMetrics(true);
    const testMetrics = this.generateVariantMetrics(false);

    return [
      {
        id: 'variant_control',
        name: 'Control (Original)',
        description: 'Transform Your Development Workflow',
        metrics: controlMetrics,
        isControl: true
      },
      {
        id: 'variant_test',
        name: 'Test Variant',
        description: 'Boost Developer Productivity by 40%',
        metrics: testMetrics,
        isControl: false
      }
    ];
  }

  private generateAudienceVariants(): ABTestVariant[] {
    return [
      {
        id: 'audience_control',
        name: 'Broad Targeting',
        description: 'Software Engineers + Engineering Managers',
        metrics: this.generateVariantMetrics(true),
        isControl: true
      },
      {
        id: 'audience_test', 
        name: 'Narrow Targeting',
        description: 'Senior Software Engineers at Series B+ Companies',
        metrics: this.generateVariantMetrics(false),
        isControl: false
      }
    ];
  }

  private generateVariantMetrics(isControl: boolean): ABTestVariant['metrics'] {
    const baseImpressions = Math.floor(Math.random() * 20000) + 15000;
    const baseCTR = isControl ? Math.random() * 1 + 2.5 : Math.random() * 1.5 + 2.8; // Test usually performs better
    const clicks = Math.floor(baseImpressions * (baseCTR / 100));
    const cvr = Math.random() * 2 + 1.5;
    const conversions = Math.floor(clicks * (cvr / 100));
    const cost = clicks * (Math.random() * 3 + 4);

    return {
      impressions: baseImpressions,
      clicks,
      conversions,
      ctr: Math.round(baseCTR * 100) / 100,
      cvr: Math.round(cvr * 100) / 100,
      cost: Math.round(cost)
    };
  }

  private calculateConfidence(variants: ABTestVariant[]): number {
    if (variants.length < 2) return 0;
    
    const [control, test] = variants;
    const controlCTR = control.metrics.ctr;
    const testCTR = test.metrics.ctr;
    
    // Simplified confidence calculation
    const improvement = Math.abs(testCTR - controlCTR) / controlCTR;
    const sampleSize = Math.min(control.metrics.impressions, test.metrics.impressions);
    
    // Higher sample size and larger improvement = higher confidence
    let confidence = Math.min(99, improvement * 100 + (sampleSize / 1000));
    
    return Math.round(confidence * 100) / 100;
  }

  private getRandomStatus(): ABTestConfig['status'] {
    const statuses: ABTestConfig['status'][] = ['running', 'running', 'completed', 'paused'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  // Generate test recommendations
  generateTestRecommendations(campaign: any): Array<{
    type: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    estimatedLift: string;
    duration: string;
  }> {
    return [
      {
        type: 'creative',
        priority: 'high',
        title: 'Test Outcome-Focused Headlines',
        description: 'Test specific results vs generic features in headlines',
        estimatedLift: '+15-25% CTR',
        duration: '2 weeks'
      },
      {
        type: 'audience',
        priority: 'medium',
        title: 'Test Company Size Segments',
        description: 'Compare startup vs enterprise targeting performance',
        estimatedLift: '+10-20% CVR',
        duration: '3 weeks'
      },
      {
        type: 'bidding',
        priority: 'medium',
        title: 'Test Automated vs Manual Bidding',
        description: 'Compare LinkedIn auto-bidding with manual CPC',
        estimatedLift: '+5-15% efficiency',
        duration: '4 weeks'
      },
      {
        type: 'landing_page',
        priority: 'low',
        title: 'Test Landing Page Variants',
        description: 'Compare long-form vs short-form landing pages',
        estimatedLift: '+8-18% conversions',
        duration: '2 weeks'
      }
    ];
  }

  // Calculate statistical significance
  calculateStatisticalSignificance(controlCTR: number, testCTR: number, controlSample: number, testSample: number): {
    significant: boolean;
    pValue: number;
    confidence: number;
  } {
    // Simplified statistical calculation for demo
    const pooledCTR = (controlCTR * controlSample + testCTR * testSample) / (controlSample + testSample);
    const standardError = Math.sqrt(pooledCTR * (1 - pooledCTR) * (1/controlSample + 1/testSample));
    const zScore = Math.abs(controlCTR - testCTR) / standardError;
    
    // Convert z-score to p-value (simplified)
    const pValue = Math.max(0.001, 2 * (1 - this.normalCDF(Math.abs(zScore))));
    const confidence = (1 - pValue) * 100;
    
    return {
      significant: pValue < 0.05,
      pValue: Math.round(pValue * 10000) / 10000,
      confidence: Math.round(confidence * 100) / 100
    };
  }

  private normalCDF(x: number): number {
    // Approximation of normal cumulative distribution function
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  private erf(x: number): number {
    // Approximation of error function
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }
}

export const abTestGenerator = new ABTestGenerator();