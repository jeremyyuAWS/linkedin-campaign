interface AIInsight {
  type: 'performance' | 'budget' | 'creative' | 'audience' | 'optimization';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  data: any;
}

interface ConversationContext {
  userId: string;
  campaignContext: string[];
  previousQueries: string[];
  preferences: {
    industry?: string;
    campaignTypes?: string[];
    reportingFrequency?: string;
  };
}

interface AnomalyDetection {
  id: string;
  type: 'spend_spike' | 'ctr_drop' | 'conversion_anomaly' | 'audience_shift';
  severity: 'critical' | 'warning' | 'info';
  metric: string;
  value: number;
  expected: number;
  deviation: number;
  timestamp: Date;
  campaignId: string;
  description: string;
  recommendation: string;
}

interface PredictiveBidding {
  campaignId: string;
  currentBid: number;
  recommendedBid: number;
  confidence: number;
  reasoning: string;
  expectedImpact: {
    impressions: number;
    clicks: number;
    cost: number;
  };
}

interface SmartCreative {
  id: string;
  type: 'headline' | 'description' | 'cta';
  original: string;
  generated: string;
  confidence: number;
  reasoning: string;
  expectedImpact: string;
}

interface SentimentAnalysis {
  campaignId: string;
  overall: 'positive' | 'neutral' | 'negative';
  score: number;
  breakdown: {
    engagement: number;
    comments: number;
    shares: number;
  };
  insights: string[];
  recommendations: string[];
}

class AIEngine {
  private context: ConversationContext | null = null;
  private openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  private anomalyHistory: AnomalyDetection[] = [];

  // Initialize AI context for a user session
  initializeContext(userId: string, campaigns: any[]): void {
    this.context = {
      userId,
      campaignContext: campaigns.map(c => c.name),
      previousQueries: [],
      preferences: this.loadUserPreferences(userId)
    };
  }

  // Generate AI insights from campaign data
  async generateInsights(campaigns: any[]): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    for (const campaign of campaigns) {
      // Performance Analysis
      const performanceInsight = this.analyzePerformance(campaign);
      if (performanceInsight) insights.push(performanceInsight);

      // Budget Analysis
      const budgetInsight = this.analyzeBudget(campaign);
      if (budgetInsight) insights.push(budgetInsight);

      // Creative Analysis
      const creativeInsight = await this.analyzeCreative(campaign);
      if (creativeInsight) insights.push(creativeInsight);

      // Audience Analysis
      const audienceInsight = this.analyzeAudience(campaign);
      if (audienceInsight) insights.push(audienceInsight);
    }

    // Cross-campaign optimization
    const optimizationInsights = this.analyzeCrossCampaignOptimizations(campaigns);
    insights.push(...optimizationInsights);

    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Advanced Anomaly Detection
  async detectAnomalies(campaigns: any[], realTimeData?: any[]): Promise<AnomalyDetection[]> {
    const anomalies: AnomalyDetection[] = [];

    for (const campaign of campaigns) {
      // Spend anomaly detection
      const spendAnomaly = this.detectSpendAnomaly(campaign);
      if (spendAnomaly) anomalies.push(spendAnomaly);

      // CTR anomaly detection
      const ctrAnomaly = this.detectCTRAnomaly(campaign);
      if (ctrAnomaly) anomalies.push(ctrAnomaly);

      // Conversion anomaly detection
      const conversionAnomaly = this.detectConversionAnomaly(campaign);
      if (conversionAnomaly) anomalies.push(conversionAnomaly);

      // Audience behavior anomaly
      const audienceAnomaly = this.detectAudienceAnomaly(campaign);
      if (audienceAnomaly) anomalies.push(audienceAnomaly);
    }

    // Store in history for pattern analysis
    this.anomalyHistory.push(...anomalies);
    
    return anomalies;
  }

