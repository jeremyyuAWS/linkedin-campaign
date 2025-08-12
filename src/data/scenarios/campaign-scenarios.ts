// Pre-built campaign scenarios for different demo use cases

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  duration: string;
  campaigns: any[];
  alerts: any[];
  insights: string[];
}

export const demoScenarios: DemoScenario[] = [
  {
    id: 'high_performance',
    name: 'High-Performing Campaigns',
    description: 'Showcase campaigns with excellent performance metrics and scaling opportunities',
    duration: '30 days',
    campaigns: [
      {
        id: 'perf_001',
        name: 'Enterprise AI Platform - CTOs',
        status: 'active',
        budget: { total: 50000, spent: 18500, remaining: 31500 },
        metrics: {
          impressions: 95000,
          clicks: 4275,
          ctr: 4.5,
          cpc: 4.33,
          conversions: 128,
          spend: 18500,
          cost_per_conversion: 144.53
        },
        trend: 'strong',
        last_7_days: { impressions: 22000, clicks: 1100, ctr: 5.0, spend: 4764 }
      }
    ],
    alerts: [
      {
        type: 'opportunity',
        priority: 'high',
        title: 'Scale High-Performing Campaign',
        message: 'Enterprise AI Platform campaign showing exceptional 4.5% CTR with strong conversion volume.'
      }
    ],
    insights: [
      'CTR 67% above industry benchmark',
      'Strong executive audience engagement',
      'Optimal for budget scaling'
    ]
  },
  {
    id: 'optimization_needed',
    name: 'Campaigns Needing Optimization',
    description: 'Demonstrate AI-powered recommendations for underperforming campaigns',
    duration: '45 days',
    campaigns: [
      {
        id: 'opt_001',
        name: 'Developer Tools - Generic Targeting',
        status: 'active',
        budget: { total: 25000, spent: 23500, remaining: 1500 },
        metrics: {
          impressions: 180000,
          clicks: 2700,
          ctr: 1.5,
          cpc: 8.70,
          conversions: 18,
          spend: 23500,
          cost_per_conversion: 1305.56
        },
        trend: 'poor',
        last_7_days: { impressions: 35000, clicks: 420, ctr: 1.2, spend: 3654 }
      }
    ],
    alerts: [
      {
        type: 'performance_drop',
        priority: 'high',
        title: 'Critical Performance Alert',
        message: 'Developer Tools campaign CTR dropped to 1.2%, well below 2.7% industry benchmark.'
      }
    ],
    insights: [
      'Immediate creative refresh needed',
      'Audience targeting too broad',
      'Budget reallocation recommended'
    ]
  },
  {
    id: 'budget_management',
    name: 'Budget Management Scenarios',
    description: 'Show budget optimization and pacing alerts',
    duration: '60 days',
    campaigns: [
      {
        id: 'bud_001',
        name: 'Q4 Product Launch - Accelerated',
        status: 'active',
        budget: { total: 40000, spent: 38200, remaining: 1800 },
        metrics: {
          impressions: 125000,
          clicks: 3750,
          ctr: 3.0,
          cpc: 10.19,
          conversions: 95,
          spend: 38200,
          cost_per_conversion: 402.11
        },
        trend: 'improving',
        last_7_days: { impressions: 18500, clicks: 555, ctr: 3.0, spend: 5655 }
      }
    ],
    alerts: [
      {
        type: 'budget_warning',
        priority: 'high',
        title: 'Budget Depletion Alert',
        message: 'Q4 Product Launch campaign will exhaust budget 12 days early at current spend rate.'
      }
    ],
    insights: [
      'Budget pacing adjustment needed',
      'Consider daily spend limits',
      'Performance justifies budget increase'
    ]
  },
  {
    id: 'audience_expansion',
    name: 'Audience Expansion Opportunities',
    description: 'Highlight audience insights and expansion recommendations',
    duration: '90 days',
    campaigns: [
      {
        id: 'aud_001',
        name: 'SaaS Leaders - Core Segment',
        status: 'active',
        budget: { total: 30000, spent: 15200, remaining: 14800 },
        metrics: {
          impressions: 85000,
          clicks: 3400,
          ctr: 4.0,
          cpc: 4.47,
          conversions: 102,
          spend: 15200,
          cost_per_conversion: 149.02
        },
        trend: 'strong',
        last_7_days: { impressions: 12500, clicks: 525, ctr: 4.2, spend: 2347 }
      }
    ],
    alerts: [
      {
        type: 'optimization',
        priority: 'medium',
        title: 'Audience Expansion Opportunity',
        message: 'VP Data Science and Director Engineering showing 2x engagement vs current targeting.'
      }
    ],
    insights: [
      'Strong core audience performance',
      'Lookalike expansion potential',
      'Similar role targeting recommended'
    ]
  }
];

// Scenario management utilities
export class ScenarioManager {
  static getScenario(scenarioId: string): DemoScenario | undefined {
    return demoScenarios.find(s => s.id === scenarioId);
  }

  static listScenarios(): Array<{ id: string; name: string; description: string }> {
    return demoScenarios.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description
    }));
  }

  static createCustomScenario(
    name: string,
    description: string,
    campaignConfig: any
  ): DemoScenario {
    return {
      id: `custom_${Date.now()}`,
      name,
      description,
      duration: '30 days',
      campaigns: [campaignConfig],
      alerts: [],
      insights: []
    };
  }

  // Apply time-based modifications to scenarios
  static applyTimeProgression(scenario: DemoScenario, daysElapsed: number): DemoScenario {
    const modifiedScenario = { ...scenario };
    
    // Modify campaigns based on time progression
    modifiedScenario.campaigns = scenario.campaigns.map(campaign => {
      const dailySpend = campaign.metrics.spend / 30; // Assume 30-day base
      const additionalSpend = dailySpend * daysElapsed;
      
      return {
        ...campaign,
        budget: {
          ...campaign.budget,
          spent: Math.min(campaign.budget.total, campaign.budget.spent + additionalSpend),
          remaining: Math.max(0, campaign.budget.remaining - additionalSpend)
        }
      };
    });

    return modifiedScenario;
  }

  // Generate scenario-based insights
  static generateScenarioInsights(scenario: DemoScenario): string[] {
    const insights: string[] = [...scenario.insights];

    // Add dynamic insights based on scenario type
    if (scenario.id.includes('high_performance')) {
      insights.push('Opportunity to increase budget allocation by 50%');
      insights.push('Consider expanding to similar audience segments');
    }

    if (scenario.id.includes('optimization')) {
      insights.push('Creative A/B testing recommended');
      insights.push('Audience refinement could improve ROI by 40%');
    }

    return insights;
  }
}