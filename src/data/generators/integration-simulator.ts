// Simulate integrations with CRM, email marketing, and other tools

interface IntegrationConfig {
  id: string;
  name: string;
  type: 'crm' | 'email' | 'analytics' | 'chat' | 'calendar' | 'payment';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  provider: string;
  lastSync: Date;
  dataFields: IntegrationField[];
  syncFrequency: string;
  recordsSynced: number;
  errors: IntegrationError[];
}

interface IntegrationField {
  field: string;
  mapped: boolean;
  destination: string;
  lastUpdated: Date;
}

interface IntegrationError {
  id: string;
  type: 'authentication' | 'mapping' | 'rate_limit' | 'data_format';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface SyncedRecord {
  id: string;
  type: 'lead' | 'contact' | 'opportunity' | 'customer';
  source: string;
  destination: string;
  campaignId: string;
  data: any;
  syncedAt: Date;
}

class IntegrationSimulator {
  generateIntegrations(): IntegrationConfig[] {
    return [
      {
        id: 'integration_salesforce',
        name: 'Salesforce CRM',
        type: 'crm',
        status: 'connected',
        provider: 'Salesforce',
        lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        dataFields: this.generateCRMFields(),
        syncFrequency: 'Every 15 minutes',
        recordsSynced: 1247,
        errors: []
      },
      {
        id: 'integration_hubspot',
        name: 'HubSpot Marketing',
        type: 'email',
        status: 'connected',
        provider: 'HubSpot',
        lastSync: new Date(Date.now() - 2 * 60 * 1000),
        dataFields: this.generateEmailFields(),
        syncFrequency: 'Real-time',
        recordsSynced: 892,
        errors: []
      },
      {
        id: 'integration_google_analytics',
        name: 'Google Analytics 4',
        type: 'analytics',
        status: 'connected',
        provider: 'Google',
        lastSync: new Date(Date.now() - 60 * 1000),
        dataFields: this.generateAnalyticsFields(),
        syncFrequency: 'Hourly',
        recordsSynced: 15623,
        errors: []
      },
      {
        id: 'integration_calendly',
        name: 'Calendly Meetings',
        type: 'calendar',
        status: 'error',
        provider: 'Calendly',
        lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        dataFields: this.generateCalendarFields(),
        syncFrequency: 'Real-time',
        recordsSynced: 156,
        errors: [
          {
            id: 'error_001',
            type: 'authentication',
            message: 'API token expired. Please reconnect your Calendly account.',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            resolved: false
          }
        ]
      },
      {
        id: 'integration_slack',
        name: 'Slack Notifications',
        type: 'chat',
        status: 'connected',
        provider: 'Slack',
        lastSync: new Date(Date.now() - 30 * 1000),
        dataFields: this.generateSlackFields(),
        syncFrequency: 'Real-time',
        recordsSynced: 67,
        errors: []
      }
    ];
  }

  private generateCRMFields(): IntegrationField[] {
    return [
      { field: 'firstName', mapped: true, destination: 'First_Name__c', lastUpdated: new Date() },
      { field: 'lastName', mapped: true, destination: 'Last_Name__c', lastUpdated: new Date() },
      { field: 'email', mapped: true, destination: 'Email__c', lastUpdated: new Date() },
      { field: 'company', mapped: true, destination: 'Company__c', lastUpdated: new Date() },
      { field: 'jobTitle', mapped: true, destination: 'Job_Title__c', lastUpdated: new Date() },
      { field: 'campaignSource', mapped: true, destination: 'Lead_Source__c', lastUpdated: new Date() },
      { field: 'linkedinProfile', mapped: false, destination: '', lastUpdated: new Date() }
    ];
  }

  private generateEmailFields(): IntegrationField[] {
    return [
      { field: 'email', mapped: true, destination: 'contact.email', lastUpdated: new Date() },
      { field: 'firstName', mapped: true, destination: 'contact.firstname', lastUpdated: new Date() },
      { field: 'lastName', mapped: true, destination: 'contact.lastname', lastUpdated: new Date() },
      { field: 'company', mapped: true, destination: 'contact.company', lastUpdated: new Date() },
      { field: 'industry', mapped: true, destination: 'contact.industry', lastUpdated: new Date() },
      { field: 'leadScore', mapped: true, destination: 'contact.hs_lead_status', lastUpdated: new Date() }
    ];
  }

  private generateAnalyticsFields(): IntegrationField[] {
    return [
      { field: 'campaignId', mapped: true, destination: 'utm_campaign', lastUpdated: new Date() },
      { field: 'adGroupId', mapped: true, destination: 'utm_content', lastUpdated: new Date() },
      { field: 'creativeId', mapped: true, destination: 'utm_term', lastUpdated: new Date() },
      { field: 'conversionValue', mapped: true, destination: 'purchase_value', lastUpdated: new Date() }
    ];
  }

  private generateCalendarFields(): IntegrationField[] {
    return [
      { field: 'meetingBooked', mapped: true, destination: 'event_type', lastUpdated: new Date() },
      { field: 'meetingDate', mapped: true, destination: 'scheduled_time', lastUpdated: new Date() },
      { field: 'attendeeEmail', mapped: true, destination: 'invitee_email', lastUpdated: new Date() }
    ];
  }