  // Predictive Bidding Engine
  async generatePredictiveBidding(campaigns: any[]): Promise<PredictiveBidding[]> {
    const biddingRecommendations: PredictiveBidding[] = [];

    for (const campaign of campaigns) {
      const currentCPC = campaign.metrics.cpc;
      const currentCTR = campaign.metrics.ctr;
      const competitiveIndex = this.calculateCompetitiveIndex(campaign);
      
      // AI-powered bid recommendation
      const recommendation = this.calculateOptimalBid(campaign, competitiveIndex);
      
      biddingRecommendations.push({
        campaignId: campaign.id,
        currentBid: currentCPC,
        recommendedBid: recommendation.bid,
        confidence: recommendation.confidence,
        reasoning: recommendation.reasoning,
        expectedImpact: recommendation.impact
      });
    }

    return biddingRecommendations;
  }

  // Smart Creative Generation
  async generateSmartCreatives(campaign: any): Promise<SmartCreative[]> {
    const creatives: SmartCreative[] = [];

    // Generate headline variations
    const headlines = await this.generateHeadlineVariations(campaign);
    creatives.push(...headlines);

    // Generate description variations
    const descriptions = await this.generateDescriptionVariations(campaign);
    creatives.push(...descriptions);

    // Generate CTA variations
    const ctas = await this.generateCTAVariations(campaign);
    creatives.push(...ctas);

    return creatives;
  }

  // Sentiment Analysis
  async analyzeSentiment(campaigns: any[]): Promise<SentimentAnalysis[]> {
    const sentimentResults: SentimentAnalysis[] = [];

    for (const campaign of campaigns) {
      const sentiment = this.calculateSentimentScore(campaign);
      
      sentimentResults.push({
        campaignId: campaign.id,
        overall: sentiment.overall,
        score: sentiment.score,
        breakdown: sentiment.breakdown,
        insights: sentiment.insights,
        recommendations: sentiment.recommendations
      });
    }

    return sentimentResults;
  }

  // Analyze campaign performance and detect anomalies
  private analyzePerformance(campaign: any): AIInsight | null {
    const currentCTR = campaign.metrics.ctr;
    const weeklyTrend = this.calculateWeeklyTrend(campaign);
    
    // Detect CTR decline
    if (weeklyTrend < -20) {
      return {
        type: 'performance',
        priority: 'high',
        title: 'Significant CTR Decline Detected',
        description: `${campaign.name} CTR dropped ${Math.abs(weeklyTrend).toFixed(1)}% in the last 7 days`,
        recommendation: 'Consider refreshing ad creatives or adjusting targeting parameters. Review audience fatigue metrics.',
        confidence: 0.85,
        impact: 'high',
        data: {
          campaignId: campaign.id,
          currentCTR,
          weeklyTrend,
          possibleCauses: ['creative_fatigue', 'audience_saturation', 'increased_competition']
        }
      };
    }

    // Detect strong performance
    if (currentCTR > 3.5 && weeklyTrend > 10) {
      return {
        type: 'performance',
        priority: 'medium',
        title: 'Strong Performance Opportunity',
        description: `${campaign.name} shows exceptional performance with ${currentCTR.toFixed(2)}% CTR`,
        recommendation: 'Consider increasing budget allocation to capitalize on strong performance',
        confidence: 0.92,
        impact: 'high',
        data: {
          campaignId: campaign.id,
          currentCTR,
          weeklyTrend
        }
      };
    }

    return null;
  }

