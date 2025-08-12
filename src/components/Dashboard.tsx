import React from 'react';
import { MetricCard } from './MetricCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Campaign } from '../types';

interface DashboardProps {
  campaigns: Campaign[];
}

export function Dashboard({ campaigns }: DashboardProps) {
  const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.metrics.spend, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.metrics.conversions, 0);
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.metrics.clicks, 0);
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.metrics.impressions, 0);
  const avgCTR = totalClicks / totalImpressions * 100;

  const campaignData = campaigns.map(campaign => ({
    name: campaign.name.split(' - ')[0],
    spend: campaign.metrics.spend,
    conversions: campaign.metrics.conversions,
    ctr: campaign.metrics.ctr
  }));

  const trendData = [
    { day: 'Mon', impressions: 45000, clicks: 1800, spend: 3200 },
    { day: 'Tue', impressions: 52000, clicks: 2100, spend: 3600 },
    { day: 'Wed', impressions: 48000, clicks: 1950, spend: 3400 },
    { day: 'Thu', impressions: 55000, clicks: 2200, spend: 3800 },
    { day: 'Fri', impressions: 51000, clicks: 2050, spend: 3500 },
    { day: 'Sat', impressions: 38000, clicks: 1520, spend: 2900 },
    { day: 'Sun', impressions: 42000, clicks: 1680, spend: 3100 }
  ];

  return (
    <div className="space-y-6">
      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Weekly Performance Summary</h3>
            <p className="text-gray-700 leading-relaxed">
              CTR for the Q4 Developer Persona campaign dropped 24% in the last 7 days, while Enterprise CTO Outreach shows strong momentum with 3.68% CTR. 
              Consider reallocating budget from underperforming campaigns to high-performers like Startup Founders (4.05% CTR).
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Spend"
          value={totalSpend}
          prefix="$"
          change={-8.2}
          trend="down"
        />
        <MetricCard
          title="Conversions"
          value={totalConversions}
          change={12.5}
          trend="up"
        />
        <MetricCard
          title="Average CTR"
          value={avgCTR.toFixed(2)}
          suffix="%"
          change={-5.1}
          trend="down"
        />
        <MetricCard
          title="Active Campaigns"
          value={campaigns.filter(c => c.status === 'active').length}
          change={0}
          trend="neutral"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="conversions" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 7-Day Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="clicks" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign Status Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Campaign Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      campaign.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${campaign.metrics.spend.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.metrics.ctr.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.metrics.conversions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      campaign.trend === 'strong' || campaign.trend === 'improving'
                        ? 'bg-green-100 text-green-800'
                        : campaign.trend === 'declining' || campaign.trend === 'poor'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}