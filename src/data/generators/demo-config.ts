// Configuration for different demo scenarios and data generation

export interface DemoConfig {
  mode: 'static' | 'generated' | 'scenario';
  scenario?: string;
  dataRefreshInterval?: number; // minutes
  realtimeUpdates: boolean;
  apiSimulation: {
    enabled: boolean;
    latency: number; // ms
    errorRate: number; // percentage
  };
  campaigns: {
    count: number;
    performanceVariation: 'low' | 'medium' | 'high';
    includeProblematicCampaigns: boolean;
  };
  alerts: {
    count: number;
    includeRealTime: boolean;
    severityDistribution: {
      high: number;
      medium: number;
      low: number;
    };
  };
  audience: {
    jobTitleCount: number;
    companySizeCount: number;
    includeExpansionSuggestions: boolean;
  };
  features: {
    automation: boolean;
    predictiveAnalytics: boolean;
    crossCampaignOptimization: boolean;
  };
}

export const defaultDemoConfig: DemoConfig = {
  mode: 'generated',
  realtimeUpdates: true,
  dataRefreshInterval: 15,
  apiSimulation: {
    enabled: true,
    latency: 800,
    errorRate: 2
  },
  campaigns: {
    count: 4,
    performanceVariation: 'medium',
    includeProblematicCampaigns: true
  },
  alerts: {
    count: 5,
    includeRealTime: true,
    severityDistribution: {
      high: 30,
      medium: 50,
      low: 20
    }
  },
  audience: {
    jobTitleCount: 8,
    companySizeCount: 6,
    includeExpansionSuggestions: true
  },
  features: {
    automation: true,
    predictiveAnalytics: true,
    crossCampaignOptimization: true
  }
};

// Demo presets for different use cases
export const demoPresets: { [key: string]: Partial<DemoConfig> } = {
  sales_demo: {
    mode: 'scenario',
    scenario: 'high_performance',
    campaigns: {
      count: 3,
      performanceVariation: 'low',
      includeProblematicCampaigns: false
    },
    apiSimulation: {
      latency: 300,
      errorRate: 0
    }
  },
  
  technical_demo: {
    mode: 'generated',
    realtimeUpdates: true,
    campaigns: {
      count: 6,
      performanceVariation: 'high',
      includeProblematicCampaigns: true
    },
    features: {
      automation: true,
      predictiveAnalytics: true,
      crossCampaignOptimization: true
    }
  },
  
  problem_solving_demo: {
    mode: 'scenario',
    scenario: 'optimization_needed',
    alerts: {
      count: 8,
      includeRealTime: true,
      severityDistribution: {
        high: 60,
        medium: 30,
        low: 10
      }
    }
  },
  
  scaling_demo: {
    mode: 'scenario',
    scenario: 'audience_expansion',
    audience: {
      jobTitleCount: 12,
      companySizeCount: 8,
      includeExpansionSuggestions: true
    }
  }
};

class DemoConfigManager {
  private currentConfig: DemoConfig;

  constructor(initialConfig: DemoConfig = defaultDemoConfig) {
    this.currentConfig = { ...initialConfig };
  }

  // Apply a preset configuration
  applyPreset(presetName: string): void {
    const preset = demoPresets[presetName];
    if (preset) {
      this.currentConfig = { ...this.currentConfig, ...preset };
      console.log(`Applied demo preset: ${presetName}`);
    } else {
      console.warn(`Demo preset not found: ${presetName}`);
    }
  }

  // Update specific configuration
  updateConfig(updates: Partial<DemoConfig>): void {
    this.currentConfig = { ...this.currentConfig, ...updates };
    console.log('Demo configuration updated:', updates);
  }

  // Get current configuration
  getConfig(): DemoConfig {
    return { ...this.currentConfig };
  }

  // Reset to default
  resetToDefault(): void {
    this.currentConfig = { ...defaultDemoConfig };
    console.log('Demo configuration reset to default');
  }

  // Configuration validators
  isFeatureEnabled(feature: keyof DemoConfig['features']): boolean {
    return this.currentConfig.features[feature];
  }

  getCampaignCount(): number {
    return this.currentConfig.campaigns.count;
  }

  getApiLatency(): number {
    return this.currentConfig.apiSimulation.latency;
  }

  // Dynamic configuration based on audience
  configureForAudience(audienceType: 'sales' | 'technical' | 'executive'): void {
    switch (audienceType) {
      case 'sales':
        this.applyPreset('sales_demo');
        break;
      case 'technical':
        this.applyPreset('technical_demo');
        break;
      case 'executive':
        this.updateConfig({
          apiSimulation: { enabled: false, latency: 0, errorRate: 0 },
          campaigns: { count: 3, performanceVariation: 'low', includeProblematicCampaigns: false }
        });
        break;
    }
  }

  // Time-based configuration
  configureForDuration(minutes: number): void {
    if (minutes <= 15) {
      // Quick demo - focus on key features
      this.updateConfig({
        campaigns: { count: 3, performanceVariation: 'low', includeProblematicCampaigns: false },
        alerts: { count: 3, includeRealTime: false, severityDistribution: { high: 70, medium: 30, low: 0 } }
      });
    } else if (minutes <= 30) {
      // Standard demo
      this.applyPreset('technical_demo');
    } else {
      // Deep dive demo - show everything
      this.updateConfig({
        campaigns: { count: 8, performanceVariation: 'high', includeProblematicCampaigns: true },
        features: { automation: true, predictiveAnalytics: true, crossCampaignOptimization: true }
      });
    }
  }
}

export const demoConfigManager = new DemoConfigManager();

// Export utility functions
export function createCustomConfig(overrides: Partial<DemoConfig>): DemoConfig {
  return { ...defaultDemoConfig, ...overrides };
}

export function validateConfig(config: DemoConfig): boolean {
  try {
    // Validate required fields
    if (!config.mode || !config.campaigns || !config.alerts) {
      return false;
    }

    // Validate ranges
    if (config.campaigns.count < 1 || config.campaigns.count > 20) {
      return false;
    }

    if (config.apiSimulation.errorRate < 0 || config.apiSimulation.errorRate > 100) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}