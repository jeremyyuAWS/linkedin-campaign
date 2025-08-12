import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Sankey, PieChart, Pie, Cell } from 'recharts';
import { Target, TrendingUp, Users, DollarSign, Eye, MousePointer, Mail, Globe, Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import { conversionFunnelGenerator } from '../data/generators/conversion-funnel-generator';

interface TouchPoint {
  id: string;
  type: 'impression' | 'click' | 'email' | 'direct' | 'organic';
  source: string;
  timestamp: Date;
  value: number;
  attribution: number;
}

interface AttributionModel {
  name: string;
  description: string;
  results: {
    linkedin: number;
    email: number;
    direct: number;
    organic: number;
    referral: number;
  };
}

interface ConversionPath {
  id: string;
  touchpoints: TouchPoint[];
  conversionValue: number;
  timeToConversion: number; // days
  customer: {
    segment: string;
    company: string;
    jobTitle: string;
  };
}

export function AttributionModeling() {
  const [selectedModel, setSelectedModel] = useState<string>('linear');
  const [conversionPaths, setConversionPaths] = useState<ConversionPath[]>([]);
  const [attributionModels, setAttributionModels] = useState<AttributionModel[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const touchpointIcons = {
    impression: <Eye className="w-4 h-4" />,
    click: <MousePointer className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    direct: <Globe className="w-4 h-4" />,
    organic: <TrendingUp className="w-4 h-4" />
  };

  const attributionResults = [
    { source: 'LinkedIn Ads', firstTouch: 45, lastTouch: 32, linear: 38, timeDecay: 35, positionBased: 41 },
    { source: 'Email Marketing', firstTouch: 15, lastTouch: 28, linear: 22, timeDecay: 25, positionBased: 19 },
    { source: 'Direct Traffic', firstTouch: 8, lastTouch: 25, linear: 18, timeDecay: 20, positionBased: 15 },
    { source: 'Organic Search', firstTouch: 25, lastTouch: 10, linear: 15, timeDecay: 12, positionBased: 18 },
    { source: 'Referral', firstTouch: 7, lastTouch: 5, linear: 7, timeDecay: 8, positionBased: 7 }
  ];

  const customerJourneyData = [
    { stage: 'Awareness', linkedin: 100, email: 0, direct: 20, organic: 80 },
    { stage: 'Interest', linkedin: 75, email: 45, direct: 35, organic: 60 },
    { stage: 'Consideration', linkedin: 50, email: 70, direct: 55, organic: 40 },
    { stage: 'Decision', linkedin: 30, email: 85, direct: 80, organic: 20 },
    { stage: 'Purchase', linkedin: 20, email: 60, direct: 90, organic: 10 }
  ];

  const timeToConversionData = [
    { days: '0-7', conversions: 25, percentage: 15 },
    { days: '8-14', conversions: 42, percentage: 25 },
    { days: '15-30', conversions: 58, percentage: 35 },
    { days: '31-60', conversions: 35, percentage: 20 },
    { days: '60+', conversions: 8, percentage: 5 }
  ];

  useEffect(() => {
    loadAttributionData();
  }, [timeRange, selectedSegment]);

  const loadAttributionData = async () => {
    setIsLoading(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate sample conversion paths
    const paths: ConversionPath[] = Array.from({ length: 50 }, (_, i) => ({
      id: `path_${i + 1}`,
      touchpoints: conversionFunnelGenerator.generateAttributionJourney(`campaign_${Math.floor(i / 10) + 1}`),
      conversionValue: Math.floor(Math.random() * 5000) + 1000,
      timeToConversion: Math.floor(Math.random() * 60) + 1,
      customer: {
        segment: ['Enterprise', 'Mid-Market', 'Startup'][Math.floor(Math.random() * 3)],
        company: `Company ${i + 1}`,
        jobTitle: ['CTO', 'Engineering Manager', 'VP Engineering'][Math.floor(Math.random() * 3)]
      }
    }));

    const models: AttributionModel[] = [
      {
        name: 'first_touch',
        description: 'All credit to the first touchpoint',
        results: { linkedin: 45, email: 15, direct: 8, organic: 25, referral: 7 }
      },
      {
        name: 'last_touch',
        description: 'All credit to the last touchpoint',
        results: { linkedin: 32, email: 28, direct: 25, organic: 10, referral: 5 }
      },
      {
        name: 'linear',
        description: 'Equal credit across all touchpoints',
        results: { linkedin: 38, email: 22, direct: 18, organic: 15, referral: 7 }
      },
      {
        name: 'time_decay',
        description: 'More credit to recent touchpoints',
        results: { linkedin: 35, email: 25, direct: 20, organic: 12, referral: 8 }
      },
      {
        name: 'position_based',
        description: '40% first, 40% last, 20% middle',
        results: { linkedin: 41, email: 19, direct: 15, organic: 18, referral: 7 }
      }
    ];

    setConversionPaths(paths);
    setAttributionModels(models);
    setIsLoading(false);
  };

  const getSelectedModelData = () => {
    return attributionModels.find(model => model.name === selectedModel);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Multi-Touch Attribution</h2>
            <p className="text-gray-700">Understand the complete customer journey and channel contribution</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Segments</option>
              <option value="enterprise">Enterprise</option>
              <option value="mid-market">Mid-Market</option>
              <option value="startup">Startup</option>
            </select>
            <button
              onClick={loadAttributionData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Attribution Model Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attribution Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {attributionModels.map((model) => (
            <button
              key={model.name}
              onClick={() => setSelectedModel(model.name)}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedModel === model.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <h4 className="font-medium text-gray-900 mb-2 capitalize">
                {model.name.replace('_', ' ')}
              </h4>
              <p className="text-sm text-gray-600">{model.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Attribution Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Attribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Channel Attribution - {selectedModel.replace('_', ' ').toUpperCase()}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(getSelectedModelData()?.results || {}).map(([key, value]) => ({
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    value
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(getSelectedModelData()?.results || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Comparison */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Model Comparison - LinkedIn Ads</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attributionResults}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="firstTouch" fill="#ef4444" name="First Touch" />
                <Bar dataKey="lastTouch" fill="#10b981" name="Last Touch" />
                <Bar dataKey="linear" fill="#3b82f6" name="Linear" />
                <Bar dataKey="timeDecay" fill="#f59e0b" name="Time Decay" />
                <Bar dataKey="positionBased" fill="#8b5cf6" name="Position Based" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Customer Journey Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Journey by Channel</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={customerJourneyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="linkedin" stroke="#3b82f6" strokeWidth={2} name="LinkedIn Ads" />
              <Line type="monotone" dataKey="email" stroke="#10b981" strokeWidth={2} name="Email Marketing" />
              <Line type="monotone" dataKey="direct" stroke="#f59e0b" strokeWidth={2} name="Direct Traffic" />
              <Line type="monotone" dataKey="organic" stroke="#ef4444" strokeWidth={2} name="Organic Search" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time to Conversion & Path Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time to Conversion */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Time to Conversion</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeToConversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="days" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversions" fill="#3b82f6" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Conversion Paths */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Conversion Paths</h3>
          <div className="space-y-4">
            {conversionPaths.slice(0, 5).map((path) => (
              <div key={path.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-900">{path.customer.company}</p>
                    <p className="text-sm text-gray-600">{path.customer.jobTitle} • {path.customer.segment}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${path.conversionValue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{path.timeToConversion} days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {path.touchpoints.slice(0, 6).map((touchpoint, index) => (
                    <React.Fragment key={touchpoint.id}>
                      <div className="flex items-center gap-1">
                        {touchpointIcons[touchpoint.type]}
                        <span className="text-xs text-gray-600">{touchpoint.source}</span>
                      </div>
                      {index < Math.min(path.touchpoints.length - 1, 5) && (
                        <div className="w-2 h-0.5 bg-gray-300"></div>
                      )}
                    </React.Fragment>
                  ))}
                  {path.touchpoints.length > 6 && (
                    <span className="text-xs text-gray-500">+{path.touchpoints.length - 6} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attribution Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Attribution Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">LinkedIn Ads Impact</h4>
            </div>
            <p className="text-sm text-blue-800 mb-2">
              LinkedIn Ads drives 38% of conversions (linear model) with strong early-stage influence.
            </p>
            <p className="text-xs text-blue-700">
              Recommendation: Increase awareness campaigns to capture more first-touch attribution.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">Email Nurturing</h4>
            </div>
            <p className="text-sm text-green-800 mb-2">
              Email marketing shows strong mid-funnel performance with 22% attribution.
            </p>
            <p className="text-xs text-green-700">
              Recommendation: Optimize email sequences for LinkedIn-generated leads.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-purple-900">Sales Cycle</h4>
            </div>
            <p className="text-sm text-purple-800 mb-2">
              Average 23-day sales cycle with peak conversions at 15-30 days.
            </p>
            <p className="text-xs text-purple-700">
              Recommendation: Intensify nurturing campaigns at the 2-week mark.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}