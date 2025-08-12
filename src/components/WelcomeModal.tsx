import React, { useState } from 'react';
import { X, HelpCircle, BarChart3, DollarSign, Palette, Users, Bell, MessageCircle, Bot, TrendingUp, Shuffle, Eye, Target, Activity, FileText, Zap, Brain, CheckCircle, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TabInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  why: string;
  aiFeatures: string[];
  keyBenefits: string[];
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  if (!isOpen) return null;

  const tabsInfo: TabInfo[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Your central command center for LinkedIn campaign performance with real-time metrics and AI-powered insights.',
      why: 'Get an instant overview of all campaigns, spot trends, and identify opportunities or issues at a glance. Critical for daily decision-making.',
      aiFeatures: [
        'AI-generated performance summaries and trend analysis',
        'Automated anomaly detection for unusual campaign behavior',
        'Smart recommendations based on performance patterns',
        'Predictive insights for campaign trajectory'
      ],
      keyBenefits: [
        'Save 2+ hours daily with automated reporting',
        'Catch performance issues 80% faster',
        'Data-driven decisions with AI insights',
        'Unified view across all campaigns'
      ]
    },
    {
      id: 'budget',
      name: 'Budget Monitor',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Advanced budget tracking with AI forecasting to prevent overspend and optimize budget allocation.',
      why: 'Budget overruns can destroy ROI. This prevents costly mistakes and helps you reallocate budget to high-performing campaigns.',
      aiFeatures: [
        'AI-powered spend forecasting and budget alerts',
        'Smart budget reallocation recommendations',
        'Automated pacing adjustments based on performance',
        'Predictive burn rate analysis with early warnings'
      ],
      keyBenefits: [
        'Prevent budget overruns with 95% accuracy',
        'Optimize budget allocation for 20-40% better ROI',
        'Automated alerts save 5+ hours weekly',
        'Data-driven budget decisions'
      ]
    },
    {
      id: 'creative',
      name: 'Creative Lab',
      icon: <Palette className="w-5 h-5" />,
      description: 'AI-powered creative analysis and optimization with automated A/B testing and performance insights.',
      why: 'Creative fatigue kills campaign performance. This identifies winning elements and suggests optimizations before performance drops.',
      aiFeatures: [
        'AI creative performance analysis and scoring',
        'Automated headline and copy generation',
        'Smart A/B test recommendations',
        'Creative fatigue detection and refresh alerts'
      ],
      keyBenefits: [
        'Increase CTR by 15-35% with AI optimizations',
        'Reduce creative production time by 60%',
        'Identify winning elements automatically',
        'Prevent creative fatigue before it impacts performance'
      ]
    },
    {
      id: 'audience',
      name: 'Audience Insights',
      icon: <Users className="w-5 h-5" />,
      description: 'Deep audience analysis with AI-powered segmentation, lookalike generation, and expansion recommendations.',
      why: 'The right audience is everything. This finds your best-performing segments and suggests profitable expansions.',
      aiFeatures: [
        'AI audience performance analysis and scoring',
        'Automated lookalike audience generation',
        'Smart targeting expansion recommendations',
        'Behavioral pattern recognition and insights'
      ],
      keyBenefits: [
        'Discover high-value audiences 3x faster',
        'Reduce cost-per-conversion by 25-50%',
        'Automated audience expansion with 90% accuracy',
        'Behavioral insights for better targeting'
      ]
    },
    {
      id: 'alerts',
      name: 'Smart Alerts',
      icon: <Bell className="w-5 h-5" />,
      description: 'Intelligent alert system with AI-powered recommendations and automated actions for critical issues.',
      why: 'Never miss important changes. Get notified of opportunities and issues the moment they happen, not days later.',
      aiFeatures: [
        'AI-powered anomaly detection and alerts',
        'Smart recommendation engine for quick fixes',
        'Automated priority scoring based on impact',
        'Predictive alerts for potential issues'
      ],
      keyBenefits: [
        'Catch issues 5x faster than manual monitoring',
        'Reduce response time from hours to minutes',
        'Automated recommendations save 10+ hours weekly',
        'Prevent revenue loss with early warnings'
      ]
    },
    {
      id: 'qa',
      name: 'Campaign Q&A',
      icon: <MessageCircle className="w-5 h-5" />,
      description: 'Conversational AI assistant that answers complex questions about your campaigns with data-driven insights.',
      why: 'Get instant answers to complex questions without digging through reports. Perfect for stakeholder meetings and quick analysis.',
      aiFeatures: [
        'Natural language processing for complex queries',
        'AI-powered data analysis and interpretation',
        'Context-aware responses with supporting data',
        'Automated report generation from conversations'
      ],
      keyBenefits: [
        'Get answers 10x faster than manual analysis',
        'Perfect for stakeholder meetings and reporting',
        'No need to learn complex analytics tools',
        'Conversational interface saves training time'
      ]
    },
    {
      id: 'automation',
      name: 'Automation',
      icon: <Bot className="w-5 h-5" />,
      description: 'Advanced campaign automation with AI-driven rules, budget optimization, and performance-based actions.',
      why: 'Scale your campaigns without scaling your workload. Automate routine optimizations and focus on strategy.',
      aiFeatures: [
        'AI-powered automation rules and triggers',
        'Smart budget reallocation based on performance',
        'Automated bid optimization and adjustments',
        'Performance-based campaign scaling'
      ],
      keyBenefits: [
        'Manage 5x more campaigns with same resources',
        'Improve performance with 24/7 optimization',
        'Reduce manual work by 70%',
        'Consistent optimization without human error'
      ]
    },
    {
      id: 'predictions',
      name: 'Predictive Analytics',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'AI-powered forecasting and predictive models for campaign performance and budget planning.',
      why: 'Predict the future to make better decisions today. Plan budgets, forecast results, and optimize for future performance.',
      aiFeatures: [
        'Machine learning performance forecasting',
        'AI-powered budget planning and optimization',
        'Predictive audience behavior modeling',
        'Advanced statistical analysis and trend prediction'
      ],
      keyBenefits: [
        'Predict campaign results with 85% accuracy',
        'Better budget planning and allocation',
        'Identify trends before competitors',
        'Data-driven strategic planning'
      ]
    },
    {
      id: 'optimization',
      name: 'Cross-Campaign',
      icon: <Shuffle className="w-5 h-5" />,
      description: 'AI-driven optimization across all campaigns with smart budget reallocation and performance synchronization.',
      why: 'Optimize your entire portfolio, not just individual campaigns. Find opportunities and inefficiencies across your whole account.',
      aiFeatures: [
        'AI portfolio optimization and analysis',
        'Smart budget reallocation algorithms',
        'Cross-campaign performance correlation analysis',
        'Automated resource optimization'
      ],
      keyBenefits: [
        'Improve overall ROI by 20-30%',
        'Identify budget reallocation opportunities',
        'Holistic optimization vs. siloed campaigns',
        'Maximize impact of limited resources'
      ]
    },
    {
      id: 'competitive',
      name: 'Competitive Intel',
      icon: <Eye className="w-5 h-5" />,
      description: 'AI-powered competitive intelligence with market analysis, competitor tracking, and strategic insights.',
      why: 'Stay ahead of competitors with real-time intelligence. Identify market opportunities and adjust strategy accordingly.',
      aiFeatures: [
        'AI competitor analysis and benchmarking',
        'Automated market intelligence gathering',
        'Smart competitive strategy recommendations',
        'Trend analysis and market positioning insights'
      ],
      keyBenefits: [
        'Stay ahead of market trends and competitors',
        'Identify competitive gaps and opportunities',
        'Benchmark performance against industry leaders',
        'Strategic insights for competitive advantage'
      ]
    },
    {
      id: 'attribution',
      name: 'Attribution',
      icon: <Target className="w-5 h-5" />,
      description: 'Advanced multi-touch attribution modeling with AI-powered customer journey analysis.',
      why: 'Understand the true customer journey and give credit where it\'s due. Optimize the full funnel, not just last-click.',
      aiFeatures: [
        'AI-powered attribution modeling and analysis',
        'Customer journey mapping and optimization',
        'Smart touchpoint value calculation',
        'Predictive customer behavior analysis'
      ],
      keyBenefits: [
        'Understand true campaign contribution',
        'Optimize the entire customer journey',
        'Better budget allocation across touchpoints',
        'Increase conversion rates by 15-25%'
      ]
    },
    {
      id: 'funnel',
      name: 'Conversion Funnel',
      icon: <Activity className="w-5 h-5" />,
      description: 'Deep funnel analysis with AI-powered optimization recommendations and bottleneck identification.',
      why: 'Find and fix conversion bottlenecks. Every step in your funnel matters for overall campaign ROI.',
      aiFeatures: [
        'AI funnel analysis and bottleneck detection',
        'Smart optimization recommendations',
        'Predictive conversion modeling',
        'Automated A/B testing suggestions'
      ],
      keyBenefits: [
        'Identify conversion bottlenecks instantly',
        'Improve conversion rates by 20-40%',
        'Reduce cost-per-acquisition',
        'Optimize entire customer journey'
      ]
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: <FileText className="w-5 h-5" />,
      description: 'Automated report generation with AI-powered insights, executive summaries, and actionable recommendations.',
      why: 'Create professional reports in seconds, not hours. Perfect for stakeholders, executives, and client presentations.',
      aiFeatures: [
        'AI-powered report generation and insights',
        'Automated executive summaries',
        'Smart recommendation generation',
        'Context-aware analysis and explanations'
      ],
      keyBenefits: [
        'Create reports 10x faster',
        'Professional insights without manual analysis',
        'Impress stakeholders with AI-powered insights',
        'Save 5+ hours weekly on reporting'
      ]
    }
  ];

  const getCurrentTabInfo = () => {
    return tabsInfo.find(tab => tab.id === activeTab);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to LinkedIn Analyst Agent</h2>
              <p className="text-gray-600">AI-Powered Campaign Intelligence Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Tab Selector */}
          <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  <div>
                    <h3 className="font-medium">Platform Overview</h3>
                    <p className="text-xs text-gray-600">AI capabilities & benefits</p>
                  </div>
                </div>
              </button>

              <div className="border-t border-gray-300 pt-3 mt-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Features</h4>
                {tabsInfo.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {tab.icon}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{tab.name}</h3>
                        <p className="text-xs text-gray-600 truncate">{tab.description.substring(0, 40)}...</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'overview' ? (
              <div className="p-6 space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Transform Your LinkedIn Advertising</h3>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Harness the power of AI to optimize campaigns, predict performance, and maximize ROI across your entire LinkedIn advertising portfolio.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Intelligence</h4>
                    <p className="text-gray-600 text-sm">
                      Advanced machine learning algorithms analyze your campaigns 24/7, providing insights and optimizations human analysts would miss.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Automated Optimization</h4>
                    <p className="text-gray-600 text-sm">
                      Set rules once and let AI optimize budgets, bids, and audiences automatically based on performance data and market conditions.
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Predictive Analytics</h4>
                    <p className="text-gray-600 text-sm">
                      Forecast campaign performance, predict budget needs, and identify opportunities before your competitors do.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Save 15+ hours weekly on campaign management',
                      'Improve ROI by 20-40% with AI optimizations',
                      'Prevent budget overruns with 95% accuracy',
                      'Scale campaigns without scaling headcount',
                      'Get insights faster than competitors',
                      'Make data-driven decisions with confidence'
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-4">Ready to explore? Click any feature on the left to learn more.</p>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start with Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {getCurrentTabInfo() && (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        {getCurrentTabInfo()!.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{getCurrentTabInfo()!.name}</h3>
                        <p className="text-gray-600">{getCurrentTabInfo()!.description}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-blue-900 mb-3">Why This Matters</h4>
                      <p className="text-blue-800">{getCurrentTabInfo()!.why}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Brain className="w-5 h-5 text-purple-600" />
                          AI Features
                        </h4>
                        <ul className="space-y-3">
                          {getCurrentTabInfo()!.aiFeatures.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Zap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Key Benefits
                        </h4>
                        <ul className="space-y-3">
                          {getCurrentTabInfo()!.keyBenefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Getting Started</h4>
                      <p className="text-gray-700 mb-4">
                        Click on the <strong>{getCurrentTabInfo()!.name}</strong> tab in the main navigation to start using these features. 
                        The AI will begin analyzing your data immediately and provide insights within minutes.
                      </p>
                      <button
                        onClick={onClose}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Go to {getCurrentTabInfo()!.name}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}