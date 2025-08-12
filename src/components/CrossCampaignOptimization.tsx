import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Zap, ArrowRight, AlertTriangle, CheckCircle, Shuffle, BarChart3, RefreshCw, X, Calendar, Users, Eye, Activity } from 'lucide-react';
import { aiEngine } from '../services/ai-engine';

interface OptimizationOpportunity {
  id: string;
  type: 'budget_reallocation' | 'audience_expansion' | 'creative_refresh' | 'bidding_optimization';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: {
    metric: string;
    expectedImprovement: number;
    confidence: number;
  };
  campaigns: string[];
  recommendation: string;
  estimatedValue: number;
}

interface BudgetReallocation {
  fromCampaign: string;
  toCampaign: string;
  amount: number;
  reason: string;
  expectedImpact: number;
}

interface OpportunityDetails {
  id: string;
  analysis: {
    currentState: string;
    rootCause: string;
    marketContext: string;
    competitiveAnalysis: string;
  };
  implementation: {
    steps: string[];
    timeline: string;
    resources: string[];
    risks: string[];
  };
  projections: {
    shortTerm: { metric: string; change: string; timeframe: string }[];
    longTerm: { metric: string; change: string; timeframe: string }[];
  };
  caseStudy: {
    title: string;
    description: string;
    results: string;
  };
}