  // Analyze budget utilization and forecast
  private analyzeBudget(campaign: any): AIInsight | null {
    const spentPercentage = (campaign.budget.spent / campaign.budget.total) * 100;
    const dailySpend = campaign.last_7_days.spend / 7;
    const daysRemaining = Math.floor(campaign.budget.remaining / dailySpend);

    if (spentPercentage > 90) {
      return {
        type: 'budget',
        priority: 'high',
        title: 'Budget Threshold Exceeded',
        description: `${campaign.name} has spent ${spentPercentage.toFixed(1)}% of allocated budget`,
        recommendation: 'Pause campaign or increase budget allocation to maintain delivery',
        confidence: 0.99,
        impact: 'high',
        data: {
          campaignId: campaign.id,
          spentPercentage,
          remainingDays: daysRemaining
        }
      };
    }

    if (daysRemaining < 5 && spentPercentage < 50) {
      return {
        type: 'budget',
        priority: 'medium',
        title: 'Budget Pacing Issue',
        description: `${campaign.name} will exceed budget ${daysRemaining} days early at current spend rate`,
        recommendation: 'Adjust daily spend limits to maintain budget pacing',
        confidence: 0.88,
        impact: 'medium',
        data: {
          campaignId: campaign.id,
          forecastDays: daysRemaining,
          dailySpend
        }
      };
    }

    return null;
  }

  // Analyze creative performance with AI
  private async analyzeCreative(campaign: any): Promise<AIInsight | null> {
    // Simulate AI analysis of creative elements
    const creativeScore = this.calculateCreativeScore(campaign);
    
    if (creativeScore < 0.6) {
      const aiSuggestions = await this.generateCreativeSuggestions(campaign);
      
      return {
        type: 'creative',
        priority: 'medium',
        title: 'Creative Optimization Opportunity',
        description: `Creative assets for ${campaign.name} show signs of fatigue`,
        recommendation: `Test new creative variations: ${aiSuggestions.join(', ')}`,
        confidence: 0.75,
        impact: 'medium',
        data: {
          campaignId: campaign.id,
          creativeScore,
          suggestions: aiSuggestions
        }
      };
    }

    return null;
  }

  // Analyze audience performance
  private analyzeAudience(campaign: any): AIInsight | null {
    // Simulate audience analysis
    const audienceScore = Math.random() * 0.3 + 0.7; // Mock score
    
    if (audienceScore > 0.85) {
      return {
        type: 'audience',
        priority: 'low',
        title: 'Audience Expansion Opportunity',
        description: `Current audience segments for ${campaign.name} show strong engagement`,
        recommendation: 'Consider expanding to similar audience segments or lookalike audiences',
        confidence: 0.78,
        impact: 'medium',
        data: {
          campaignId: campaign.id,
          audienceScore,
          suggestedExpansions: ['VP, Data Science', 'Senior Product Manager', 'Director of Engineering']
        }
      };
    }

    return null;
  }

  // Cross-campaign optimization analysis
  private analyzeCrossCampaignOptimizations(campaigns: any[]): AIInsight[] {
    const insights: AIInsight[] = [];
    
    // Budget reallocation opportunities
    const topPerformer = campaigns.reduce((prev, current) => 
      prev.metrics.ctr > current.metrics.ctr ? prev : current
    );
    
    const underPerformers = campaigns.filter(c => 
      c.metrics.ctr < 2.5 && c.status === 'active'
    );

    if (underPerformers.length > 0 && topPerformer.metrics.ctr > 3.5) {
      insights.push({
        type: 'optimization',
        priority: 'high',
        title: 'Budget Reallocation Opportunity',
        description: `Reallocate budget from underperforming campaigns to ${topPerformer.name}`,
        recommendation: `Move $${underPerformers.reduce((sum, c) => sum + c.last_7_days.spend / 7, 0).toFixed(0)}/day to top performer`,
        confidence: 0.82,
        impact: 'high',
        data: {
          topPerformer: topPerformer.id,
          underPerformers: underPerformers.map(c => c.id)
        }
      });
    }

    return insights;
  }