  private generateSlackFields(): IntegrationField[] {
    return [
      { field: 'alertType', mapped: true, destination: 'channel', lastUpdated: new Date() },
      { field: 'campaignName', mapped: true, destination: 'message_text', lastUpdated: new Date() },
      { field: 'alertPriority', mapped: true, destination: 'urgency', lastUpdated: new Date() }
    ];
  }

  // Generate synced records
  generateSyncedRecords(campaigns: any[]): SyncedRecord[] {
    const records: SyncedRecord[] = [];
    
    campaigns.forEach(campaign => {
      const recordCount = Math.floor(Math.random() * 20) + 5;
      
      for (let i = 0; i < recordCount; i++) {
        records.push({
          id: `record_${campaign.id}_${i + 1}`,
          type: this.getRandomRecordType(),
          source: 'LinkedIn Ads',
          destination: 'Salesforce CRM',
          campaignId: campaign.id,
          data: this.generateRecordData(),
          syncedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }
    });

    return records;
  }

  private getRandomRecordType(): SyncedRecord['type'] {
    const types: SyncedRecord['type'][] = ['lead', 'contact', 'opportunity', 'customer'];
    const weights = [0.6, 0.25, 0.1, 0.05]; // Most are leads
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < types.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        return types[i];
      }
    }
    
    return 'lead';
  }

  private generateRecordData(): any {
    const companies = ['TechCorp', 'DataSystems', 'CloudWorks', 'DevTools Inc', 'ScaleUp Ltd'];
    const jobTitles = ['Software Engineer', 'CTO', 'VP Engineering', 'Product Manager', 'DevOps Engineer'];
    
    return {
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
      email: this.generateEmail(),
      company: companies[Math.floor(Math.random() * companies.length)],
      jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      leadScore: Math.floor(Math.random() * 100),
      industry: 'Technology',
      source: 'LinkedIn Sponsored Content'
    };
  }

  private generateFirstName(): string {
    const names = ['John', 'Sarah', 'Michael', 'Jessica', 'David', 'Emma', 'Chris', 'Amanda'];
    return names[Math.floor(Math.random() * names.length)];
  }

  private generateLastName(): string {
    const names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    return names[Math.floor(Math.random() * names.length)];
  }

  private generateEmail(): string {
    const domains = ['techcorp.com', 'datasystems.io', 'cloudworks.net', 'devtools.com', 'scaleup.co'];
    const firstName = this.generateFirstName().toLowerCase();
    const lastName = this.generateLastName().toLowerCase();
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    return `${firstName}.${lastName}@${domain}`;
  }

  // Generate integration health insights
  generateIntegrationInsights(integrations: IntegrationConfig[]): Array<{
    type: 'health' | 'optimization' | 'error' | 'recommendation';
    title: string;
    description: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    const insights = [];
    
    // Check for errors
    const errorIntegrations = integrations.filter(i => i.status === 'error');
    if (errorIntegrations.length > 0) {
      insights.push({
        type: 'error' as const,
        title: 'Integration Authentication Error',
        description: `${errorIntegrations[0].name} requires reconnection due to expired credentials.`,
        action: 'Reconnect integration in settings',
        priority: 'high' as const
      });
    }
    
    // Check sync performance
    const slowSyncs = integrations.filter(i => {
      const timeSinceSync = Date.now() - i.lastSync.getTime();
      return timeSinceSync > 60 * 60 * 1000; // Over 1 hour
    });
    
    if (slowSyncs.length > 0) {
      insights.push({
        type: 'health' as const,
        title: 'Sync Performance Warning',
        description: `${slowSyncs[0].name} last synced ${Math.floor((Date.now() - slowSyncs[0].lastSync.getTime()) / (60 * 60 * 1000))} hours ago.`,
        action: 'Check integration health',
        priority: 'medium' as const
      });
    }
    
    // Optimization opportunities
    insights.push({
      type: 'optimization' as const,
      title: 'Lead Scoring Enhancement',
      description: 'Enable LinkedIn profile enrichment to improve lead scoring accuracy by 25%.',
      action: 'Configure LinkedIn profile sync',
      priority: 'medium' as const
    });
    
    insights.push({
      type: 'recommendation' as const,
      title: 'Webhook Configuration',
      description: 'Set up real-time webhooks for instant lead notifications instead of 15-minute delays.',
      action: 'Configure webhook endpoints',
      priority: 'low' as const
    });
    
    return insights;
  }

  // Simulate webhook events
  generateWebhookEvents(): Array<{
    id: string;
    type: 'lead.created' | 'contact.updated' | 'opportunity.closed' | 'meeting.scheduled';
    payload: any;
    timestamp: Date;
    source: string;
    processed: boolean;
  }> {
    return [
      {
        id: 'webhook_001',
        type: 'lead.created',
        payload: {
          leadId: 'lead_12345',
          email: 'sarah.johnson@techcorp.com',
          campaignId: 'camp_001',
          source: 'LinkedIn Sponsored Content'
        },
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        source: 'Salesforce',
        processed: true
      },
      {
        id: 'webhook_002',
        type: 'meeting.scheduled',
        payload: {
          meetingId: 'cal_789',
          attendeeEmail: 'michael.brown@cloudworks.net',
          scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          meetingType: 'Product Demo'
        },
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        source: 'Calendly',
        processed: true
      }
    ];
  }
}

export const integrationSimulator = new IntegrationSimulator();