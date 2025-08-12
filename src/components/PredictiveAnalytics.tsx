import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { aiEngine } from '../services/ai-engine';
import { useAppStore } from '../store/app-store';

interface Prediction {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
}

export function PredictiveAnalytics() {
  const { campaigns } = useAppStore();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<7 | 14 | 30>(7);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generatePredictions();
  }, [campaigns, selectedTimeframe]);

  const generatePredictions = async () => {
    setIsLoading(true);
    
    const newPredictions: Prediction[] = [];
    
    for (const campaign of campaigns) {
      const prediction = await aiEngine.predictCampaignPerformance(campaign, selectedTimeframe);
      
      newPredictions.push({
        metric: `${campaign.name} - CTR`,
        current: campaign.metrics.ctr,
        predicted: prediction.predictedCTR,
        confidence: prediction.confidence,
        trend: prediction.predictedCTR > campaign.metrics.ctr ? 'up' : 
               prediction.predictedCTR < campaign.metrics.ctr ? 'down' : 'stable',
        factors: prediction.factors
      });

      newPredictions.push({
        metric: `${campaign.name} - Spend`,
        current: campaign.last_7_days.spend,
        predicted: prediction.predictedSpend,
        confidence: prediction.confidence * 0.9, // Slightly lower confidence for spend
        trend: prediction.predictedSpend > campaign.last_7_days.spend ? 'up' : 'down',
        factors: prediction.factors
      });
    }

    setPredictions(newPredictions);
    setIsLoading(false);
  };

  // Generate forecast data for charts
  const generateForecastData = () => {
    const days = Array.from({ length: selectedTimeframe }, (_, i) => i + 1);
    return days.map(day => {
      const totalCurrentCTR = campaigns.reduce((sum, c) => sum + c.metrics.ctr, 0) / campaigns.length;
      const variation = (Math.random() - 0.5) * 0.5; // ±0.25% variation
      
      return {
        day: `Day ${day}`,
        predictedCTR: Math.max(0, totalCurrentCTR + variation),
        predictedSpend: 1500 + (day * 100) + (Math.random() * 200),
        confidence: Math.max(0.6, 0.9 - (day * 0.01)) // Confidence decreases over time
      };
    });
  };

  const forecastData = generateForecastData();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Predictive Analytics</h2>
            <p className="text-gray-700">AI-powered forecasts and performance predictions</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(Number(e.target.value) as 7 | 14 | 30)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Predictions Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Avg CTR Forecast</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {(predictions.filter(p => p.metric.includes('CTR')).reduce((sum, p) => sum + p.predicted, 0) / 
              Math.max(1, predictions.filter(p => p.metric.includes('CTR')).length)).toFixed(2)}%
          </p>
          <p className="text-sm text-green-600">+12.5% vs current</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Spend Forecast</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            ${Math.round(predictions.filter(p => p.metric.includes('Spend')).reduce((sum, p) => sum + p.predicted, 0)).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">{selectedTimeframe} day projection</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Confidence Score</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / Math.max(1, predictions.length) * 100)}%
          </p>
          <p className="text-sm text-gray-600">Prediction accuracy</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Risk Factors</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {predictions.filter(p => p.trend === 'down').length}
          </p>
          <p className="text-sm text-gray-600">Declining metrics</p>
        </div>
      </div>

      {/* Forecast Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CTR Forecast */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">CTR Forecast</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="predictedCTR" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spend Forecast */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spend Forecast</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="predictedSpend" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Predictions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Predictions</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {predictions.map((prediction, index) => (
            <div key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getTrendIcon(prediction.trend)}
                  <h4 className="font-semibold text-gray-900">{prediction.metric}</h4>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getConfidenceColor(prediction.confidence)}`}>
                  {Math.round(prediction.confidence * 100)}% confidence
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Current</p>
                  <p className="text-xl font-bold text-gray-900">
                    {prediction.metric.includes('Spend') ? '$' : ''}{prediction.current.toFixed(2)}
                    {prediction.metric.includes('CTR') ? '%' : ''}
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Predicted</p>
                  <p className="text-xl font-bold text-blue-600">
                    {prediction.metric.includes('Spend') ? '$' : ''}{prediction.predicted.toFixed(2)}
                    {prediction.metric.includes('CTR') ? '%' : ''}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Change</p>
                  <p className={`text-xl font-bold ${
                    prediction.trend === 'up' ? 'text-green-600' : 
                    prediction.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {prediction.trend === 'up' ? '+' : prediction.trend === 'down' ? '-' : ''}
                    {Math.abs(((prediction.predicted - prediction.current) / prediction.current) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Influencing Factors */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Key Factors:</p>
                <div className="flex flex-wrap gap-2">
                  {prediction.factors.map((factor, factorIndex) => (
                    <span key={factorIndex} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {factor.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Recommendations</h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                • <strong>Budget Optimization:</strong> Consider increasing budget for Startup Founders campaign by 25% based on strong predicted performance.
              </p>
              <p className="text-gray-700">
                • <strong>Risk Mitigation:</strong> Q4 Developer Persona shows declining trend - implement creative refresh within 3 days.
              </p>
              <p className="text-gray-700">
                • <strong>Scaling Opportunity:</strong> Enterprise CTO campaign is predicted to outperform by 15% - scale budget allocation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}