  // Advanced anomaly detection methods
  private detectSpendAnomaly(campaign: any): AnomalyDetection | null {
    const avgDailySpend = campaign.metrics.spend / 30;
    const recentDailySpend = campaign.last_7_days.spend / 7;
    const deviation = ((recentDailySpend - avgDailySpend) / avgDailySpend) * 100;

    if (Math.abs(deviation) > 50) {
      return {
        id: `anomaly_${Date.now()}_${campaign.id}`,
        type: 'spend_spike',
        severity: deviation > 0 ? 'critical' : 'warning',
        metric: 'Daily Spend',
        value: recentDailySpend,
        expected: avgDailySpend,
        deviation,
        timestamp: new Date(),
        campaignId: campaign.id,
        description: `Daily spend ${deviation > 0 ? 'increased' : 'decreased'} by ${Math.abs(deviation).toFixed(1)}%`,
        recommendation: deviation > 0 ? 'Review bidding strategy and budget caps' : 'Investigate delivery issues'
      };
    }

    return null;
  }

  private detectCTRAnomaly(campaign: any): AnomalyDetection | null {
    const expectedCTR = 2.7; // Industry benchmark
    const currentCTR = campaign.metrics.ctr;
    const deviation = ((currentCTR - expectedCTR) / expectedCTR) * 100;

    if (currentCTR < 1.5) {
      return {
        id: `anomaly_${Date.now()}_${campaign.id}`,
        type: 'ctr_drop',
        severity: 'critical',
        metric: 'CTR',
        value: currentCTR,
        expected: expectedCTR,
        deviation,
        timestamp: new Date(),
        campaignId: campaign.id,
        description: `CTR significantly below industry benchmark (${currentCTR.toFixed(2)}% vs ${expectedCTR}%)`,
        recommendation: 'Immediate creative refresh and audience review required'
      };
    }

    return null;
  }

  private detectConversionAnomaly(campaign: any): AnomalyDetection | null {
    const expectedConversionRate = 2.5; // Expected rate
    const currentRate = (campaign.metrics.conversions / campaign.metrics.clicks) * 100;
    const deviation = ((currentRate - expectedConversionRate) / expectedConversionRate) * 100;

    if (Math.abs(deviation) > 40) {
      return {
        id: `anomaly_${Date.now()}_${campaign.id}`,
        type: 'conversion_anomaly',
        severity: Math.abs(deviation) > 60 ? 'critical' : 'warning',
        metric: 'Conversion Rate',
        value: currentRate,
        expected: expectedConversionRate,
        deviation,
        timestamp: new Date(),
        campaignId: campaign.id,
        description: `Conversion rate ${deviation > 0 ? 'above' : 'below'} expected range`,
        recommendation: deviation > 0 ? 'Scale successful elements' : 'Review landing page and offer'
      };
    }

    return null;
  }

  private detectAudienceAnomaly(campaign: any): AnomalyDetection | null {
    // Simulate audience behavior change detection
    const audienceShift = Math.random() * 100 - 50; // -50 to +50

    if (Math.abs(audienceShift) > 30) {
      return {
        id: `anomaly_${Date.now()}_${campaign.id}`,
        type: 'audience_shift',
        severity: 'info',
        metric: 'Audience Engagement',
        value: 50 + audienceShift,
        expected: 50,
        deviation: audienceShift,
        timestamp: new Date(),
        campaignId: campaign.id,
        description: `Significant shift in audience engagement patterns detected`,
        recommendation: 'Review audience targeting and consider segment analysis'
      };
    }

    return null;
  }

  // Predictive bidding calculations
  private calculateCompetitiveIndex(campaign: any): number {
    // Simulate competitive analysis
    return Math.random() * 0.5 + 0.5; // 0.5 to 1.0
  }

