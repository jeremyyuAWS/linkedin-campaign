// Real-time data streaming simulation for live campaign updates

interface RealtimeEvent {
  id: string;
  type: 'impression' | 'click' | 'conversion' | 'budget_update' | 'audience_change';
  campaignId: string;
  timestamp: Date;
  data: any;
  impact: 'positive' | 'negative' | 'neutral';
}

class RealtimeDataGenerator {
  private eventQueue: RealtimeEvent[] = [];
  private isStreaming = false;
  private intervalId: NodeJS.Timeout | null = null;

  // Simulate real-time campaign events
  startRealTimeStream(campaigns: any[]): void {
    if (this.isStreaming) return;
    
    this.isStreaming = true;
    console.log('Starting real-time campaign data stream...');

    // Generate events every 5-15 seconds
    this.intervalId = setInterval(() => {
      const events = this.generateRealtimeEvents(campaigns);
      events.forEach(event => {
        this.eventQueue.push(event);
        this.emitEvent(event);
      });
    }, this.getRandomBetween(5000, 15000));
  }

  stopRealTimeStream(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isStreaming = false;
    console.log('Real-time stream stopped');
  }

  private generateRealtimeEvents(campaigns: any[]): RealtimeEvent[] {
    const events: RealtimeEvent[] = [];
    const eventTypes = ['impression', 'click', 'conversion', 'budget_update'];

    // Generate 1-3 events per cycle
    const eventCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < eventCount; i++) {
      const campaign = this.getRandomFromArray(campaigns);
      const eventType = this.getRandomFromArray(eventTypes);
      
      events.push({
        id: `rt_${Date.now()}_${i}`,
        type: eventType as any,
        campaignId: campaign.id,
        timestamp: new Date(),
        data: this.generateEventData(eventType, campaign),
        impact: this.determineImpact(eventType)
      });
    }

    return events;
  }

  private generateEventData(eventType: string, campaign: any): any {
    switch (eventType) {
      case 'impression':
        return {
          count: Math.floor(Math.random() * 50) + 10,
          audienceSegment: this.getRandomFromArray(['Software Engineers', 'CTOs', 'Product Managers']),
          deviceType: this.getRandomFromArray(['desktop', 'mobile', 'tablet'])
        };
      
      case 'click':
        return {
          count: Math.floor(Math.random() * 5) + 1,
          sourceUrl: 'linkedin.com/feed',
          userType: this.getRandomFromArray(['organic', 'referral', 'direct'])
        };
      
      case 'conversion':
        return {
          count: Math.floor(Math.random() * 2) + 1,
          value: Math.floor(Math.random() * 500) + 100,
          conversionType: this.getRandomFromArray(['lead', 'signup', 'demo_request'])
        };
      
      case 'budget_update':
        return {
          previousSpend: campaign.metrics.spend,
          newSpend: campaign.metrics.spend + Math.floor(Math.random() * 100) + 50,
          reason: 'automated_optimization'
        };
      
      default:
        return {};
    }
  }

  private determineImpact(eventType: string): 'positive' | 'negative' | 'neutral' {
    const positiveEvents = ['click', 'conversion'];
    const negativeEvents = ['budget_update'];
    
    if (positiveEvents.includes(eventType)) return 'positive';
    if (negativeEvents.includes(eventType)) return 'negative';
    return 'neutral';
  }

  private emitEvent(event: RealtimeEvent): void {
    // Emit custom browser event for real-time updates
    window.dispatchEvent(new CustomEvent('realtimeCampaignEvent', { 
      detail: event 
    }));
  }

  getEventHistory(): RealtimeEvent[] {
    return [...this.eventQueue];
  }

  private getRandomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // Simulate external factors affecting performance
  generateExternalFactors(): Array<{
    factor: string;
    impact: number;
    duration: string;
    description: string;
  }> {
    return [
      {
        factor: 'Industry Conference',
        impact: 1.25,
        duration: '3 days',
        description: 'TechCrunch Disrupt increases developer audience activity'
      },
      {
        factor: 'Economic News',
        impact: 0.85,
        duration: '1 week',
        description: 'Market uncertainty reduces B2B ad engagement'
      },
      {
        factor: 'Competitor Launch',
        impact: 0.92,
        duration: '2 weeks',
        description: 'Major competitor product launch increases competition'
      },
      {
        factor: 'Holiday Period',
        impact: 0.75,
        duration: '1 week',
        description: 'Holiday season reduces business decision-making'
      }
    ];
  }
}

export const realtimeDataGenerator = new RealtimeDataGenerator();