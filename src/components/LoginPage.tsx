import React from 'react';
import { Linkedin, Bot, TrendingUp, Zap, Shield, Play } from 'lucide-react';
import { useAppStore } from '../store/app-store';

export function LoginPage() {
  const { login, loginDemo, isLoading } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/images/Workjam-logo.png" 
                alt="Workjam" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">LinkedIn Analyst Agent</h1>
              <p className="text-gray-600">AI-Powered Campaign Intelligence</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Transform Your LinkedIn Advertising with AI
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Automate campaign optimization, get real-time insights, and maximize ROI 
              with our intelligent analytics platform.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
                  <p className="text-gray-600">Get intelligent recommendations for budget allocation, audience targeting, and creative optimization.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Performance Monitoring</h3>
                  <p className="text-gray-600">Real-time alerts for campaign anomalies, budget thresholds, and optimization opportunities.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Automated Optimization</h3>
                  <p className="text-gray-600">Set rules to automatically pause underperformers, reallocate budgets, and scale winning campaigns.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Secure & Compliant</h3>
                  <p className="text-gray-600">Enterprise-grade security with LinkedIn's official API integration and OAuth 2.0 authentication.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h3>
              <p className="text-gray-600">Connect your LinkedIn Ads account or try the demo</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={login}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Linkedin className="w-5 h-5" />
                )}
                {isLoading ? 'Connecting...' : 'Connect LinkedIn Account'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={loginDemo}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-lg font-semibold shadow-lg"
              >
                <Play className="w-5 h-5" />
                Try Demo Mode
              </button>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Play className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Demo Mode</p>
                    <p className="text-xs text-purple-700 mt-1">
                      Experience the full platform with simulated LinkedIn campaign data. 
                      No account connection required.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                By connecting, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </div>

            {/* Demo Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">Trusted by marketing teams</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">$2.5M+</p>
                  <p className="text-xs text-gray-600">Ad Spend Optimized</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">34%</p>
                  <p className="text-xs text-gray-600">Avg. ROI Improvement</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">10hrs</p>
                  <p className="text-xs text-gray-600">Saved per Week</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Smart Analytics</h4>
            <p className="text-gray-600 text-sm">AI analyzes your campaigns and provides actionable insights for better performance.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Real-time Monitoring</h4>
            <p className="text-gray-600 text-sm">Stay informed with instant alerts about campaign performance and budget usage.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Automation</h4>
            <p className="text-gray-600 text-sm">Set up rules to automatically optimize your campaigns based on performance metrics.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure Access</h4>
            <p className="text-gray-600 text-sm">Enterprise-grade security with official LinkedIn API integration.</p>
          </div>
        </div>
      </div>
    </div>
  );
}