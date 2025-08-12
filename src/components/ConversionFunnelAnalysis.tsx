import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, FunnelChart, Funnel, Cell } from 'recharts';
import { TrendingDown, TrendingUp, Users, Target, Clock, Zap, AlertTriangle, CheckCircle, Filter, Download, RefreshCw } from 'lucide-react';
import { conversionFunnelGenerator } from '../data/generators/conversion-funnel-generator';

interface FunnelStage {
  name: string;
  visitors: number;
  conversionRate: number;
  dropoffRate: number;
  averageTimeToNext: number;
  value: number;
}

interface FunnelData {
  campaignId: string;
  stages: FunnelStage[];
  totalValue: number;
  conversionWindows: {
    view: number;
    click: number;
  };
  attributionModel: string;
}

interface FunnelOptimization {
  stage: string;
  issue: string;
  recommendation: string;
  expectedImprovement: string;
  priority: 'high' | 'medium' | 'low';
}

interface ConversionFunnelAnalysisProps {
  campaigns: any[];
}

export function ConversionFunnelAnalysis({ campaigns }: ConversionFunnelAnalysisProps) {
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [optimizations, setOptimizations] = useState<FunnelOptimization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample funnel data
  const overallFunnelData = [
    { name: 'Ad Views', value: 425000, fill: '#3b82f6' },
    { name: 'Clicks', value: 14250, fill: '#10b981' },
    { name: 'Landing Page', value: 13540, fill: '#f59e0b' },
    { name: 'Form Start', value: 6090, fill: '#ef4444' },
    { name: 'Form Submit', value: 3380, fill: '#8b5cf6' },
    { name: 'Lead Qualified', value: 2030, fill: '#ec4899' },
    { name: 'Opportunity', value: 812, fill: '#14b8a6' },
    { name: 'Customer', value: 304, fill: '#f97316' }
  ];

  const funnelMetrics = [
    { metric: 'Overall Conversion Rate', value: '0.072%', change: '+0.015%', trend: 'up' },
    { metric: 'Form Completion Rate', value: '55.5%', change: '-2.3%', trend: 'down' },
    { metric: 'Lead to Opportunity', value: '40.0%', change: '+5.2%', trend: 'up' },
    { metric: 'Close Rate', value: '37.4%', change: '+1.8%', trend: 'up' }
  ];

  const stageDurationData = [
    { stage: 'Click to Landing', avgTime: 0.2, benchmark: 0.15 },
    { stage: 'Landing to Form', avgTime: 2.3, benchmark: 1.8 },
    { stage: 'Form to Submit', avgTime: 4.1, benchmark: 3.5 },
    { stage: 'Submit to Qualified', avgTime: 72, benchmark: 48 },
    { stage: 'Qualified to Opportunity', avgTime: 168, benchmark: 120 },
    { stage: 'Opportunity to Close', avgTime: 840, benchmark: 720 }
  ];

  useEffect(() => {
    loadFunnelData();
  }, [selectedCampaign, selectedTimeframe, campaigns]);

  const loadFunnelData = async () => {
    setIsLoading(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const funnels = conversionFunnelGenerator.generateConversionFunnels(campaigns);
    const recommendations = conversionFunnelGenerator.generateFunnelRecommendations(funnels[0]);
    
    setFunnelData(funnels);
    setOptimizations(recommendations);
    setIsLoading(false);
  };

  const getSelectedFunnelData = () => {
    if (selectedCampaign === 'all') {
      return overallFunnelData;
    }
    const selectedFunnel = funnelData.find(f => f.campaignId === selectedCampaign);
    return selectedFunnel?.stages.map(stage => ({
      name: stage.name,
      value: stage.visitors,
      fill: '#3b82f6'
    })) || [];
  };

  const calculateDropoffRate = (current: number, previous: number) => {
    return ((previous - current) / previous * 100).toFixed(1);
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

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
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
      <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Conversion Funnel Analysis</h2>
            <p className="text-gray-700">Deep dive into customer journey and conversion bottlenecks</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Campaigns</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
              ))}
            </select>
            <button
              onClick={loadFunnelData}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Funnel Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {funnelMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metric.trend)}
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Funnel Visualization */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Conversion Funnel - {selectedCampaign === 'all' ? 'All Campaigns' : campaigns.find(c => c.id === selectedCampaign)?.name}
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Funnel Chart */}
          <div className="lg:col-span-2">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Funnel
                    dataKey="value"
                    data={getSelectedFunnelData()}
                    isAnimationActive
                    labelLine
                    label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                  >
                    {getSelectedFunnelData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Funnel>
                  <Tooltip />
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Funnel Stats */}
          <div className="space-y-4">
            {getSelectedFunnelData().map((stage, index) => {
              const nextStage = getSelectedFunnelData()[index + 1];
              const dropoffRate = nextStage ? calculateDropoffRate(nextStage.value, stage.value) : 0;
              
              return (
                <div key={stage.name} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{stage.name}</h4>
                    <span className="text-lg font-bold text-gray-900">
                      {stage.value.toLocaleString()}
                    </span>
                  </div>
                  {nextStage && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Drop-off to next stage:</span>
                      <span className={`font-medium ${
                        parseFloat(dropoffRate) > 50 ? 'text-red-600' : 
                        parseFloat(dropoffRate) > 25 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {dropoffRate}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage Duration Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Stage Duration Analysis</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageDurationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgTime" fill="#3b82f6" name="Your Average (hours)" />
              <Bar dataKey="benchmark" fill="#10b981" name="Industry Benchmark (hours)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Optimization Recommendations</h3>
        <div className="space-y-4">
          {optimizations.map((optimization, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{optimization.stage}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(optimization.priority)}`}>
                      {optimization.priority} priority
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{optimization.issue}</p>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-blue-900 mb-1">Recommendation:</p>
                    <p className="text-sm text-blue-800">{optimization.recommendation}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      Expected Impact: {optimization.expectedImprovement}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  Implement Fix
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Zap className="w-4 h-4" />
                  Run A/B Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="font-medium text-red-900">Biggest Drop-off</h4>
          </div>
          <p className="text-2xl font-bold text-red-600 mb-2">Landing → Form Start</p>
          <p className="text-sm text-red-800">55% of visitors leave without starting the form</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-green-900">Best Performer</h4>
          </div>
          <p className="text-2xl font-bold text-green-600 mb-2">Opportunity → Close</p>
          <p className="text-sm text-green-800">37.4% close rate, above industry average</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Average Sales Cycle</h4>
          </div>
          <p className="text-2xl font-bold text-blue-600 mb-2">35 days</p>
          <p className="text-sm text-blue-800">From first click to closed deal</p>
        </div>
      </div>
    </div>
  );
}