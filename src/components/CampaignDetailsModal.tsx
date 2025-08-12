import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Zap,
  Clock,
  Globe,
  Smartphone,
  Calendar,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Settings,
  Play,
  Pause
} from 'lucide-react';
import { Campaign } from '../types';

interface CampaignDetailsModalProps {
  campaign: Campaign;
  onClose: () => void;
}

export function CampaignDetailsModal({ campaign, onClose }: CampaignDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'api-actions'>('overview');

  // Calculate additional metrics
  const conversionRate = ((campaign.metrics.conversions / campaign.metrics.clicks) * 100);
  const costPerClick = campaign.metrics.cpc;
  const dailySpend = campaign.last_7_days.spend / 7;
  const forecastDays = Math.floor(campaign.budget.remaining / dailySpend);
  const weeklyTrend = ((campaign.last_7_days.ctr - campaign.metrics.ctr) / campaign.metrics.ctr) * 100;

  // Generate LinkedIn API-based recommendations
  const getLinkedInApiRecommendations = () => {
    const recommendations = [];

    // Budget & Bidding Recommendations
    if (campaign.metrics.ctr > 3.5 && campaign.budget.remaining > 1000) {
      recommendations.push({
        type: 'budget',
        priority: 'high',
        icon: <DollarSign className="w-5 h-5 text-green-600" />,
        title: 'Increase Daily Budget',
        description: 'Strong performance detected. Scale budget to maximize reach.',
        action: 'LinkedIn API: Update campaignGroup.dailyBudget.amount',
        implementation: 'PATCH /adCampaigns/{campaign-id}',
        parameters: { dailyBudget: { amount: dailySpend * 1.5 } },
        expectedImpact: '+40% impressions, +35% conversions'
      });
    }

    if (campaign.metrics.ctr < 2.0) {
      recommendations.push({
        type: 'bidding',
        priority: 'high',
        icon: <Target className="w-5 h-5 text-orange-600" />,
        title: 'Optimize Bid Strategy',
        description: 'Low CTR indicates bid strategy needs adjustment.',
        action: 'LinkedIn API: Update bidding.bidStrategy',
        implementation: 'PATCH /adCampaigns/{campaign-id}',
        parameters: { bidding: { bidStrategy: 'TARGET_COST' } },
        expectedImpact: 'Improved ad positioning, +15-25% CTR'
      });
    }

    // Audience Targeting Recommendations
    recommendations.push({
      type: 'audience',
      priority: 'medium',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      title: 'Expand Audience Targeting',
      description: 'Add high-performing job titles to reach similar professionals.',
      action: 'LinkedIn API: Update campaign.targeting.includedTargets',
      implementation: 'PATCH /adCampaigns/{campaign-id}',
      parameters: {
        targeting: {
          includedTargets: [
            { facet: 'FUNCTION', values: ['VP, Data Science', 'Director of Engineering'] },
            { facet: 'SENIORITY', values: ['SENIOR', 'DIRECTOR'] }
          ]
        }
      },
      expectedImpact: '+20% reach, similar performance quality'
    });

    // Creative Recommendations
    if (weeklyTrend < -15) {
      recommendations.push({
        type: 'creative',
        priority: 'high',
        icon: <Zap className="w-5 h-5 text-purple-600" />,
        title: 'Creative Refresh Required',
        description: 'Performance decline suggests creative fatigue.',
        action: 'LinkedIn API: Rotate to backup creatives',
        implementation: 'PATCH /adCreatives/{creative-id}',
        parameters: { status: 'ACTIVE' },
        expectedImpact: 'Reset audience engagement, +20-30% CTR'
      });
    }

    // Schedule Optimization
    recommendations.push({
      type: 'schedule',
      priority: 'medium',
      icon: <Clock className="w-5 h-5 text-indigo-600" />,
      title: 'Optimize Ad Scheduling',
      description: 'Limit delivery to high-performing business hours.',
      action: 'LinkedIn API: Update campaign.runSchedule',
      implementation: 'PATCH /adCampaigns/{campaign-id}',
      parameters: {
        runSchedule: {
          hours: { monday: ['09:00-17:00'], tuesday: ['09:00-17:00'] }
        }
      },
      expectedImpact: '-15% spend, maintain conversion volume'
    });

    // Geographic Targeting
    recommendations.push({
      type: 'geographic',
      priority: 'low',
      icon: <Globe className="w-5 h-5 text-teal-600" />,
      title: 'Refine Geographic Targeting',
      description: 'Focus budget on top-performing regions.',
      action: 'LinkedIn API: Update targeting.includedLocations',
      implementation: 'PATCH /adCampaigns/{campaign-id}',
      parameters: {
        targeting: {
          includedLocations: [
            { country: 'US', region: 'California' },
            { country: 'US', region: 'New York' }
          ]
        }
      },
      expectedImpact: '+10% conversion rate, better cost efficiency'
    });

    return recommendations;
  };

  const recommendations = getLinkedInApiRecommendations();

  // Quick Actions available through LinkedIn API
  const getQuickActions = () => [
    {
      id: 'pause',
      title: 'Pause Campaign',
      description: 'Temporarily stop all ad delivery',
      api: 'PATCH /adCampaigns/{id}',
      params: { status: 'PAUSED' },
      icon: <Pause className="w-4 h-4" />,
      danger: false
    },
    {
      id: 'increase_budget',
      title: 'Increase Budget by 25%',
      description: 'Scale successful campaign performance',
      api: 'PATCH /adCampaigns/{id}',
      params: { dailyBudget: { amount: dailySpend * 1.25 } },
      icon: <TrendingUp className="w-4 h-4" />,
      danger: false
    },
    {
      id: 'optimize_bids',
      title: 'Switch to Auto Bidding',
      description: 'Let LinkedIn optimize for best results',
      api: 'PATCH /adCampaigns/{id}',
      params: { bidding: { bidStrategy: 'TARGET_COST' } },
      icon: <Target className="w-4 h-4" />,
      danger: false
    },
    {
      id: 'emergency_stop',
      title: 'Emergency Budget Stop',
      description: 'Set daily budget to $1 to minimize spend',
      api: 'PATCH /adCampaigns/{id}',
      params: { dailyBudget: { amount: 1 } },
      icon: <AlertTriangle className="w-4 h-4" />,
      danger: true
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Performance Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'recommendations', label: 'AI Recommendations', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'api-actions', label: 'LinkedIn API Actions', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{campaign.name}</h2>
            <p className="text-gray-600 mt-1">Detailed campaign insights & LinkedIn API recommendations</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-white">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Performance Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{campaign.metrics.ctr.toFixed(2)}%</p>
                  <p className="text-sm text-gray-600">Click-Through Rate</p>
                  <div className={`flex items-center justify-center gap-1 mt-1 ${weeklyTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {weeklyTrend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="text-xs">{Math.abs(weeklyTrend).toFixed(1)}% vs last week</span>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">${costPerClick.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Cost Per Click</p>
                  <p className="text-xs text-gray-500 mt-1">Industry avg: $5.85</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{conversionRate.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-xs text-gray-500 mt-1">{campaign.metrics.conversions} total conversions</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{forecastDays}</p>
                  <p className="text-sm text-gray-600">Days Remaining</p>
                  <p className="text-xs text-gray-500 mt-1">At current pace</p>
                </div>
              </div>

              {/* Budget Analysis */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Total Budget</p>
                    <p className="text-2xl font-bold text-gray-900">${campaign.budget.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Spent ({((campaign.budget.spent / campaign.budget.total) * 100).toFixed(1)}%)</p>
                    <p className="text-2xl font-bold text-orange-600">${campaign.budget.spent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Remaining</p>
                    <p className="text-2xl font-bold text-green-600">${campaign.budget.remaining.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Daily Spend Trend</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-900">${dailySpend.toFixed(0)}/day</p>
                    <span className="text-sm text-gray-500">(7-day average)</span>
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Performance Analysis</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <p className="text-gray-700">
                      <strong>Strong Engagement:</strong> CTR is {((campaign.metrics.ctr / 2.7) * 100 - 100).toFixed(0)}% above LinkedIn industry benchmark
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <p className="text-gray-700">
                      <strong>Budget Pacing:</strong> Current spend rate will {forecastDays < 20 ? 'exhaust' : 'underspend'} budget
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <p className="text-gray-700">
                      <strong>Optimization Potential:</strong> {recommendations.length} LinkedIn API optimizations available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Optimization Recommendations</h3>
                <p className="text-gray-700">
                  Based on campaign performance analysis and LinkedIn API capabilities, here are the top recommendations 
                  to improve your campaign results.
                </p>
              </div>

              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {rec.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{rec.title}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {rec.priority} priority
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{rec.description}</p>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">LinkedIn API Implementation:</h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {rec.implementation}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Action:</strong> {rec.action}
                          </div>
                          <details className="text-sm">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                              View API Parameters
                            </summary>
                            <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                              {JSON.stringify(rec.parameters, null, 2)}
                            </pre>
                          </details>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-green-600 font-medium">
                          Expected Impact: {rec.expectedImpact}
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Implement Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'api-actions' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">LinkedIn API Quick Actions</h3>
                <p className="text-gray-700">
                  Execute immediate campaign changes through LinkedIn's Marketing API. 
                  These actions will be applied directly to your live campaign.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getQuickActions().map((action) => (
                  <div 
                    key={action.id}
                    className={`border rounded-lg p-6 hover:shadow-md transition-all cursor-pointer ${
                      action.danger 
                        ? 'border-red-200 hover:border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        action.danger ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                        
                        <div className="bg-gray-50 rounded p-3 mb-3">
                          <p className="text-xs font-mono text-gray-700">{action.api}</p>
                        </div>
                        
                        <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          action.danger 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}>
                          Execute Action
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* API Configuration Panel */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">API Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Ad Account ID
                    </label>
                    <input 
                      type="text" 
                      value="urn:li:sponsoredAccount:123456789"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign URN
                    </label>
                    <input 
                      type="text" 
                      value={`urn:li:sponsoredCampaign:${campaign.id}`}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">API Access Required</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Connect your LinkedIn Marketing API credentials to enable live campaign modifications. 
                        All changes will be logged and can be reversed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Campaign ID: {campaign.id} | Last updated: {new Date().toLocaleString()}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}