import React, { useState } from 'react';
import { Play, Pause, Plus, Settings, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAppStore } from '../store/app-store';
import { automationEngine, type AutomationRule } from '../services/automation';

export function AutomationPanel() {
  const { automationRules } = useAppStore();
  const [isRunning, setIsRunning] = useState(false);
  const [showNewRule, setShowNewRule] = useState(false);

  const handleToggleAutomation = () => {
    if (isRunning) {
      automationEngine.stopAutomation();
      setIsRunning(false);
    } else {
      automationEngine.startAutomation();
      setIsRunning(true);
    }
  };

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    automationEngine.updateRule(ruleId, { enabled });
  };

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'budget':
        return <Settings className="w-5 h-5 text-blue-600" />;
      case 'pause':
        return <Pause className="w-5 h-5 text-red-600" />;
      case 'creative':
        return <Play className="w-5 h-5 text-purple-600" />;
      default:
        return <Settings className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled ? 'text-green-600' : 'text-gray-400';
  };

  const history = automationEngine.getHistory();

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Campaign Automation</h2>
            <p className="text-gray-600">Automated rules and optimizations for your campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-600' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                {isRunning ? 'Active' : 'Inactive'}
              </span>
            </div>
            <button
              onClick={handleToggleAutomation}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isRunning 
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  Stop Automation
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Automation
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{automationRules.filter(r => r.enabled).length}</p>
            <p className="text-sm text-gray-600">Active Rules</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{history.filter(h => h.success).length}</p>
            <p className="text-sm text-gray-600">Successful Actions</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{automationRules.reduce((sum, r) => sum + r.triggerCount, 0)}</p>
            <p className="text-sm text-gray-600">Total Triggers</p>
          </div>
        </div>
      </div>

      {/* Automation Rules */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Automation Rules</h3>
            <button
              onClick={() => setShowNewRule(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Rule
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {automationRules.map((rule) => (
            <div key={rule.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getRuleIcon(rule.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{rule.name}</h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        rule.enabled 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {rule.enabled ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Enabled
                          </>
                        ) : (
                          <>
                            <Pause className="w-3 h-3" />
                            Disabled
                          </>
                        )}
                      </span>
                    </div>

                    {/* Conditions */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Conditions:</p>
                      <div className="space-y-1">
                        {rule.conditions.map((condition, index) => (
                          <div key={index} className="text-sm text-gray-700 bg-gray-50 rounded px-2 py-1 inline-block mr-2">
                            {condition.metric} {condition.operator} {condition.value}
                            {condition.timeframe && ` (${condition.timeframe}h)`}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Actions:</p>
                      <div className="space-y-1">
                        {rule.actions.map((action, index) => (
                          <div key={index} className="text-sm text-gray-700 bg-blue-50 rounded px-2 py-1 inline-block mr-2">
                            {action.type}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Triggered: {rule.triggerCount} times</span>
                      {rule.lastTriggered && (
                        <span>Last: {rule.lastTriggered.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) => handleToggleRule(rule.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automation History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
          {history.slice(0, 10).map((entry) => (
            <div key={entry.id} className="p-4 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                entry.success ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {entry.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                <p className="text-xs text-gray-600">
                  Campaign: {entry.campaignId} • {entry.timestamp.toLocaleString()}
                </p>
              </div>
              <div className={`px-2 py-1 text-xs rounded-full ${
                entry.success 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {entry.success ? 'Success' : 'Failed'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}