  private calculateOptimalBid(campaign: any, competitiveIndex: number): any {
    const currentCPC = campaign.metrics.cpc;
    const currentCTR = campaign.metrics.ctr;
    
    // AI-powered bid optimization
    let recommendedBid = currentCPC;
    let reasoning = '';
    
    if (currentCTR > 3.5) {
      recommendedBid = currentCPC * 1.2;
      reasoning = 'High CTR indicates strong ad relevance - increase bid to capture more volume';
    } else if (currentCTR < 2.0) {
      recommendedBid = currentCPC * 0.8;
      reasoning = 'Low CTR suggests poor ad relevance - reduce bid and optimize creatives';
    } else {
      recommendedBid = currentCPC * (0.9 + competitiveIndex * 0.2);
      reasoning = 'Moderate performance - adjust bid based on competitive landscape';
    }

    return {
      bid: Math.round(recommendedBid * 100) / 100,
      confidence: 0.75 + (currentCTR / 10),
      reasoning,
      impact: {
        impressions: Math.round(campaign.metrics.impressions * (recommendedBid / currentCPC)),
        clicks: Math.round(campaign.metrics.clicks * (recommendedBid / currentCPC) * 0.9),
        cost: Math.round(campaign.metrics.spend * (recommendedBid / currentCPC))
      }
    };
  }

  // Smart creative generation methods
  private async generateHeadlineVariations(campaign: any): Promise<SmartCreative[]> {
    const variations = [
      'Boost Team Productivity with AI-Powered Tools',
      'Transform Your Workflow in Minutes',
      'Join 50,000+ Teams Building Faster',
      'Cut Development Time by 40%',
      'The Future of Software Development'
    ];

    return variations.map((variation, index) => ({
      id: `headline_${index}`,
      type: 'headline',
      original: 'Original Headline',
      generated: variation,
      confidence: 0.7 + Math.random() * 0.2,
      reasoning: 'Emphasizes specific outcomes and social proof',
      expectedImpact: `+${Math.round(Math.random() * 20 + 10)}% CTR`
    }));
  }

  private async generateDescriptionVariations(campaign: any): Promise<SmartCreative[]> {
    const variations = [
      'Cut deployment time by 80% with automated CI/CD pipelines and intelligent scaling.',
      'From code to production in one click. Experience the future of software development.',
      'Trusted by unicorn startups and Fortune 500 companies for mission-critical applications.'
    ];

    return variations.map((variation, index) => ({
      id: `description_${index}`,
      type: 'description',
      original: 'Original Description',
      generated: variation,
      confidence: 0.65 + Math.random() * 0.25,
      reasoning: 'Focuses on specific benefits and credibility indicators',
      expectedImpact: `+${Math.round(Math.random() * 15 + 5)}% engagement`
    }));
  }

  private async generateCTAVariations(campaign: any): Promise<SmartCreative[]> {
    const variations = [
      'Start Free Trial',
      'Get Demo',
      'Try Now',
      'See How It Works',
      'Join Free'
    ];

    return variations.map((variation, index) => ({
      id: `cta_${index}`,
      type: 'cta',
      original: 'Learn More',
      generated: variation,
      confidence: 0.8 + Math.random() * 0.15,
      reasoning: 'Action-oriented language with clear value proposition',
      expectedImpact: `+${Math.round(Math.random() * 12 + 3)}% clicks`
    }));
  }

  // Sentiment analysis calculation
  private calculateSentimentScore(campaign: any): any {
    const baseScore = Math.random() * 0.6 + 0.2; // 0.2 to 0.8
    
    return {
      overall: baseScore > 0.6 ? 'positive' : baseScore > 0.4 ? 'neutral' : 'negative',
      score: baseScore,
      breakdown: {
        engagement: baseScore + Math.random() * 0.2 - 0.1,
        comments: baseScore + Math.random() * 0.3 - 0.15,
        shares: baseScore + Math.random() * 0.25 - 0.125
      },
      insights: [
        'Strong engagement from technical leadership roles',
        'Higher sentiment during business hours',
        'Positive response to outcome-focused messaging'
      ],
      recommendations: [
        'Increase budget during peak sentiment hours',
        'Test more outcome-focused creative variations',
        'Expand to similar high-engagement segments'
      ]
    };
  }

