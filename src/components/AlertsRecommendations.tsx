import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, ArrowRight, X, TrendingUp, TrendingDown, DollarSign, Users, Target, Filter, Download, Bell, BellOff, Calendar, BarChart3 } from 'lucide-react';
import { Alert } from '../types';

interface AlertsRecommendationsProps {
  alerts: Alert[];
}

interface AlertFilter {
  type: 'all' | 'performance_drop' | 'budget_warning' | 'opportunity' | 'optimization';
  priority: 'all' | 'high' | 'medium' | 'low';
  status: 'all' | 'read' | 'unread';
  timeframe: '24h' | '7d' | '30d' | 'all';
}

interface ActionHistory {
  id: string;
  alertId: string;
  action: 'accepted' | 'dismissed' | 'implemented';
  timestamp: Date;
  details: string;
  impact?: {
    metric: string;
    before: number;
    after: number;
    improvement: number;
  };
}

export function AlertsRecommendations({ alerts }: AlertsRecommendationsProps) {
  const [alertList, setAlertList] = useState(alerts);
  const [filter, setFilter] = useState<AlertFilter>({
    type: 'all',
    priority: 'all', 
    status: 'all',
    timeframe: '7d'
  });
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([
    {
      id: 'hist_001',
      alertId: 'alert_004',
      action: 'implemented',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      details: 'Added VP, Data Science to Enterprise CTO targeting',
      impact: {
        metric: 'CTR',
        before: 3.4,
        after: 4.1,
        improvement: 20.6
      }
    },
    {
      id: 'hist_002',
      alertId: 'alert_003',
      action: 'accepted',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      details: 'Increased Startup Founders budget by 50%',
      impact: {
        metric: 'Conversions',
        before: 45,
        after: 67,
        improvement: 48.9
      }
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance_drop':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'budget_warning':
        return <DollarSign className="w-5 h-5 text-yellow-600" />;
      case 'opportunity':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'optimization':
        return <Target className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'implemented':
        return 'text-green-600 bg-green-100';
      case 'accepted':
        return 'text-blue-600 bg-blue-100';
      case 'dismissed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAccept = (alertId: string) => {
    const alert = alertList.find(a => a.id === alertId);
    if (alert) {
      setActionHistory(prev => [{
        id: `hist_${Date.now()}`,
        alertId,
        action: 'accepted',
        timestamp: new Date(),
        details: `Accepted recommendation: ${alert.recommendation}`
      }, ...prev]);
      
      setAlertList(prev => prev.filter(alert => alert.id !== alertId));
    }
  };

  const handleDismiss = (alertId: string) => {
    const alert = alertList.find(a => a.id === alertId);
    if (alert) {
      setActionHistory(prev => [{
        id: `hist_${Date.now()}`,
        alertId,
        action: 'dismissed',
        timestamp: new Date(),
        details: `Dismissed alert: ${alert.title}`
      }, ...prev]);
      
      setAlertList(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'read' as const }
            : alert
        )
      );
    }
  };

  const handleBulkAction = (action: 'accept' | 'dismiss') => {
    selectedAlerts.forEach(alertId => {
      if (action === 'accept') {
        handleAccept(alertId);
      } else {
        handleDismiss(alertId);
      }
    });
    setSelectedAlerts([]);
  };

  const filteredAlerts = alertList.filter(alert => {
    if (filter.type !== 'all' && alert.type !== filter.type) return false;
    if (filter.priority !== 'all' && alert.priority !== filter.priority) return false;
    if (filter.status !== 'all' && alert.status !== filter.status) return false;
    
    if (filter.timeframe !== 'all') {
      const alertDate = new Date(alert.timestamp);
      const now = new Date();
      const timeDiff = now.getTime() - alertDate.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      
      switch (filter.timeframe) {
        case '24h':
          if (daysDiff > 1) return false;
          break;
        case '7d':
          if (daysDiff > 7) return false;
          break;
        case '30d':
          if (daysDiff > 30) return false;
          break;
      }
    }
    
    return true;
  });

  const unreadCount = filteredAlerts.filter(alert => alert.status === 'unread').length;
  const highPriorityCount = filteredAlerts.filter(alert => alert.priority === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header with Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Smart Alerts & Recommendations</h2>
            <p className="text-gray-700">
              {unreadCount} new recommendations • {highPriorityCount} high priority items require attention
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
              <p className="text-xs text-gray-600">New Alerts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{actionHistory.length}</p>
              <p className="text-xs text-gray-600">Implemented</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                +{actionHistory.filter(h => h.impact).reduce((sum, h) => sum + (h.impact?.improvement || 0), 0).toFixed(0)}%
              </p>
              <p className="text-xs text-gray-600">Avg Improvement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Alert Management</h3>
            {selectedAlerts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{selectedAlerts.length} selected</span>
                <button
                  onClick={() => handleBulkAction('accept')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={() => handleBulkAction('dismiss')}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Dismiss All
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                showFilters ? 'bg-gray-50' : ''
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Bell className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filter.type}
                onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="performance_drop">Performance Drop</option>
                <option value="budget_warning">Budget Warning</option>
                <option value="opportunity">Opportunity</option>
                <option value="optimization">Optimization</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={filter.priority}
                onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
              <select
                value={filter.timeframe}
                onChange={(e) => setFilter(prev => ({ ...prev, timeframe: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        )}

        {/* Alert Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {[
            { type: 'performance_drop', label: 'Performance', count: filteredAlerts.filter(a => a.type === 'performance_drop').length, color: 'text-red-600', icon: TrendingDown },
            { type: 'budget_warning', label: 'Budget', count: filteredAlerts.filter(a => a.type === 'budget_warning').length, color: 'text-yellow-600', icon: DollarSign },
            { type: 'opportunity', label: 'Opportunities', count: filteredAlerts.filter(a => a.type === 'opportunity').length, color: 'text-green-600', icon: TrendingUp },
            { type: 'optimization', label: 'Optimizations', count: filteredAlerts.filter(a => a.type === 'optimization').length, color: 'text-blue-600', icon: Target }
          ].map((category) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={category.type} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setFilter(prev => ({ ...prev, type: category.type as any }))}
              >
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className={`w-6 h-6 ${category.color}`} />
                </div>
                <div className={`text-2xl font-bold ${category.color} mb-1`}>
                  {category.count}
                </div>
                <div className="text-sm text-gray-600">{category.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
            alert.status === 'unread' ? 'ring-2 ring-blue-100' : ''
          }`}>
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedAlerts.includes(alert.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAlerts(prev => [...prev, alert.id]);
                    } else {
                      setSelectedAlerts(prev => prev.filter(id => id !== alert.id));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(alert.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(alert.priority)}`}>
                        {alert.priority} priority
                      </span>
                      {alert.status === 'unread' && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.campaign}</p>
                    <p className="text-gray-700 leading-relaxed mb-4">{alert.message}</p>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </div>
                </div>

                {/* Recommendation Box */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">Recommended Action:</p>
                      <p className="text-sm text-gray-700">{alert.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleAccept(alert.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept & Apply
                  </button>
                  <button 
                    onClick={() => handleDismiss(alert.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    Dismiss
                  </button>
                  <button className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Action History & Impact</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {actionHistory.slice(0, 10).map((entry) => (
            <div key={entry.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  entry.action === 'implemented' ? 'bg-green-100' : 
                  entry.action === 'accepted' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {entry.action === 'implemented' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : entry.action === 'accepted' ? (
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{entry.details}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${getActionColor(entry.action)}`}>
                      {entry.action}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    {entry.timestamp.toLocaleString()}
                  </p>
                  
                  {entry.impact && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-900">Performance Impact</p>
                          <p className="text-xs text-green-700">
                            {entry.impact.metric}: {entry.impact.before} → {entry.impact.after}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">+{entry.impact.improvement.toFixed(1)}%</p>
                          <p className="text-xs text-green-700">improvement</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => {
              const highPriorityAlerts = filteredAlerts.filter(a => a.priority === 'high' && a.status === 'unread');
              highPriorityAlerts.forEach(alert => handleAccept(alert.id));
            }}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Accept All High Priority</p>
              <p className="text-sm text-gray-600">{highPriorityCount} recommendations</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Schedule Review</p>
              <p className="text-sm text-gray-600">Set weekly check-ins</p>
            </div>
          </button>
          <button 
            onClick={() => {
              setAlertList(prev => prev.map(alert => ({ ...alert, status: 'read' as const })));
            }}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <BellOff className="w-5 h-5 text-gray-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Mark All Read</p>
              <p className="text-sm text-gray-600">Clear notifications</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}