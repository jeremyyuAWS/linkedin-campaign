import React, { useState, useEffect } from 'react';
import { Bell, BellRing, X, CheckCircle, AlertTriangle, TrendingDown, DollarSign, Users, Settings, Filter, Minus, Maximize2 } from 'lucide-react';

interface RealTimeAlert {
  id: string;
  type: 'performance' | 'budget' | 'anomaly' | 'opportunity';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  campaignId?: string;
  metric?: string;
  value?: number;
  threshold?: number;
  autoAction?: string;
}

interface AlertSettings {
  performance: {
    ctrDrop: { enabled: boolean; threshold: number; timeframe: number };
    spendSpike: { enabled: boolean; threshold: number; timeframe: number };
    conversionDrop: { enabled: boolean; threshold: number; timeframe: number };
  };
  budget: {
    utilization: { enabled: boolean; threshold: number };
    burnRate: { enabled: boolean; threshold: number };
    remaining: { enabled: boolean; threshold: number };
  };
  anomaly: {
    enabled: boolean;
    sensitivity: 'low' | 'medium' | 'high';
  };
}

export function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    // Load minimized state from localStorage
    const saved = localStorage.getItem('alerts_minimized');
    return saved ? JSON.parse(saved) : false;
  });
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    performance: {
      ctrDrop: { enabled: true, threshold: 20, timeframe: 24 },
      spendSpike: { enabled: true, threshold: 50, timeframe: 6 },
      conversionDrop: { enabled: true, threshold: 30, timeframe: 48 }
    },
    budget: {
      utilization: { enabled: true, threshold: 90 },
      burnRate: { enabled: true, threshold: 150 },
      remaining: { enabled: true, threshold: 500 }
    },
    anomaly: {
      enabled: true,
      sensitivity: 'medium'
    }
  });
  const [notifications, setNotifications] = useState<boolean>(false);

  useEffect(() => {
    // Check for notification permission
    if ('Notification' in window) {
      setNotifications(Notification.permission === 'granted');
    }

    // Simulate real-time alerts
    const alertInterval = setInterval(() => {
      generateRandomAlert();
    }, 30000); // Every 30 seconds

    // Generate initial alerts
    generateInitialAlerts();

    return () => clearInterval(alertInterval);
  }, []);

  // Save minimized state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('alerts_minimized', JSON.stringify(isMinimized));
  }, [isMinimized]);

  const generateInitialAlerts = () => {
    const initialAlerts: RealTimeAlert[] = [
      {
        id: 'alert_rt_001',
        type: 'performance',
        severity: 'critical',
        title: 'CTR Dropped 28% in Last Hour',
        message: 'Q4 Developer Persona campaign CTR fell from 2.8% to 2.0% in the past hour',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        campaignId: 'camp_001',
        metric: 'CTR',
        value: 2.0,
        threshold: 2.2
      },
      {
        id: 'alert_rt_002',
        type: 'budget',
        severity: 'warning',
        title: 'High Burn Rate Detected',
        message: 'Enterprise CTO campaign spending 180% above normal rate',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        campaignId: 'camp_002',
        metric: 'Daily Spend',
        value: 1800,
        threshold: 1000
      },
      {
        id: 'alert_rt_003',
        type: 'opportunity',
        severity: 'info',
        title: 'Audience Surge Detected',
        message: 'Startup Founders segment showing 40% higher engagement than usual',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        campaignId: 'camp_004',
        metric: 'Engagement',
        value: 4.2,
        autoAction: 'Increased budget by 25%'
      }
    ];

    setAlerts(initialAlerts);
  };

  const generateRandomAlert = () => {
    const alertTypes: Array<{ type: RealTimeAlert['type']; severity: RealTimeAlert['severity']; scenarios: Array<{ title: string; message: string }> }> = [
      {
        type: 'performance',
        severity: 'warning',
        scenarios: [
          {
            title: 'CPC Increase Detected',
            message: 'Average CPC increased 15% in the last 2 hours'
          },
          {
            title: 'Impression Volume Drop',
            message: 'Impressions down 22% compared to same time yesterday'
          }
        ]
      },
      {
        type: 'anomaly',
        severity: 'info',
        scenarios: [
          {
            title: 'Unusual Traffic Pattern',
            message: 'Higher than expected mobile traffic from enterprise segment'
          },
          {
            title: 'Geographic Anomaly',
            message: 'Spike in engagement from European markets during US hours'
          }
        ]
      },
      {
        type: 'opportunity',
        severity: 'info',
        scenarios: [
          {
            title: 'Creative Performance Surge',
            message: 'New headline variant showing 35% higher CTR than control'
          },
          {
            title: 'Time-based Opportunity',
            message: 'Current hour showing peak conversion rates - consider increasing bids'
          }
        ]
      }
    ];

    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const randomScenario = randomType.scenarios[Math.floor(Math.random() * randomType.scenarios.length)];

    const newAlert: RealTimeAlert = {
      id: `alert_rt_${Date.now()}`,
      type: randomType.type,
      severity: randomType.severity,
      title: randomScenario.title,
      message: randomScenario.message,
      timestamp: new Date(),
      campaignId: `camp_00${Math.floor(Math.random() * 4) + 1}`
    };

    setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep only 10 most recent

    // Show browser notification if enabled
    if (notifications && randomType.severity === 'critical') {
      showBrowserNotification(newAlert);
    }
  };

  const showBrowserNotification = (alert: RealTimeAlert) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`LinkedIn Ads Alert: ${alert.title}`, {
        body: alert.message,
        icon: '/favicon.ico',
        tag: alert.id
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotifications(permission === 'granted');
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getSeverityColor = (severity: RealTimeAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50 text-red-900';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 text-yellow-900';
      case 'info':
        return 'border-blue-500 bg-blue-50 text-blue-900';
      default:
        return 'border-gray-500 bg-gray-50 text-gray-900';
    }
  };

  const getTypeIcon = (type: RealTimeAlert['type']) => {
    switch (type) {
      case 'performance':
        return <TrendingDown className="w-5 h-5" />;
      case 'budget':
        return <DollarSign className="w-5 h-5" />;
      case 'anomaly':
        return <AlertTriangle className="w-5 h-5" />;
      case 'opportunity':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical').length;
  const unreadAlertsCount = alerts.length;

  // Minimized view
  if (isMinimized) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <BellRing className="w-5 h-5 text-blue-600" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadAlertsCount > 9 ? '9+' : unreadAlertsCount}
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {unreadAlertsCount} alerts
            </span>
            {criticalAlertsCount > 0 && (
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            )}
          </div>
        </button>
      </div>
    );
  }

  // Full expanded view
  return (
    <div className="fixed top-4 right-4 w-96 z-50">
      {/* Alert Header */}
      <div className="bg-white rounded-t-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Real-Time Alerts</h3>
            {criticalAlertsCount > 0 && (
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Minimize"
            >
              <Minus className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setAlerts([])}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Alert Settings Panel */}
      {showSettings && (
        <div className="bg-white border-x border-gray-200 p-4 max-h-80 overflow-y-auto">
          <h4 className="font-medium text-gray-900 mb-3">Alert Settings</h4>
          
          {/* Notification Permission */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Browser Notifications</span>
              {!notifications ? (
                <button
                  onClick={requestNotificationPermission}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  Enable
                </button>
              ) : (
                <span className="text-xs text-green-600">Enabled</span>
              )}
            </div>
          </div>

          {/* Performance Alerts */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-800 mb-2">Performance Alerts</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">CTR Drop</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={alertSettings.performance.ctrDrop.threshold}
                    onChange={(e) => setAlertSettings(prev => ({
                      ...prev,
                      performance: {
                        ...prev.performance,
                        ctrDrop: { ...prev.performance.ctrDrop, threshold: parseInt(e.target.value) }
                      }
                    }))}
                    className="w-12 px-1 py-0.5 border border-gray-300 rounded text-xs"
                  />
                  <span className="text-xs text-gray-600">%</span>
                  <input
                    type="checkbox"
                    checked={alertSettings.performance.ctrDrop.enabled}
                    onChange={(e) => setAlertSettings(prev => ({
                      ...prev,
                      performance: {
                        ...prev.performance,
                        ctrDrop: { ...prev.performance.ctrDrop, enabled: e.target.checked }
                      }
                    }))}
                    className="rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Alerts */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-800 mb-2">Budget Alerts</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Utilization</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={alertSettings.budget.utilization.threshold}
                    onChange={(e) => setAlertSettings(prev => ({
                      ...prev,
                      budget: {
                        ...prev.budget,
                        utilization: { ...prev.budget.utilization, threshold: parseInt(e.target.value) }
                      }
                    }))}
                    className="w-12 px-1 py-0.5 border border-gray-300 rounded text-xs"
                  />
                  <span className="text-xs text-gray-600">%</span>
                  <input
                    type="checkbox"
                    checked={alertSettings.budget.utilization.enabled}
                    onChange={(e) => setAlertSettings(prev => ({
                      ...prev,
                      budget: {
                        ...prev.budget,
                        utilization: { ...prev.budget.utilization, enabled: e.target.checked }
                      }
                    }))}
                    className="rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Anomaly Detection */}
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Anomaly Detection</h5>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Sensitivity</label>
              <select
                value={alertSettings.anomaly.sensitivity}
                onChange={(e) => setAlertSettings(prev => ({
                  ...prev,
                  anomaly: { ...prev.anomaly, sensitivity: e.target.value as any }
                }))}
                className="px-2 py-1 border border-gray-300 rounded text-xs"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Alert List */}
      <div className="bg-white rounded-b-lg shadow-lg border-x border-b border-gray-200 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No alerts at this time</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 border-l-4 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1">{alert.title}</h4>
                      <p className="text-sm opacity-90 mb-2">{alert.message}</p>
                      {alert.autoAction && (
                        <div className="bg-green-100 border border-green-300 rounded px-2 py-1 mb-2">
                          <p className="text-xs text-green-800">Auto-action: {alert.autoAction}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs opacity-75">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                        {alert.campaignId && (
                          <span className="text-xs bg-white bg-opacity-50 px-2 py-0.5 rounded">
                            {alert.campaignId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="flex-shrink-0 p-1 hover:bg-white hover:bg-opacity-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}