  // Natural language query processing
  async processQuery(query: string): Promise<string> {
    if (!this.context) {
      return "Please initialize the AI context first by connecting to your LinkedIn account.";
    }

    // Add to conversation history
    this.context.previousQueries.push(query);

    // Use OpenAI for dynamic responses (in production)
    if (this.openaiApiKey) {
      return await this.queryOpenAI(query);
    }

    // Fallback to pattern matching for demo
    return this.processQueryWithPatterns(query);
  }

  // OpenAI integration for dynamic responses
  private async queryOpenAI(query: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a LinkedIn Ads expert AI assistant. You have access to campaign data for: ${this.context?.campaignContext.join(', ')}. Provide specific, actionable insights based on the user's query.`
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.processQueryWithPatterns(query);
    }
  }

  // Pattern-based query processing (fallback)
  private processQueryWithPatterns(query: string): string {
    const queryLower = query.toLowerCase();

    if (queryLower.includes('lowest cost') || queryLower.includes('cheapest')) {
      return "Based on Q4 data, the **Startup Founders - Growth Analytics** campaign achieved the lowest cost-per-lead at **$71.20**. This campaign targeted smaller companies (1-50 employees) and used outcome-focused messaging.";
    }

    if (queryLower.includes('job title') || queryLower.includes('audience')) {
      return "For your current campaigns, **Software Engineers** show the strongest performance with a **4.0% CTR**. **Engineering Managers** have the lowest cost-per-conversion at **$89.75**. Consider expanding to similar technical roles.";
    }

    if (queryLower.includes('budget') || queryLower.includes('spend')) {
      return "Current budget utilization: Q4 Developer (75% spent), Enterprise CTO (31% spent), Mid-Market SaaS (95% spent - **needs attention**), Startup Founders (45% spent).";
    }

    if (queryLower.includes('creative') || queryLower.includes('ad copy')) {
      return "Top-performing creatives use outcome-focused messaging. Headlines with 'AI-Powered' show 34% higher engagement. Consider testing result-specific copy like '40% cost reduction' vs generic tech terms.";
    }

    return "I can help you analyze campaign performance, budget optimization, audience insights, and creative effectiveness. Try asking about specific metrics, comparisons, or optimization recommendations.";
  }

  // Helper methods
  private calculateWeeklyTrend(campaign: any): number {
    const currentCTR = campaign.metrics.ctr;
    const weeklyCTR = campaign.last_7_days.ctr;
    return ((weeklyCTR - currentCTR) / currentCTR) * 100;
  }

  private calculateCreativeScore(campaign: any): number {
    // Simulate creative performance scoring
    const ctr = campaign.metrics.ctr;
    const industryAvg = 2.7;
    return Math.min(ctr / industryAvg, 1.0);
  }

  private async generateCreativeSuggestions(campaign: any): Promise<string[]> {
    // AI-generated creative suggestions
    return [
      'Outcome-focused headlines (e.g., "40% cost reduction")',
      'Industry-specific messaging',
      'Social proof elements',
      'Urgency/scarcity elements'
    ];
  }

  private loadUserPreferences(userId: string): any {
    // Load from localStorage or API
    const stored = localStorage.getItem(`ai_preferences_${userId}`);
    return stored ? JSON.parse(stored) : {};
  }

  // Predictive analytics
  async predictCampaignPerformance(campaign: any, days: number = 7): Promise<any> {
    const currentTrend = this.calculateWeeklyTrend(campaign);
    const dailySpend = campaign.last_7_days.spend / 7;
    
    return {
      predictedCTR: campaign.metrics.ctr * (1 + currentTrend / 100),
      predictedSpend: dailySpend * days,
      predictedConversions: Math.round((campaign.metrics.conversions / 7) * days),
      confidence: 0.75,
      factors: ['historical_performance', 'market_trends', 'seasonal_patterns']
    };
  }
}

export const aiEngine = new AIEngine();
export type { AIInsight, ConversationContext, AnomalyDetection, PredictiveBidding, SmartCreative, SentimentAnalysis };