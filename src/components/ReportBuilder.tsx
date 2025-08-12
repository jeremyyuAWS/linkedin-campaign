import React, { useState } from 'react';
import { Download, Send, FileText, Calendar, Mail, Slack } from 'lucide-react';
import { Campaign } from '../types';

interface ReportBuilderProps {
  campaigns: Campaign[];
}

export function ReportBuilder({ campaigns }: ReportBuilderProps) {
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(campaigns.map(c => c.id));
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const totalMetrics = campaigns
    .filter(c => selectedCampaigns.includes(c.id))
    .reduce((acc, campaign) => ({
      spend: acc.spend + campaign.metrics.spend,
      conversions: acc.conversions + campaign.metrics.conversions,
      clicks: acc.clicks + campaign.metrics.clicks,
      impressions: acc.impressions + campaign.metrics.impressions
    }), { spend: 0, conversions: 0, clicks: 0, impressions: 0 });

  const avgCTR = totalMetrics.clicks / totalMetrics.impressions * 100;
  const avgCPC = totalMetrics.spend / totalMetrics.clicks;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Campaign Report Builder</h2>
            <p className="text-gray-600">Generate comprehensive performance reports in one click</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-1 space-y-6">
          {/* Report Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Report Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="weekly"
                      checked={reportType === 'weekly'}
                      onChange={(e) => setReportType(e.target.value as 'weekly')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-900">Weekly Performance</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="monthly"
                      checked={reportType === 'monthly'}
                      onChange={(e) => setReportType(e.target.value as 'monthly')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-900">Monthly Summary</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Campaigns</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {campaigns.map((campaign) => (
                    <label key={campaign.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.includes(campaign.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCampaigns(prev => [...prev, campaign.id]);
                          } else {
                            setSelectedCampaigns(prev => prev.filter(id => id !== campaign.id));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-900 truncate">{campaign.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Export & Share</h3>
            <div className="space-y-3">
              <button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Mail className="w-4 h-4" />
                Email Report
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Slack className="w-4 h-4" />
                Share to Slack
              </button>
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Report Preview</h3>
            </div>

            {/* Executive Summary */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h4>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Campaign Performance Overview - {reportType === 'weekly' ? 'Week' : 'Month'} Ending {new Date().toLocaleDateString()}</strong>
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Your LinkedIn advertising campaigns generated <strong>{totalMetrics.conversions} conversions</strong> from 
                  <strong> ${totalMetrics.spend.toLocaleString()}</strong> in ad spend across {selectedCampaigns.length} active campaigns. 
                  The overall CTR of <strong>{avgCTR.toFixed(2)}%</strong> exceeds industry benchmarks by 18%, 
                  with the Enterprise CTO Outreach campaign leading performance metrics. Budget utilization remains healthy 
                  across most campaigns, though immediate attention is recommended for the Mid-Market SaaS campaign 
                  which has reached 95% of allocated budget.
                </p>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Metrics</h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">${totalMetrics.spend.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Spend</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{totalMetrics.conversions}</p>
                  <p className="text-sm text-gray-600">Conversions</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-600">{avgCTR.toFixed(2)}%</p>
                  <p className="text-sm text-gray-600">Average CTR</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-orange-600">${avgCPC.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Average CPC</p>
                </div>
              </div>
            </div>

            {/* Campaign Breakdown */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance Breakdown</h4>
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spend</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conv.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaigns
                      .filter(c => selectedCampaigns.includes(c.id))
                      .map((campaign) => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {campaign.name}
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

            {/* AI Recommendations */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Recommendations</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>Budget Reallocation:</strong> Consider moving budget from Q4 Developer Persona (declining CTR) 
                    to Startup Founders campaign (4.05% CTR, strong momentum).
                  </p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>Creative Refresh:</strong> Headlines with "AI-Powered" show 34% higher engagement. 
                    Test similar messaging across underperforming campaigns.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>Audience Expansion:</strong> Add "VP, Data Science" targeting to Enterprise CTO campaign 
                    based on similar role performance analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}