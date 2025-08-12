import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Palette, 
  Users, 
  Bell, 
  MessageCircle, 
  FileText,
  Bot,
  TrendingUp,
  RefreshCw,
  Shuffle,
  Eye,
  Target,
  Activity,
  Zap,
  HelpCircle
} from 'lucide-react';

import { Tabs } from './components/Tabs';
import { Dashboard } from './components/Dashboard';
import { BudgetMonitor } from './components/BudgetMonitor';
import { CreativeLab } from './components/CreativeLab';
import { AudienceInsights } from './components/AudienceInsights';
import { AlertsRecommendations } from './components/AlertsRecommendations';
import { CampaignQA } from './components/CampaignQA';
import { ReportBuilder } from './components/ReportBuilder';
import { LoginPage } from './components/LoginPage';
import { AuthCallback } from './components/AuthCallback';
import { AutomationPanel } from './components/AutomationPanel';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { CrossCampaignOptimization } from './components/CrossCampaignOptimization';
import { CompetitiveIntelligence } from './components/CompetitiveIntelligence';
import { AttributionModeling } from './components/AttributionModeling';
import { ConversionFunnelAnalysis } from './components/ConversionFunnelAnalysis';
import { RealTimeAlerts } from './components/RealTimeAlerts';
import { WelcomeModal } from './components/WelcomeModal';

import { useAppStore } from './store/app-store';

function App() {
  const { 
    isAuthenticated, 
    user, 
    activeTab, 
    setActiveTab, 
    isLoading,
    isDemoMode,
    campaigns,
    creatives,
    alerts,
    audienceInsights,
    refreshData,
    logout
  } = useAppStore();

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Handle OAuth callback
  useEffect(() => {
    if (window.location.pathname === '/auth/callback') {
      return; // AuthCallback component will handle this
    }
  }, []);

  // Show welcome modal on first visit for authenticated users
  useEffect(() => {
    if (isAuthenticated && !localStorage.getItem('welcomeModalShown')) {
      setShowWelcomeModal(true);
      localStorage.setItem('welcomeModalShown', 'true');
    }
  }, [isAuthenticated]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading LinkedIn Analyst Agent...</p>
        </div>
      </div>
    );
  }

  // OAuth callback handling
  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'budget', label: 'Budget Monitor', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'creative', label: 'Creative Lab', icon: <Palette className="w-4 h-4" /> },
    { id: 'audience', label: 'Audience Insights', icon: <Users className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'qa', label: 'Campaign Q&A', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'automation', label: 'Automation', icon: <Bot className="w-4 h-4" /> },
    { id: 'predictions', label: 'Predictions', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'optimization', label: 'Cross-Campaign', icon: <Shuffle className="w-4 h-4" /> },
    { id: 'competitive', label: 'Competitive Intel', icon: <Eye className="w-4 h-4" /> },
    { id: 'attribution', label: 'Attribution', icon: <Target className="w-4 h-4" /> },
    { id: 'funnel', label: 'Conversion Funnel', icon: <Activity className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard campaigns={campaigns} />;
      case 'budget':
        return <BudgetMonitor campaigns={campaigns} />;
      case 'creative':
        return <CreativeLab creatives={creatives} />;
      case 'audience':
        return <AudienceInsights insights={audienceInsights} />;
      case 'alerts':
        return <AlertsRecommendations alerts={alerts} />;
      case 'qa':
        return <CampaignQA />;
      case 'automation':
        return <AutomationPanel />;
      case 'predictions':
        return <PredictiveAnalytics />;
      case 'optimization':
        return <CrossCampaignOptimization />;
      case 'competitive':
        return <CompetitiveIntelligence />;
      case 'attribution':
        return <AttributionModeling />;
      case 'funnel':
        return <ConversionFunnelAnalysis campaigns={campaigns} />;
      case 'reports':
        return <ReportBuilder campaigns={campaigns} />;
      default:
        return <Dashboard campaigns={campaigns} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Real-Time Alerts Component */}
      {isAuthenticated && <RealTimeAlerts />}

      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)} 
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-28 h-28 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/Workjam-logo.png" 
                    alt="Workjam" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">LinkedIn Analyst Agent</h1>
                  <p className="text-sm text-gray-600">AI-Powered Campaign Intelligence</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isDemoMode && (
                <div className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-800 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Demo Mode</span>
                </div>
              )}
              
              {user && (
                <div className="text-sm text-gray-600">
                  Welcome, {user.firstName} {user.lastName}
                </div>
              )}
              
              <button
                onClick={refreshData}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>

              <div className="text-sm text-gray-600">
                Last sync: {new Date().toLocaleTimeString()}
              </div>

              {/* Help/Welcome Button */}
              <button
                onClick={() => setShowWelcomeModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Help & Feature Guide"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </button>

              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isDemoMode ? 'Exit Demo' : 'Logout'}
              </button>

              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}

export default App;