export function CrossCampaignOptimization() {
  const [optimizationOpportunities, setOptimizationOpportunities] = useState<OptimizationOpportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OptimizationOpportunity | null>(null);
  const [opportunityDetails, setOpportunityDetails] = useState<OpportunityDetails | null>(null);
  const [budgetReallocations, setBudgetReallocations] = useState<BudgetReallocation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeView, setActiveView] = useState<'opportunities' | 'reallocations' | 'performance'>('opportunities');

  // Mock campaign performance data
  const campaignPerformance = [
    {
      name: 'Enterprise CTO',
      efficiency: 92,
      currentBudget: 40000,
      spend: 12500,
      ctr: 3.4,
      conversions: 78,
      roi: 320,
      status: 'high-performer'
    },
    {
      name: 'Startup Founders',
      efficiency: 88,
      currentBudget: 20000,
      spend: 8900,
      ctr: 3.82,
      conversions: 125,
      roi: 280,
      status: 'high-performer'
    },
    {
      name: 'Q4 Developer',
      efficiency: 45,
      currentBudget: 25000,
      spend: 18750,
      ctr: 2.56,
      conversions: 42,
      roi: 140,
      status: 'underperformer'
    },
    {
      name: 'Mid-Market SaaS',
      efficiency: 28,
      currentBudget: 15000,
      spend: 14200,
      ctr: 1.89,
      conversions: 15,
      roi: 95,
      status: 'underperformer'
    }
  ];

  const crossCampaignMetrics = [
    { metric: 'Total ROI', value: '245%', change: '+18%', trend: 'up' },
    { metric: 'Efficiency Score', value: '63/100', change: '+12 points', trend: 'up' },
    { metric: 'Budget Utilization', value: '76%', change: '-5%', trend: 'down' },
    { metric: 'Avg Cost/Conv', value: '$156', change: '-$23', trend: 'up' }
  ];

  useEffect(() => {
    generateOptimizationOpportunities();
    generateBudgetReallocations();
  }, []);

  const generateOptimizationOpportunities = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const opportunities: OptimizationOpportunity[] = [
      {
        id: 'opt_001',
        type: 'budget_reallocation',
        priority: 'high',
        title: 'Reallocate Budget from Underperformers',
        description: 'Move $5,000/day from Q4 Developer and Mid-Market campaigns to Enterprise CTO and Startup Founders.',
        impact: {
          metric: 'Total Conversions',
          expectedImprovement: 35,
          confidence: 87
        },
        campaigns: ['Q4 Developer', 'Mid-Market SaaS', 'Enterprise CTO', 'Startup Founders'],
        recommendation: 'Reduce underperforming campaigns by 40% and increase high-performers by 25%',
        estimatedValue: 45000
      },
      {
        id: 'opt_002',
        type: 'audience_expansion',
        priority: 'high',
        title: 'Cross-Campaign Audience Sharing',
        description: 'Apply Enterprise CTO\'s high-performing audience segments to Startup Founders campaign.',
        impact: {
          metric: 'CTR',
          expectedImprovement: 22,
          confidence: 82
        },
        campaigns: ['Enterprise CTO', 'Startup Founders'],
        recommendation: 'Test VP-level targeting across growth-focused campaigns',
        estimatedValue: 28000
      },
      {
        id: 'opt_003',
        type: 'creative_refresh',
        priority: 'medium',
        title: 'Cross-Campaign Creative Optimization',
        description: 'Apply successful creative elements from high-performers to struggling campaigns.',
        impact: {
          metric: 'Engagement Rate',
          expectedImprovement: 28,
          confidence: 75
        },
        campaigns: ['Q4 Developer', 'Mid-Market SaaS'],
        recommendation: 'Test outcome-focused messaging and technical benefit statements',
        estimatedValue: 18000
      },
      {
        id: 'opt_004',
        type: 'bidding_optimization',
        priority: 'medium',
        title: 'Smart Bidding Synchronization',
        description: 'Coordinate bidding strategies across campaigns to reduce competition overlap.',
        impact: {
          metric: 'Cost per Click',
          expectedImprovement: 15,
          confidence: 90
        },
        campaigns: ['Enterprise CTO', 'Q4 Developer'],
        recommendation: 'Implement time-based bidding coordination and audience exclusions',
        estimatedValue: 12000
      }
    ];

    setOptimizationOpportunities(opportunities);
    setIsAnalyzing(false);
  };

  const generateBudgetReallocations = () => {
    const reallocations: BudgetReallocation[] = [
      {
        fromCampaign: 'Q4 Developer Persona',
        toCampaign: 'Enterprise CTO Outreach',
        amount: 3000,
        reason: 'Higher ROI and conversion efficiency',
        expectedImpact: 25
      },
      {
        fromCampaign: 'Mid-Market SaaS Leaders',
        toCampaign: 'Startup Founders',
        amount: 2000,
        reason: 'Better audience engagement and lower CPC',
        expectedImpact: 18
      }
    ];

    setBudgetReallocations(reallocations);
  };

  const generateOpportunityDetails = (opportunity: OptimizationOpportunity): OpportunityDetails => {
    const detailsMap: { [key: string]: OpportunityDetails } = {
      'opt_001': {
        id: 'opt_001',
        analysis: {
          currentState: 'Two campaigns (Q4 Developer and Mid-Market SaaS) are consuming 55% of total budget while generating only 32% of conversions. ROI disparity of 140% between top and bottom performers.',
          rootCause: 'Audience saturation in developer segment combined with generic messaging that fails to resonate with mid-market decision makers. Lack of dynamic budget allocation based on performance.',
          marketContext: 'Q4 typically sees 15-20% increase in B2B ad competition. Developer-focused campaigns face higher CPC due to increased demand from tech companies launching year-end initiatives.',
          competitiveAnalysis: 'Competitors are shifting budget to executive-level targeting (CTO, VP Engineering) which shows 40% higher conversion rates and 25% lower competition than individual contributor targeting.'
        },
        implementation: {
          steps: [
            'Phase 1: Reduce Q4 Developer daily budget by 40% ($2,000/day reduction)',
            'Phase 2: Reduce Mid-Market SaaS daily budget by 50% ($1,500/day reduction)', 
            'Phase 3: Increase Enterprise CTO budget by 30% (+$2,000/day)',
            'Phase 4: Increase Startup Founders budget by 25% (+$1,500/day)',
            'Phase 5: Monitor performance for 14 days and adjust as needed'
          ],
          timeline: '2-week implementation with daily monitoring',
          resources: ['Campaign manager oversight', 'Performance tracking dashboard', 'LinkedIn Campaign Manager access'],
          risks: ['Temporary decrease in overall impression volume', 'Potential audience learning period for increased budgets', 'Need for creative refresh in scaling campaigns']
        },
        projections: {
          shortTerm: [
            { metric: 'Total Conversions', change: '+35%', timeframe: '14 days' },
            { metric: 'Cost per Conversion', change: '-18%', timeframe: '14 days' },
            { metric: 'Overall ROI', change: '+22%', timeframe: '14 days' }
          ],
          longTerm: [
            { metric: 'Portfolio Efficiency', change: '+45%', timeframe: '90 days' },
            { metric: 'Scalable Budget', change: '+$15K/month', timeframe: '90 days' },
            { metric: 'Market Share', change: '+12%', timeframe: '90 days' }
          ]
        },
        caseStudy: {
          title: 'Similar SaaS Company Success',
          description: 'A comparable B2B SaaS company implemented cross-campaign budget optimization, reallocating 60% of budget from low-performing segments to executive targeting.',
          results: 'Achieved 52% increase in qualified leads, 38% reduction in CAC, and 180% improvement in ROI within 45 days. Key success factor was maintaining creative quality while scaling.'
        }
      },
      'opt_002': {
        id: 'opt_002',
        analysis: {
          currentState: 'Enterprise CTO campaign shows exceptional audience engagement (3.4% CTR) with specific job titles and company characteristics. Startup Founders campaign has strong creative performance but limited audience reach.',
          rootCause: 'Siloed campaign management preventing successful audience insights from being applied across related campaigns. High-performing audience segments are under-utilized.',
          marketContext: 'Executive-level professionals in startups often have similar pain points and decision-making patterns as enterprise CTOs, especially in technology adoption and vendor evaluation.',
          competitiveAnalysis: 'Market analysis shows 68% overlap in content consumption between startup executives and enterprise technical leaders. Competitors are not capitalizing on this cross-segment opportunity.'
        },
        implementation: {
          steps: [
            'Phase 1: Analyze top-performing audience segments from Enterprise CTO campaign',
            'Phase 2: Identify compatible segments for Startup Founders campaign',
            'Phase 3: Create A/B test with expanded targeting (+VP Engineering, +Technical Directors)',
            'Phase 4: Launch 50/50 traffic split test for 2 weeks',
            'Phase 5: Scale winning segments and optimize messaging'
          ],
          timeline: '3-week testing and optimization cycle',
          resources: ['Audience analysis tools', 'A/B testing framework', 'Performance monitoring dashboard'],
          risks: ['Potential audience dilution if expansion is too broad', 'Message-market fit challenges', 'Increased CPC due to expanded competition']
        },
        projections: {
          shortTerm: [
            { metric: 'Startup Founders CTR', change: '+22%', timeframe: '21 days' },
            { metric: 'Audience Reach', change: '+65%', timeframe: '21 days' },
            { metric: 'Cross-campaign synergy', change: '+30%', timeframe: '21 days' }
          ],
          longTerm: [
            { metric: 'Combined campaign efficiency', change: '+40%', timeframe: '90 days' },
            { metric: 'Audience intelligence', change: '+80%', timeframe: '90 days' },
            { metric: 'Lookalike performance', change: '+55%', timeframe: '90 days' }
          ]
        },
        caseStudy: {
          title: 'Cross-Segment Targeting Success',
          description: 'A B2B automation platform applied enterprise audience insights to their startup-focused campaigns, discovering 73% audience overlap in technical decision-makers.',
          results: 'Increased startup campaign CTR by 89%, reduced CAC by 34%, and identified new high-value segments that became their fastest-growing revenue source.'
        }
      }
    };

    return detailsMap[opportunity.id] || detailsMap['opt_001'];
  };

  const handleViewDetails = (opportunity: OptimizationOpportunity) => {
    setSelectedOpportunity(opportunity);
    const details = generateOpportunityDetails(opportunity);
    setOpportunityDetails(details);
  };

  const handleImplementOptimization = async (opportunityId: string) => {
    const opportunity = optimizationOpportunities.find(opp => opp.id === opportunityId);
    if (!opportunity) return;

    // Simulate implementation
    console.log(`Implementing optimization: ${opportunity.title}`);
    
    // Update opportunity status
    setOptimizationOpportunities(prev => 
      prev.map(opp => 
        opp.id === opportunityId 
          ? { ...opp, title: `✅ ${opp.title} (Implemented)` }
          : opp
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high-performer':
        return 'text-green-600 bg-green-100';
      case 'underperformer':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Cross-Campaign Optimization</h2>
            <p className="text-gray-700">AI-powered budget reallocation and performance optimization across all campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={generateOptimizationOpportunities}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
            </button>
          </div>
        </div>
      </div>

      {/* Cross-Campaign Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {crossCampaignMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
              </div>
              <div className={`flex items-center gap-1 ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? 
                  <TrendingUp className="w-4 h-4" /> : 
                  <TrendingDown className="w-4 h-4" />
                }
                <span className="text-sm font-medium">{metric.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'opportunities', label: 'Optimization Opportunities', icon: <Zap className="w-4 h-4" /> },
            { id: 'reallocations', label: 'Budget Reallocations', icon: <Shuffle className="w-4 h-4" /> },
            { id: 'performance', label: 'Performance Matrix', icon: <BarChart3 className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeView === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active view */}
      {activeView === 'opportunities' && (
        <div className="space-y-6">
          {/* Optimization Opportunities */}
          <div className="space-y-4">
            {optimizationOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{opportunity.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(opportunity.priority)}`}>
                        {opportunity.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{opportunity.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-600">Expected Impact</p>
                        <p className="text-xl font-bold text-blue-600">+{opportunity.impact.expectedImprovement}%</p>
                        <p className="text-xs text-gray-600">{opportunity.impact.metric}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-600">Confidence</p>
                        <p className="text-xl font-bold text-green-600">{opportunity.impact.confidence}%</p>
                        <p className="text-xs text-gray-600">AI Confidence</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-600">Est. Value</p>
                        <p className="text-xl font-bold text-purple-600">${opportunity.estimatedValue.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Annual Impact</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Recommendation:</p>
                      <p className="text-sm text-gray-700">{opportunity.recommendation}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-sm text-gray-600">Affected campaigns:</span>
                      {opportunity.campaigns.map((campaign, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                          {campaign}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleImplementOptimization(opportunity.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Implement Optimization
                  </button>
                  <button
                    onClick={() => handleViewDetails(opportunity)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'reallocations' && (
        <div className="space-y-6">
          {/* Budget Reallocation Recommendations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Smart Budget Reallocations</h3>
            <div className="space-y-4">
              {budgetReallocations.map((reallocation, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">From</p>
                        <p className="font-medium text-red-600">{reallocation.fromCampaign}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                      <div className="text-center">
                        <p className="text-sm text-gray-600">To</p>
                        <p className="font-medium text-green-600">{reallocation.toCampaign}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${reallocation.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">monthly</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{reallocation.reason}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600">Expected impact: +{reallocation.expectedImpact}% conversions</span>
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                      Apply Reallocation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reallocation Impact Simulation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Impact Simulation</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="roi" fill="#8b5cf6" name="ROI %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeView === 'performance' && (
        <div className="space-y-6">
          {/* Campaign Performance Matrix */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Campaign Performance Matrix</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Efficiency Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget Utilization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaignPerformance.map((campaign, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {campaign.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${campaign.efficiency}%` }}
                            ></div>
                          </div>
                          <span>{campaign.efficiency}/100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Math.round((campaign.spend / campaign.currentBudget) * 100)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.ctr.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.roi}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {campaign.status === 'high-performer' ? (
                          <button className="text-green-600 hover:text-green-800 font-medium">
                            Scale Budget
                          </button>
                        ) : (
                          <button className="text-red-600 hover:text-red-800 font-medium">
                            Optimize
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Efficiency vs ROI Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Efficiency vs ROI Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={2} name="Efficiency Score" />
                  <Line type="monotone" dataKey="roi" stroke="#22c55e" strokeWidth={2} name="ROI %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Opportunity Details Modal */}
      {selectedOpportunity && opportunityDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedOpportunity.title}</h2>
                <p className="text-gray-600 mt-1">Detailed Analysis & Implementation Guide</p>
              </div>
              <button
                onClick={() => {
                  setSelectedOpportunity(null);
                  setOpportunityDetails(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
              {/* Analysis Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Current State Analysis
                  </h3>
                  <p className="text-gray-700 mb-4">{opportunityDetails.analysis.currentState}</p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">Root Cause</h4>
                  <p className="text-gray-700 text-sm">{opportunityDetails.analysis.rootCause}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Market Context
                  </h3>
                  <p className="text-gray-700 mb-4">{opportunityDetails.analysis.marketContext}</p>
                  
                  <h4 className="font-medium text-gray-900 mb-2">Competitive Analysis</h4>
                  <p className="text-gray-700 text-sm">{opportunityDetails.analysis.competitiveAnalysis}</p>
                </div>
              </div>

              {/* Implementation Plan */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Implementation Plan
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Implementation Steps</h4>
                    <div className="space-y-2">
                      {opportunityDetails.implementation.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Resources Required</h4>
                    <ul className="space-y-1 mb-4">
                      {opportunityDetails.implementation.resources.map((resource, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          {resource}
                        </li>
                      ))}
                    </ul>
                    
                    <h4 className="font-medium text-gray-900 mb-3">Potential Risks</h4>
                    <ul className="space-y-1">
                      {opportunityDetails.implementation.risks.map((risk, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-yellow-600" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Projections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    Short-term Projections
                  </h3>
                  <div className="space-y-3">
                    {opportunityDetails.projections.shortTerm.map((projection, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{projection.metric}</span>
                        <div className="text-right">
                          <span className="font-semibold text-green-600">{projection.change}</span>
                          <p className="text-xs text-gray-500">{projection.timeframe}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Long-term Projections
                  </h3>
                  <div className="space-y-3">
                    {opportunityDetails.projections.longTerm.map((projection, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{projection.metric}</span>
                        <div className="text-right">
                          <span className="font-semibold text-purple-600">{projection.change}</span>
                          <p className="text-xs text-gray-500">{projection.timeframe}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Case Study */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {opportunityDetails.caseStudy.title}
                </h3>
                <p className="text-gray-700 mb-3">{opportunityDetails.caseStudy.description}</p>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Results Achieved:</h4>
                  <p className="text-gray-700 text-sm">{opportunityDetails.caseStudy.results}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Timeline: {opportunityDetails.implementation.timeline} | 
                Confidence: {selectedOpportunity.impact.confidence}%
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedOpportunity(null);
                    setOpportunityDetails(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleImplementOptimization(selectedOpportunity.id);
                    setSelectedOpportunity(null);
                    setOpportunityDetails(null);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Implement Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}