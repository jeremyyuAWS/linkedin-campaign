import React, { useState } from 'react';
import { MetricCard } from './MetricCard';
import { CampaignDetailsModal } from './CampaignDetailsModal';
import { AlertTriangle, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { Campaign } from '../types';

interface BudgetMonitorProps {
  campaigns: Campaign[];
}

export function BudgetMonitor({ campaigns }: BudgetMonitorProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const getBudgetStatus = (campaign: Campaign) => {
    const spentPercentage = (campaign.budget.spent / campaign.budget.total) * 100;
    if (spentPercentage >= 90) return 'critical';
    if (spentPercentage >= 75) return 'warning';
    return 'healthy';
  };

  const getForecastDays = (campaign: Campaign) => {
    const dailySpend = campaign.last_7_days.spend / 7;
    if (dailySpend === 0) return Infinity;
    return Math.floor(campaign.budget.remaining / dailySpend);
  };

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget.total, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.budget.spent, 0);
  const totalRemaining = campaigns.reduce((sum, campaign) => sum + campaign.budget.remaining, 0);

  return (
    <div className="space-y-6">
      {/* AI Forecast */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Budget Forecast Alert</h3>
            <p className="text-gray-700 leading-relaxed">
              At the current burn rate, the Q4 Developer Persona campaign will exceed its budget 5 days early. 
              Consider adjusting daily spend limits or pausing underperforming ads to maintain budget control.
            </p>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Budget"
          value={totalBudget}
          prefix="$"
          className="border-l-4 border-l-blue-500"
        />
        <MetricCard
          title="Total Spent"
          value={totalSpent}
          prefix="$"
          change={-12.3}
          trend="down"
          className="border-l-4 border-l-orange-500"
        />
        <MetricCard
          title="Remaining Budget"
          value={totalRemaining}
          prefix="$"
          className="border-l-4 border-l-green-500"
        />
      </div>

      {/* Campaign Budget Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign) => {
          const spentPercentage = (campaign.budget.spent / campaign.budget.total) * 100;
          const status = getBudgetStatus(campaign);
          const forecastDays = getForecastDays(campaign);
          const dailySpend = campaign.last_7_days.spend / 7;

          return (
            <div 
              key={campaign.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
              onClick={() => setSelectedCampaign(campaign)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {campaign.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    status === 'critical' 
                      ? 'bg-red-100 text-red-800'
                      : status === 'warning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {spentPercentage.toFixed(1)}% spent
                  </span>
                  <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>

              {/* Budget Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>${campaign.budget.spent.toLocaleString()} spent</span>
                  <span>${campaign.budget.total.toLocaleString()} total</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      status === 'critical' 
                        ? 'bg-red-500'
                        : status === 'warning'
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Budget Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Daily Spend</p>
                  <p className="text-lg font-bold text-gray-900">${dailySpend.toFixed(0)}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Days Remaining</p>
                  <p className="text-lg font-bold text-gray-900">
                    {forecastDays === Infinity ? '∞' : forecastDays}
                  </p>
                </div>
              </div>

              {/* Status Message */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  {status === 'critical' && 'Budget critically low. Consider immediate action.'}
                  {status === 'warning' && 'Budget approaching limit. Monitor closely.'}
                  {status === 'healthy' && 'Budget on track. Spending within normal range.'}
                </p>
              </div>

              {/* Click hint */}
              <div className="mt-3 text-center">
                <span className="text-xs text-blue-600 group-hover:text-blue-800 font-medium">
                  Click for detailed insights & recommendations
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <CampaignDetailsModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
}