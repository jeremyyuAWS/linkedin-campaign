import React, { useState } from 'react';
import { Send, MessageCircle, Lightbulb, BarChart3, TrendingUp, Users, DollarSign, Target, Zap, Calendar, FileText, Mic, MicOff } from 'lucide-react';

interface ConversationMessage {
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  context?: {
    campaign?: string;
    metric?: string;
    charts?: any[];
    suggestions?: string[];
  };
}

interface QuickMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

export function CampaignQA() {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const predefinedQuestions = [
    "Which campaign had the lowest cost-per-lead last quarter?",
    "Which job titles performed best for our cloud services ad?",
    "What's the average CTR across all active campaigns?",
    "Show me budget utilization by campaign",
    "Which creative assets have the highest engagement?",
    "Compare performance across different company sizes",
    "What are the top performing audience segments?",
    "How has performance changed over the last 30 days?",
    "Which campaigns should I optimize first?",
    "What's the ROI for each campaign?"
  ];

  const quickMetrics: QuickMetric[] = [
    {
      label: "Total Active Campaigns",
      value: "3",
      change: "+1 this month",
      trend: "up",
      icon: <Target className="w-5 h-5 text-blue-600" />
    },
    {
      label: "Total Monthly Spend",
      value: "$54,350",
      change: "+8.2% vs last month",
      trend: "up",
      icon: <DollarSign className="w-5 h-5 text-green-600" />
    },
    {
      label: "Average CTR",
      value: "3.21%",
      change: "18% above benchmark",
      trend: "up",
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />
    },
    {
      label: "Total Conversions",
      value: "255",
      change: "+12.5% vs last month",
      trend: "up",
      icon: <Users className="w-5 h-5 text-orange-600" />
    }
  ];

  const recentInsights = [
    "Enterprise CTO campaign showing strongest momentum with 3.68% CTR",
    "Startup Founders segment has lowest cost-per-conversion at $71.20",
    "Headlines with 'AI-Powered' outperform generic tech terms by 34%",
    "Small company targeting (1-50 employees) shows highest conversion rates"
  ];

  const conversationStarters = [
    "Tell me about my top performing campaign",
    "What should I optimize first?",
    "Show me audience insights",
    "Compare this month vs last month",
    "Which creatives need refreshing?"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message
    const userMessage: ConversationMessage = { 
      type: 'user', 
      message: query, 
      timestamp: new Date() 
    };
    setConversation(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response with typing delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(query);
      const aiMessage: ConversationMessage = { 
        type: 'ai', 
        message: aiResponse.message, 
        timestamp: new Date(),
        context: aiResponse.context
      };
      setConversation(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);

    setQuery('');
    setSelectedSuggestion(null);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSelectedSuggestion(suggestion);
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      // Start voice recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      }
    } else {
      setIsListening(false);
    }
  };

  const generateAIResponse = (question: string): { message: string; context?: any } => {
    const questionLower = question.toLowerCase();

    // Enhanced response patterns with context
    const responses: { [key: string]: { message: string; context?: any } } = {
      "lowest cost-per-lead": {
        message: "Based on Q4 data analysis, the **Startup Founders - Growth Analytics** campaign achieved the lowest cost-per-lead at **$71.20**. This campaign's success factors include:\n\n• **Target Audience**: 1-50 employee companies\n• **Messaging Strategy**: Outcome-focused with growth metrics\n• **Performance**: 125 conversions from $8,900 spend\n• **Key Insight**: Smaller companies show 40% higher conversion rates\n\nWould you like me to analyze what makes this campaign so effective for scaling to other segments?",
        context: {
          campaign: "Startup Founders - Growth Analytics",
          metric: "Cost per Lead",
          suggestions: ["Analyze successful elements", "Scale to similar segments", "Optimize other campaigns"]
        }
      },
      
      "job titles": {
        message: "For cloud services advertising, here's the job title performance breakdown:\n\n**🏆 Top Performers:**\n• **Software Engineers**: 4.0% CTR, 25 conversions, $120.50 CPC\n• **Engineering Managers**: 3.5% CTR, 18 conversions, $89.75 CPC (best cost efficiency)\n• **CTOs**: 4.0% CTR, 12 conversions, $156.25 CPC\n\n**📊 Key Insights:**\n• Technical leadership roles consistently outperform individual contributors by 40%\n• Engineering Managers offer the best cost-per-conversion at $89.75\n• Consider expanding to similar roles like 'VP Engineering' and 'Technical Lead'\n\nShall I show you expansion opportunities for these high-performing segments?",
        context: {
          metric: "Job Title Performance",
          suggestions: ["Expand to VP Engineering", "Create technical leadership campaign", "Analyze role-specific messaging"]
        }
      },
      
      "average CTR": {
        message: "**Current Average CTR: 3.21%** 🎯\n\n**Performance vs Benchmarks:**\n• LinkedIn Industry Benchmark: 2.7%\n• Your Performance: **18% above benchmark**\n• Top Performer: Enterprise CTO Outreach (3.4% CTR)\n• Needs Attention: Q4 Developer Persona (declined to 2.56% CTR)\n\n**Weekly Trend Analysis:**\n• Overall trend: Stable with slight upward momentum\n• Best performing week: 3.45% CTR\n• Recommended action: Address the declining Developer Persona campaign\n\nWould you like specific recommendations to boost underperforming campaigns?",
        context: {
          metric: "CTR Analysis",
          suggestions: ["Optimize Q4 Developer campaign", "Scale Enterprise CTO success", "Analyze CTR drivers"]
        }
      },
      
      "budget utilization": {
        message: "**Budget Utilization Analysis** 💰\n\n**Current Status by Campaign:**\n\n🟢 **Enterprise CTO Outreach**\n• Budget: $40,000 | Spent: $12,500 (31%)\n• Remaining: $27,500 | Status: Healthy pacing\n\n🟡 **Q4 Developer Persona**\n• Budget: $25,000 | Spent: $18,750 (75%)\n• Remaining: $6,250 | Status: Fast burn rate\n\n🔴 **Mid-Market SaaS** - **ACTION NEEDED**\n• Budget: $15,000 | Spent: $14,200 (95%)\n• Remaining: $800 | Status: Critical - will exhaust in 3 days\n\n🟢 **Startup Founders**\n• Budget: $20,000 | Spent: $8,900 (45%)\n• Remaining: $11,100 | Status: Under-paced, scale opportunity\n\n**Immediate Recommendations:**\n1. Pause or increase Mid-Market SaaS budget\n2. Reallocate budget from Q4 Developer to high-performers\n3. Scale Startup Founders budget by 25%",
        context: {
          metric: "Budget Status",
          suggestions: ["Rebalance budgets", "Pause overspent campaigns", "Scale high performers"]
        }
      },
      
      "creative assets": {
        message: "**Top Creative Asset Performance** 🎨\n\n**Highest Engagement Creatives:**\n\n1. **'AI That Actually Drives Business Results'**\n   • CTR: 3.41% | Clicks: 1,450 | Campaign: Enterprise CTO\n   • Key success factor: Outcome-focused messaging\n\n2. **'Accelerate Development with Cloud-Native Tools'**\n   • CTR: 2.67% | Clicks: 1,200 | Campaign: Q4 Developer\n   • Key success factor: Developer-specific benefits\n\n3. **'Build Better. Deploy Faster. Scale Smarter.'**\n   • CTR: 2.50% | Clicks: 950 | Campaign: Q4 Developer\n   • Key success factor: Action-oriented triple promise\n\n**📈 Performance Insights:**\n• Headlines mentioning specific outcomes (like '40% cost reduction') perform 34% better\n• Technical benefit statements outperform generic tech terms\n• Video creatives show 45% higher engagement than static images\n\n**🎯 Optimization Opportunities:**\n• Test outcome-focused variations of underperforming creatives\n• Create video versions of top static performers\n• A/B test specific metric claims vs general benefits",
        context: {
          metric: "Creative Performance",
          suggestions: ["Create video variations", "Test outcome messaging", "Refresh underperformers"]
        }
      },

      "company sizes": {
        message: "**Company Size Performance Analysis** 🏢\n\n**Best Performers by Size:**\n\n🥇 **1-10 employees (Startups)**\n• CTR: 3.8% | Cost per Conversion: $85.50\n• Why: Fast decision-making, budget flexibility\n\n🥈 **11-50 employees (Scale-ups)**\n• CTR: 3.43% | Cost per Conversion: $95.25\n• Why: Growth-focused, tech-forward culture\n\n🥉 **51-200 employees (Mid-market)**\n• CTR: 3.0% | Cost per Conversion: $145.60\n• Why: More structured but still agile\n\n**📊 Key Insights:**\n• Smaller companies convert 40% better than enterprises\n• Cost efficiency decreases with company size\n• Sweet spot: 1-50 employees for best ROI\n\n**Recommendations:**\n• Increase budget allocation to startup segments\n• Create size-specific messaging strategies\n• Test urgency-based messaging for smaller companies",
        context: {
          metric: "Company Size Analysis",
          suggestions: ["Focus on startup segment", "Create size-specific campaigns", "Test decision-speed messaging"]
        }
      }
    };

    // Fuzzy matching for questions
    for (const [keyword, response] of Object.entries(responses)) {
      if (questionLower.includes(keyword) || 
          keyword.split(' ').some(word => questionLower.includes(word))) {
        return response;
      }
    }

    // Default comprehensive response
    return {
      message: "I can help you analyze campaign performance, budget optimization, audience insights, and creative effectiveness. Here are some areas I can dive deep into:\n\n**📊 Performance Analysis:**\n• Campaign ROI and efficiency metrics\n• Audience segment performance\n• Creative asset effectiveness\n\n**💰 Budget Intelligence:**\n• Spend optimization opportunities\n• Budget reallocation recommendations\n• Cost-per-conversion analysis\n\n**🎯 Strategic Insights:**\n• Audience expansion opportunities\n• Creative optimization suggestions\n• Competitive positioning\n\nTry asking about specific metrics, comparisons between campaigns, or optimization recommendations. I can also generate detailed reports and actionable next steps.",
      context: {
        suggestions: ["Analyze top performer", "Budget optimization", "Audience expansion", "Creative insights"]
      }
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Campaign Intelligence Q&A</h2>
            <p className="text-gray-600">Ask me anything about your LinkedIn ad performance</p>
          </div>
        </div>
      </div>

      {/* Quick Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              {metric.icon}
              <h3 className="font-medium text-gray-900 text-sm">{metric.label}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
            <p className="text-sm text-gray-600">{metric.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 space-y-4">
          {/* Conversation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Conversation</h3>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto space-y-4">
              {conversation.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Start by asking a question about your campaigns</p>
                  <div className="space-y-2">
                    {conversationStarters.map((starter, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(starter)}
                        className="block w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        "{starter}"
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {conversation.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-3/4 rounded-lg p-4 ${
                        msg.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="whitespace-pre-line">{msg.message}</div>
                        {msg.context?.suggestions && (
                          <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                            <p className="text-xs text-gray-600 mb-2">Quick follow-ups:</p>
                            {msg.context.suggestions.map((suggestion: string, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                        <p className={`text-xs mt-2 ${
                          msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="bg-gray-100 text-gray-900 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">Analyzing data...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask me about campaign performance, budget, audiences, or optimizations..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                type="submit"
                disabled={!query.trim() || isTyping}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Ask
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested Questions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Suggested Questions</h3>
            </div>
            <div className="space-y-2">
              {predefinedQuestions.slice(0, 8).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  className={`w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm ${
                    selectedSuggestion === question ? 'bg-blue-50 border-blue-300' : ''
                  }`}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Recent Insights</h3>
            </div>
            <div className="space-y-3">
              {recentInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-900">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Export & Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Actions</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FileText className="w-4 h-4" />
                Export Conversation
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4" />
                Schedule Report
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart3 className="w-4 h-4" />
                Deep Dive Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}