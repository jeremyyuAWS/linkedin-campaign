import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, Target, TrendingUp, MapPin, Smartphone, Clock, Filter, Download, Lightbulb, Plus, X, CheckCircle, AlertTriangle, Settings, Zap } from 'lucide-react';
import { AudienceInsight } from '../types';

interface AudienceInsightsProps {
  insights: AudienceInsight;
}

interface AudienceSegment {
  name: string;
  size: number;
  ctr: number;
  cpc: number;
  conversions: number;
  growth: number;
}

interface LookalikeConfig {
  sourceName: string;
  similarity: number;
  reach: number;
  name: string;
  description: string;
  targetCampaigns: string[];
  advancedSettings: {
    exclusions: string[];
    customAttributes: string[];
    minimumReach: number;
    maximumReach: number;
  };
}

interface CreatedLookalike {
  id: string;
  name: string;
  sourceName: string;
  similarity: number;
  estimatedReach: number;
  status: 'creating' | 'ready' | 'active' | 'error';
  createdAt: Date;
  performance?: {
    expectedCTR: number;
    confidence: number;
  };
}

export function AudienceInsights({ insights }: AudienceInsightsProps) {
  const [activeView, setActiveView] = useState<'overview' | 'demographics' | 'behavior' | 'expansion'>('overview');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [showLookalikeModal, setShowLookalikeModal] = useState(false);
  const [selectedLookalikeType, setSelectedLookalikeType] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createdLookalikes, setCreatedLookalikes] = useState<CreatedLookalike[]>([
    {
      id: 'lookalike_001',
      name: 'Software Engineers - High Performers',
      sourceName: 'Software Engineers',
      similarity: 95,
      estimatedReach: 45000,
      status: 'active',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      performance: {
        expectedCTR: 3.8,
        confidence: 92
      }
    }
  ]);

  const [lookalikeConfig, setLookalikeConfig] = useState<LookalikeConfig>({
    sourceName: '',
    similarity: 95,
    reach: 45000,
    name: '',
    description: '',
    targetCampaigns: [],
    advancedSettings: {
      exclusions: [],
      customAttributes: [],
      minimumReach: 10000,
      maximumReach: 200000
    }
  });

  // Generate additional audience data
  const audienceSegments: AudienceSegment[] = [
    { name: 'Technical Leaders', size: 15420, ctr: 4.2, cpc: 4.50, conversions: 89, growth: 12.5 },
    { name: 'Product Managers', size: 8930, ctr: 3.1, cpc: 5.20, conversions: 34, growth: 8.2 },
    { name: 'Engineering Managers', size: 12350, ctr: 3.8, cpc: 4.80, conversions: 67, growth: 15.3 },
    { name: 'Startup Founders', size: 6780, ctr: 4.5, cpc: 3.90, conversions: 45, growth: 22.1 },
    { name: 'Enterprise Architects', size: 4560, ctr: 3.6, cpc: 6.10, conversions: 28, growth: 5.7 }
  ];

  const deviceData = [
    { device: 'Desktop', users: 45, ctr: 3.8, conversions: 152 },
    { device: 'Mobile', users: 35, ctr: 2.9, conversions: 89 },
    { device: 'Tablet', users: 20, ctr: 3.2, conversions: 34 }
  ];

  const geographicData = [
    { region: 'North America', users: 48, ctr: 3.6, revenue: 125000 },
    { region: 'Europe', users: 28, ctr: 3.2, revenue: 78000 },
    { region: 'Asia Pacific', users: 24, ctr: 4.1, revenue: 52000 }
  ];

  const timeData = [
    { hour: '6 AM', impressions: 1200, ctr: 2.1 },
    { hour: '9 AM', impressions: 3400, ctr: 4.2 },
    { hour: '12 PM', impressions: 2800, ctr: 3.1 },
    { hour: '3 PM', impressions: 4200, ctr: 4.8 },
    { hour: '6 PM', impressions: 2100, ctr: 2.9 },
    { hour: '9 PM', impressions: 800, ctr: 1.8 }
  ];

  const expansionOpportunities = [
    {
      audience: 'VP of Data Science',
      similarity: 92,
      estimatedReach: 8400,
      expectedCTR: 4.1,
      reasoning: 'Similar technical background and decision-making authority'
    },
    {
      audience: 'Director of Engineering',
      similarity: 88,
      estimatedReach: 12300,
      expectedCTR: 3.8,
      reasoning: 'Overlapping interests in development tools and infrastructure'
    },
    {
      audience: 'Senior DevOps Engineer',
      similarity: 85,
      estimatedReach: 15600,
      expectedCTR: 3.6,
      reasoning: 'Strong affinity for automation and cloud technologies'
    }
  ];

  const availableCampaigns = [
    'Q4 Developer Persona - Cloud Solutions',
    'Enterprise CTO Outreach - AI Platform',
    'Mid-Market SaaS Leaders - Integration Tools',
    'Startup Founders - Growth Analytics'
  ];

  const topPerformingTitle = insights.job_titles.reduce((prev, current) => 
    prev.ctr > current.ctr ? prev : current
  );

  const bestCompanySize = insights.company_sizes.reduce((prev, current) => 
    prev.cost_per_conversion < current.cost_per_conversion ? prev : current
  );

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const handleCreateLookalike = (sourceName: string, similarity: number, reach: number) => {
    setLookalikeConfig({
      ...lookalikeConfig,
      sourceName,
      similarity,
      reach,
      name: `${sourceName} - Lookalike ${similarity}%`,
      description: `Lookalike audience based on ${sourceName} with ${similarity}% similarity`
    });
    setSelectedLookalikeType(`${sourceName}-${similarity}`);
    setShowLookalikeModal(true);
  };

  const handleSaveLookalike = async () => {
    setIsCreating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newLookalike: CreatedLookalike = {
      id: `lookalike_${Date.now()}`,
      name: lookalikeConfig.name,
      sourceName: lookalikeConfig.sourceName,
      similarity: lookalikeConfig.similarity,
      estimatedReach: lookalikeConfig.reach,
      status: 'creating',
      createdAt: new Date(),
      performance: {
        expectedCTR: 3.2 + (Math.random() * 1.5),
        confidence: 75 + (Math.random() * 20)
      }
    };
    
    setCreatedLookalikes(prev => [newLookalike, ...prev]);
    setIsCreating(false);
    setShowLookalikeModal(false);
    
    // Simulate status updates
    setTimeout(() => {
      setCreatedLookalikes(prev => 
        prev.map(lookalike => 
          lookalike.id === newLookalike.id 
            ? { ...lookalike, status: 'ready' }
            : lookalike
        )
      );
    }, 3000);
  };

  const getStatusColor = (status: CreatedLookalike['status']) => {
    switch (status) {
      case 'creating':
        return 'text-yellow-600 bg-yellow-100';
      case 'ready':
        return 'text-green-600 bg-green-100';
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: CreatedLookalike['status']) => {
    switch (status) {
      case 'creating':
        return <Clock className="w-4 h-4 animate-spin" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      case 'active':
        return <Zap className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Audience Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Audience Intelligence</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your <strong>{topPerformingTitle.title}</strong> audience shows exceptional 4.2% CTR. Consider expanding to 
              <strong> VP, Data Science</strong> (92% similarity match). Small companies (1-50 employees) demonstrate 
              the lowest cost-per-conversion at <strong>${bestCompanySize.cost_per_conversion.toFixed(0)}</strong>.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                3 expansion opportunities identified
              </span>
              <span className="flex items-center gap-1 text-blue-600">
                <Target className="w-4 h-4" />
                18% above industry benchmark
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart className="w-4 h-4" /> },
            { id: 'demographics', label: 'Demographics', icon: <Users className="w-4 h-4" /> },
            { id: 'behavior', label: 'Behavior', icon: <Clock className="w-4 h-4" /> },
            { id: 'expansion', label: 'Expansion', icon: <Target className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeView === tab.id
                  ? 'border-blue-600 text-blue-600'
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
          {/* Key Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Top Performer</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{topPerformingTitle.title}</p>
              <p className="text-sm text-gray-600">CTR: {topPerformingTitle.ctr.toFixed(2)}%</p>
              <div className="mt-3 flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Best engagement rate</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-teal-600" />
                <h3 className="font-semibold text-gray-900">Most Efficient</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{bestCompanySize.size}</p>
              <p className="text-sm text-gray-600">CPC: ${bestCompanySize.cost_per_conversion.toFixed(0)}</p>
              <div className="mt-3 flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Lowest cost</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Top Region</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">North America</p>
              <p className="text-sm text-gray-600">48% of audience</p>
              <div className="mt-3 flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Highest revenue</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="w-6 h-6 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Top Device</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">Desktop</p>
              <p className="text-sm text-gray-600">3.8% CTR</p>
              <div className="mt-3 flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Best conversion rate</span>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job Title Performance */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Job Title Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={insights.job_titles}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ctr" fill="#2563eb" name="CTR %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Audience Segments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Audience Segments</h3>
              <div className="space-y-4">
                {audienceSegments.map((segment, index) => (
                  <div key={segment.name} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{segment.name}</h4>
                      <span className="text-sm text-gray-600">{segment.size.toLocaleString()} users</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">CTR</p>
                        <p className="font-semibold text-gray-900">{segment.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">CPC</p>
                        <p className="font-semibold text-gray-900">${segment.cpc}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Growth</p>
                        <p className="font-semibold text-green-600">+{segment.growth}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'demographics' && (
        <div className="space-y-6">
          {/* Company Size Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Company Size Performance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.company_sizes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="size" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cost_per_conversion" fill="#059669" name="Cost per Conversion ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={geographicData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ region, users }) => `${region}: ${users}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="users"
                    >
                      {geographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Breakdown</h3>
              <div className="space-y-4">
                {deviceData.map((device, index) => (
                  <div key={device.device} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                      <span className="font-medium text-gray-900">{device.device}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{device.users}%</p>
                      <p className="text-sm text-gray-600">{device.ctr}% CTR</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'behavior' && (
        <div className="space-y-6">
          {/* Time-based Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance by Time of Day</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="ctr" stroke="#2563eb" strokeWidth={2} name="CTR %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Behavioral Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Peak Hours</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Best CTR</span>
                  <span className="font-semibold text-green-600">3 PM (4.8%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Highest Volume</span>
                  <span className="font-semibold text-blue-600">3 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lowest Cost</span>
                  <span className="font-semibold text-purple-600">9 AM</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Engagement Patterns</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Business Hours</span>
                  <span className="font-semibold text-green-600">+40% CTR</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Weekdays</span>
                  <span className="font-semibold text-blue-600">+25% Conv</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mobile Usage</span>
                  <span className="font-semibold text-purple-600">35% Share</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Optimization Tips</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                  <span className="text-gray-700">Increase budget 2-4 PM</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-gray-700">Target business hours</span>
                </div>
                <div className="flex items-start gap-2">
                  <Smartphone className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span className="text-gray-700">Optimize for mobile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'expansion' && (
        <div className="space-y-6">
          {/* Expansion Opportunities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">AI-Identified Expansion Opportunities</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export Recommendations
              </button>
            </div>
            
            <div className="space-y-4">
              {expansionOpportunities.map((opportunity, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{opportunity.audience}</h4>
                      <p className="text-gray-600 text-sm">{opportunity.reasoning}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-green-600">{opportunity.similarity}%</span>
                        <span className="text-sm text-gray-600">similarity</span>
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                        Add to Campaign
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-600 font-semibold">{opportunity.estimatedReach.toLocaleString()}</p>
                      <p className="text-gray-600">Estimated Reach</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-green-600 font-semibold">{opportunity.expectedCTR}%</p>
                      <p className="text-gray-600">Expected CTR</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-purple-600 font-semibold">+{Math.round((opportunity.expectedCTR / 3.2 - 1) * 100)}%</p>
                      <p className="text-gray-600">vs Current Avg</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Created Lookalike Audiences */}
          {createdLookalikes.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Lookalike Audiences</h3>
              <div className="space-y-4">
                {createdLookalikes.map((lookalike) => (
                  <div key={lookalike.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{lookalike.name}</h4>
                        <p className="text-sm text-gray-600">Source: {lookalike.sourceName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(lookalike.status)}`}>
                          {getStatusIcon(lookalike.status)}
                          {lookalike.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Similarity</p>
                        <p className="font-semibold text-green-600">{lookalike.similarity}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Reach</p>
                        <p className="font-semibold text-blue-600">{lookalike.estimatedReach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Expected CTR</p>
                        <p className="font-semibold text-purple-600">{lookalike.performance?.expectedCTR.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Confidence</p>
                        <p className="font-semibold text-orange-600">{lookalike.performance?.confidence.toFixed(0)}%</p>
                      </div>
                    </div>
                    {lookalike.status === 'ready' && (
                      <div className="mt-3 flex gap-2">
                        <button 
                          onClick={() => {
                            setCreatedLookalikes(prev => 
                              prev.map(l => 
                                l.id === lookalike.id 
                                  ? { ...l, status: 'active' }
                                  : l
                              )
                            );
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Activate
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                          Add to Campaign
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lookalike Audiences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Lookalike Audience Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Software Engineers - Lookalike 1%', similarity: 95, reach: 45000, performance: '90-95%' },
                { name: 'Software Engineers - Lookalike 3%', similarity: 85, reach: 135000, performance: '75-85%' },
                { name: 'Software Engineers - Lookalike 5%', similarity: 75, reach: 225000, performance: '65-75%' }
              ].map((lookalike, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">{lookalike.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Similarity:</span>
                      <span className="font-semibold text-green-600">{lookalike.similarity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reach:</span>
                      <span className="font-semibold text-blue-600">{lookalike.reach.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected:</span>
                      <span className="font-semibold text-purple-600">{lookalike.performance}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCreateLookalike('Software Engineers', lookalike.similarity, lookalike.reach)}
                    className="w-full mt-4 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Create Lookalike
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lookalike Creation Modal */}
      {showLookalikeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create Lookalike Audience</h2>
              <button
                onClick={() => setShowLookalikeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              {/* Basic Configuration */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Audience Name</label>
                    <input
                      type="text"
                      value={lookalikeConfig.name}
                      onChange={(e) => setLookalikeConfig(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter a name for your lookalike audience"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={lookalikeConfig.description}
                      onChange={(e) => setLookalikeConfig(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describe your lookalike audience"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Similarity ({lookalikeConfig.similarity}%)
                      </label>
                      <input
                        type="range"
                        min="70"
                        max="99"
                        value={lookalikeConfig.similarity}
                        onChange={(e) => setLookalikeConfig(prev => ({ ...prev, similarity: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Less Similar</span>
                        <span>More Similar</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Reach</label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">
                          {lookalikeConfig.reach.toLocaleString()} people
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Campaigns</h3>
                <div className="space-y-2">
                  {availableCampaigns.map((campaign) => (
                    <label key={campaign} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={lookalikeConfig.targetCampaigns.includes(campaign)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLookalikeConfig(prev => ({ 
                              ...prev, 
                              targetCampaigns: [...prev.targetCampaigns, campaign] 
                            }));
                          } else {
                            setLookalikeConfig(prev => ({ 
                              ...prev, 
                              targetCampaigns: prev.targetCampaigns.filter(c => c !== campaign) 
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                      />
                      <span className="text-sm text-gray-900">{campaign}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Reach</label>
                    <input
                      type="number"
                      value={lookalikeConfig.advancedSettings.minimumReach}
                      onChange={(e) => setLookalikeConfig(prev => ({ 
                        ...prev, 
                        advancedSettings: { 
                          ...prev.advancedSettings, 
                          minimumReach: parseInt(e.target.value) 
                        } 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Reach</label>
                    <input
                      type="number"
                      value={lookalikeConfig.advancedSettings.maximumReach}
                      onChange={(e) => setLookalikeConfig(prev => ({ 
                        ...prev, 
                        advancedSettings: { 
                          ...prev.advancedSettings, 
                          maximumReach: parseInt(e.target.value) 
                        } 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Preview</h4>
                <div className="text-sm text-blue-800">
                  <p><strong>Source:</strong> {lookalikeConfig.sourceName}</p>
                  <p><strong>Expected Performance:</strong> {Math.round(70 + lookalikeConfig.similarity * 0.3)}% of source audience performance</p>
                  <p><strong>Confidence Level:</strong> {Math.round(60 + lookalikeConfig.similarity * 0.4)}%</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-600">
                LinkedIn will process this audience within 6-24 hours
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLookalikeModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLookalike}
                  disabled={isCreating || !lookalikeConfig.name.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Lookalike
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}