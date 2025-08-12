import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Sankey, PieChart, Pie, Cell } from 'recharts';
import { Eye, TrendingUp, TrendingDown, DollarSign, Users, Target, AlertTriangle, Search, Filter, Download, Zap, Globe, Calendar, X, Activity, FileText, Brain, ArrowRight } from 'lucide-react';
import { competitiveIntelligenceGenerator } from '../data/generators/competitive-intelligence-generator';

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

interface StrategicInsight {
  type: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  competitorExample?: string;
}

interface DeepDiveAnalysis {
  competitor: string;
  marketPosition: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  campaignAnalysis: {
    messagingStrategy: string;
    audienceTargeting: string;
    creativeTrends: string;
    budgetAllocation: string;
  };
  competitiveGaps: {
    undefendedKeywords: string[];
    messagingOpportunities: string[];
    audienceSegments: string[];
    contentGaps: string[];
  };
  actionableRecommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    mitigation: string[];
  };
}

export function CompetitiveIntelligence() {
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [insights, setInsights] = useState<StrategicInsight[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorData | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<StrategicInsight | null>(null);
  const [deepDiveData, setDeepDiveData] = useState<DeepDiveAnalysis | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'ads' | 'keywords' | 'insights'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  const marketShareData = [
    { name: 'Your Company', value: 18, color: '#3b82f6' },
    { name: 'DataDog', value: 24, color: '#ef4444' },
    { name: 'New Relic', value: 19, color: '#f59e0b' },
    { name: 'Splunk', value: 15, color: '#10b981' },
    { name: 'Others', value: 24, color: '#6b7280' }
  ];

  const spendTrendData = [
    { week: 'Week 1', yourSpend: 12000, competitorAvg: 15500 },
    { week: 'Week 2', yourSpend: 13500, competitorAvg: 16200 },
    { week: 'Week 3', yourSpend: 11800, competitorAvg: 14800 },
    { week: 'Week 4', yourSpend: 14200, competitorAvg: 17100 }
  ];

  const keywordOverlapData = [
    { keyword: 'application monitoring', yourRank: 3, competitors: 8, opportunity: 'high' },
    { keyword: 'DevOps tools', yourRank: 7, competitors: 12, opportunity: 'medium' },
    { keyword: 'observability platform', yourRank: 1, competitors: 15, opportunity: 'defend' },
    { keyword: 'infrastructure monitoring', yourRank: 5, competitors: 6, opportunity: 'low' },
    { keyword: 'cloud monitoring', yourRank: 9, competitors: 20, opportunity: 'high' }
  ];

  useEffect(() => {
    loadCompetitiveData();
  }, []);

  const loadCompetitiveData = async () => {
    setIsLoading(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const competitorData = competitiveIntelligenceGenerator.generateCompetitorAnalysis();
    const competitiveInsights = competitiveIntelligenceGenerator.generateCompetitiveInsights([]);
    
    setCompetitors(competitorData);
    setInsights(competitiveInsights);
    setSelectedCompetitor(competitorData[0]);
    setIsLoading(false);
  };

  const generateDeepDiveAnalysis = (insight: StrategicInsight): DeepDiveAnalysis => {
    const analyses: { [key: string]: DeepDiveAnalysis } = {
      'messaging': {
        competitor: 'DataDog',
        marketPosition: {
          strengths: [
            'Strong brand recognition in observability space',
            'Comprehensive monitoring platform with 400+ integrations',
            'Established enterprise relationships and trust',
            'Technical thought leadership and content marketing'
          ],
          weaknesses: [
            'Premium pricing limits SMB market penetration',
            'Complex setup and configuration process',
            'Limited customization for specific industry needs',
            'Heavy focus on infrastructure vs. business metrics'
          ],
          opportunities: [
            'Expanding into application security monitoring',
            'Developing industry-specific monitoring solutions',
            'Strengthening mobile and edge computing capabilities',
            'Building AI-powered predictive analytics'
          ],
          threats: [
            'Open source alternatives gaining enterprise traction',
            'Cloud providers building native monitoring tools',
            'New entrants with simpler, more focused solutions',
            'Economic downturn affecting enterprise software budgets'
          ]
        },
        campaignAnalysis: {
          messagingStrategy: 'DataDog positions itself as the "modern monitoring platform" emphasizing observability over traditional monitoring. They focus heavily on developer productivity and infrastructure reliability messaging.',
          audienceTargeting: 'Primary targeting includes DevOps Engineers, SREs, and Engineering Managers at companies with 500+ employees. Secondary targeting includes CTOs and VPs of Engineering at high-growth startups.',
          creativeTrends: '73% video content focusing on product demos and customer success stories. Heavy use of technical terminology and metrics-driven value propositions. Dark color schemes and dashboard visualizations dominate creative assets.',
          budgetAllocation: 'Estimated 60% budget on LinkedIn, 25% on Google Search, 15% on industry publications. Significantly increased spend during Q4 with focus on year-end budget cycles.'
        },
        competitiveGaps: {
          undefendedKeywords: [
            'cost-effective monitoring',
            'small business observability',
            'easy setup monitoring tools',
            'monitoring for startups'
          ],
          messagingOpportunities: [
            'Simplicity and ease of use positioning',
            'Cost-effectiveness for growing companies',
            'Industry-specific monitoring solutions',
            'Business impact vs. technical metrics focus'
          ],
          audienceSegments: [
            'Small to mid-size development teams',
            'Non-technical stakeholders seeking monitoring insights',
            'Price-conscious engineering managers',
            'Companies transitioning from legacy monitoring'
          ],
          contentGaps: [
            'ROI-focused case studies for business stakeholders',
            'Implementation guides for smaller teams',
            'Cost comparison and TCO calculators',
            'Integration tutorials for popular SMB tools'
          ]
        },
        actionableRecommendations: {
          immediate: [
            'Launch campaign targeting "simple observability" and "easy monitoring setup" keywords',
            'Create video content highlighting 5-minute setup vs. DataDog\'s complex implementation',
            'Develop SMB-focused landing pages with transparent pricing and quick ROI calculators',
            'Target companies currently evaluating DataDog with comparison content'
          ],
          shortTerm: [
            'Build thought leadership content around "monitoring for growing companies"',
            'Develop partnerships with popular developer tools used by smaller teams',
            'Create industry-specific monitoring templates and quick-start guides',
            'Launch referral program targeting satisfied customers to compete with DataDog\'s sales team'
          ],
          longTerm: [
            'Develop AI-powered insights that translate technical metrics to business impact',
            'Build mobile-first monitoring interface for modern development teams',
            'Create marketplace for community-contributed monitoring dashboards',
            'Establish thought leadership in cost-effective observability practices'
          ]
        },
        riskAssessment: {
          level: 'medium',
          factors: [
            'DataDog has significantly larger marketing budget and brand awareness',
            'Established enterprise relationships may be difficult to penetrate',
            'They could respond by launching simplified/cheaper tier',
            'Strong technical reputation gives them credibility advantage'
          ],
          mitigation: [
            'Focus on underserved segments where brand matters less than value',
            'Build strong community and word-of-mouth marketing',
            'Develop partnerships with complementary tools DataDog doesn\'t integrate with',
            'Emphasize customer success and satisfaction metrics over feature parity'
          ]
        }
      },
      'audience': {
        competitor: 'New Relic',
        marketPosition: {
          strengths: [
            'Pioneer in application performance monitoring space',
            'Strong developer community and brand loyalty',
            'Comprehensive full-stack monitoring capabilities',
            'Established partnerships with major cloud providers'
          ],
          weaknesses: [
            'Legacy architecture affecting modern cloud-native features',
            'Complex pricing model confusing for buyers',
            'Limited real-time analytics compared to newer competitors',
            'Heavy focus on technical teams vs. business stakeholders'
          ],
          opportunities: [
            'Modernizing platform for cloud-native architectures',
            'Expanding into business intelligence and user analytics',
            'Developing low-code/no-code monitoring solutions',
            'Strengthening mobile application monitoring'
          ],
          threats: [
            'Cloud-native competitors with modern architectures',
            'Open source alternatives reducing barrier to entry',
            'Economic pressure on IT budgets',
            'Shift toward integrated DevOps platforms'
          ]
        },
        campaignAnalysis: {
          messagingStrategy: 'New Relic emphasizes "data-driven decisions" and "performance optimization" targeting technical stakeholders. Recent shift toward "observability for everyone" suggests expansion beyond technical teams.',
          audienceTargeting: 'Heavily targets Senior Software Engineers and DevOps professionals. Expanding to include Product Managers and Engineering Directors. Geographic focus on North America and Europe.',
          creativeTrends: 'Mix of technical deep-dives and business outcome stories. Increased use of customer testimonials and case studies. Color palette shifting from technical blue/green to more accessible purple/orange.',
          budgetAllocation: 'Balanced approach across LinkedIn (40%), Google (35%), and industry events (25%). Notable increase in content marketing and thought leadership investment.'
        },
        competitiveGaps: {
          undefendedKeywords: [
            'modern application monitoring',
            'cloud-native observability',
            'real-time performance analytics',
            'next-generation APM'
          ],
          messagingOpportunities: [
            'Modern architecture and cloud-native design',
            'Real-time insights and instant alerting',
            'Simplified setup for modern applications',
            'Unified monitoring for distributed systems'
          ],
          audienceSegments: [
            'Cloud-native development teams',
            'Companies migrating from legacy monitoring',
            'Technical teams frustrated with complex pricing',
            'Organizations seeking real-time performance insights'
          ],
          contentGaps: [
            'Cloud migration monitoring guides',
            'Real-time alerting best practices',
            'Modern architecture monitoring tutorials',
            'Pricing transparency and calculator tools'
          ]
        },
        actionableRecommendations: {
          immediate: [
            'Target "modern APM" and "cloud-native monitoring" keywords where New Relic has weaker positioning',
            'Create content highlighting real-time capabilities vs. New Relic\'s batch processing limitations',
            'Develop transparent pricing calculator showing cost comparison with New Relic',
            'Launch campaign targeting companies frustrated with New Relic\'s pricing complexity'
          ],
          shortTerm: [
            'Build partnerships with modern cloud-native tools and platforms',
            'Develop migration guides from New Relic to your platform',
            'Create community-driven content around modern monitoring practices',
            'Establish thought leadership in real-time observability space'
          ],
          longTerm: [
            'Develop next-generation monitoring capabilities that leapfrog current market leaders',
            'Build ecosystem of integrations focused on modern development workflows',
            'Create educational platform for modern observability practices',
            'Establish partnerships with emerging cloud platforms and technologies'
          ]
        },
        riskAssessment: {
          level: 'low',
          factors: [
            'New Relic\'s legacy architecture limits innovation speed',
            'Complex pricing creates customer dissatisfaction',
            'Market shift toward cloud-native solutions favors newer entrants',
            'Developer community increasingly open to alternatives'
          ],
          mitigation: [
            'Maintain focus on innovation and modern architecture advantages',
            'Continue emphasizing pricing transparency and simplicity',
            'Build strong developer community and advocacy program',
            'Monitor New Relic\'s modernization efforts and respond quickly'
          ]
        }
      }
    };

    return analyses[insight.type] || analyses['messaging'];
  };

  const handleDeepDiveAnalysis = (insight: StrategicInsight) => {
    setSelectedInsight(insight);
    const analysis = generateDeepDiveAnalysis(insight);
    setDeepDiveData(analysis);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
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

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      case 'defend':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Competitive Intelligence</h2>
            <p className="text-gray-700">Monitor competitor strategies and identify market opportunities</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Market Share</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">18%</p>
          <p className="text-sm text-green-600">+2% vs last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Avg Competitor Spend</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">$125K</p>
          <p className="text-sm text-gray-600">monthly estimate</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Share of Voice</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">22%</p>
          <p className="text-sm text-purple-600">+5% opportunity</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Competitive Threats</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">3</p>
          <p className="text-sm text-orange-600">requires attention</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart className="w-4 h-4" /> },
            { id: 'ads', label: 'Ad Analysis', icon: <Eye className="w-4 h-4" /> },
            { id: 'keywords', label: 'Keywords', icon: <Search className="w-4 h-4" /> },
            { id: 'insights', label: 'Strategic Insights', icon: <Zap className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeView === tab.id
                  ? 'border-red-600 text-red-600'
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
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Market Share & Spend Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Market Share Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={marketShareData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {marketShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Spend Comparison Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spendTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="yourSpend" stroke="#3b82f6" strokeWidth={2} name="Your Spend" />
                    <Line type="monotone" dataKey="competitorAvg" stroke="#ef4444" strokeWidth={2} name="Competitor Avg" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Competitor List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Competitors</h3>
            <div className="space-y-4">
              {competitors.map((competitor) => (
                <div 
                  key={competitor.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedCompetitor(competitor)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{competitor.name}</h4>
                        <p className="text-sm text-gray-600">{competitor.domain}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getActivityColor(competitor.trends.activityLevel)}`}>
                        {competitor.trends.activityLevel} activity
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${competitor.estimatedAdSpend.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">monthly spend</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Market Share</p>
                      <p className="font-semibold text-gray-900">{competitor.marketShare}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Share of Voice</p>
                      <p className="font-semibold text-gray-900">{competitor.performance.shareOfVoice}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Est. CTR</p>
                      <p className="font-semibold text-gray-900">{competitor.performance.estimatedCTR}%</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(competitor.trends.spendTrend)}
                      <span className="text-gray-600">{competitor.trends.spendTrend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'ads' && selectedCompetitor && (
        <div className="space-y-6">
          {/* Selected Competitor Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedCompetitor.name} Ad Analysis</h3>
                <p className="text-gray-600">{selectedCompetitor.adExamples.length} ads tracked in the last {timeRange}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter Ads
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Eye className="w-4 h-4" />
                  View All Ads
                </button>
              </div>
            </div>
          </div>

          {/* Ad Examples */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedCompetitor.adExamples.map((ad) => (
              <div key={ad.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{ad.headline}</h4>
                    <p className="text-gray-700 text-sm mb-3">{ad.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {ad.adFormat}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {ad.callToAction}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">First Seen</p>
                    <p className="font-semibold text-gray-900">{ad.firstSeen.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Daily Impressions</p>
                    <p className="font-semibold text-gray-900">{ad.estimatedImpressionsPerDay.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    Analyze Ad Elements
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'keywords' && (
        <div className="space-y-6">
          {/* Keyword Overlap Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Keyword Competition Analysis</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keyword</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Your Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Competitors</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opportunity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {keywordOverlapData.map((keyword, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {keyword.keyword}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{keyword.yourRank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {keyword.competitors} competing
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getOpportunityColor(keyword.opportunity)}`}>
                          {keyword.opportunity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          {keyword.opportunity === 'high' ? 'Bid Higher' : keyword.opportunity === 'defend' ? 'Defend' : 'Monitor'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Keywords by Competitor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitors.slice(0, 2).map((competitor) => (
              <div key={competitor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">{competitor.name} - Top Keywords</h4>
                <div className="space-y-3">
                  {competitor.topKeywords.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-900">{keyword}</span>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Analyze
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'insights' && (
        <div className="space-y-6">
          {/* Strategic Insights */}
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(insight.priority)}`}>
                        {insight.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{insight.description}</p>
                    
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-blue-900 mb-1">Recommendation:</p>
                      <p className="text-sm text-blue-800">{insight.recommendation}</p>
                    </div>

                    {insight.competitorExample && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-900 mb-1">Competitor Example:</p>
                        <p className="text-sm text-gray-700">{insight.competitorExample}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <Zap className="w-4 h-4" />
                    Implement Strategy
                  </button>
                  <button 
                    onClick={() => handleDeepDiveAnalysis(insight)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Deep Dive Analysis
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deep Dive Analysis Modal */}
      {selectedInsight && deepDiveData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Deep Dive: {selectedInsight.title}</h2>
                <p className="text-gray-600 mt-1">Comprehensive competitive analysis for {deepDiveData.competitor}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedInsight(null);
                  setDeepDiveData(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
              {/* SWOT Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {deepDiveData.marketPosition.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    Weaknesses
                  </h3>
                  <ul className="space-y-2">
                    {deepDiveData.marketPosition.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {deepDiveData.marketPosition.opportunities.map((opportunity, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    Threats
                  </h3>
                  <ul className="space-y-2">
                    {deepDiveData.marketPosition.threats.map((threat, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Campaign Analysis */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Campaign Analysis
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Messaging Strategy</h4>
                    <p className="text-sm text-gray-700 mb-4">{deepDiveData.campaignAnalysis.messagingStrategy}</p>
                    
                    <h4 className="font-medium text-gray-900 mb-3">Audience Targeting</h4>
                    <p className="text-sm text-gray-700">{deepDiveData.campaignAnalysis.audienceTargeting}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Creative Trends</h4>
                    <p className="text-sm text-gray-700 mb-4">{deepDiveData.campaignAnalysis.creativeTrends}</p>
                    
                    <h4 className="font-medium text-gray-900 mb-3">Budget Allocation</h4>
                    <p className="text-sm text-gray-700">{deepDiveData.campaignAnalysis.budgetAllocation}</p>
                  </div>
                </div>
              </div>

              {/* Competitive Gaps */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  Competitive Gaps & Opportunities
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Undefended Keywords</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {deepDiveData.competitiveGaps.undefendedKeywords.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-3">Messaging Opportunities</h4>
                    <ul className="space-y-1">
                      {deepDiveData.competitiveGaps.messagingOpportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 text-green-600" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Audience Segments</h4>
                    <ul className="space-y-1 mb-4">
                      {deepDiveData.competitiveGaps.audienceSegments.map((segment, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                          <Users className="w-3 h-3 text-blue-600" />
                          {segment}
                        </li>
                      ))}
                    </ul>
                    
                    <h4 className="font-medium text-gray-900 mb-3">Content Gaps</h4>
                    <ul className="space-y-1">
                      {deepDiveData.competitiveGaps.contentGaps.map((gap, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                          <FileText className="w-3 h-3 text-purple-600" />
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Actionable Recommendations
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-3">Immediate Actions (1-2 weeks)</h4>
                    <ul className="space-y-2">
                      {deepDiveData.actionableRecommendations.immediate.map((action, index) => (
                        <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-3">Short-term (1-3 months)</h4>
                    <ul className="space-y-2">
                      {deepDiveData.actionableRecommendations.shortTerm.map((action, index) => (
                        <li key={index} className="text-sm text-yellow-800 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-3">Long-term (3-12 months)</h4>
                    <ul className="space-y-2">
                      {deepDiveData.actionableRecommendations.longTerm.map((action, index) => (
                        <li key={index} className="text-sm text-green-800 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Risk Assessment
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm font-medium text-gray-700">Risk Level:</span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRiskColor(deepDiveData.riskAssessment.level)}`}>
                        {deepDiveData.riskAssessment.level} risk
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-3">Risk Factors</h4>
                    <ul className="space-y-2">
                      {deepDiveData.riskAssessment.factors.map((factor, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Mitigation Strategies</h4>
                    <ul className="space-y-2">
                      {deepDiveData.riskAssessment.mitigation.map((strategy, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <Target className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Competitor: {deepDiveData.competitor} | Risk Level: {deepDiveData.riskAssessment.level}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedInsight(null);
                    setDeepDiveData(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Export Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}