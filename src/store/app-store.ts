import { create } from 'zustand';
import { authService, type UserProfile } from '../services/auth';
import { aiEngine, type AIInsight } from '../services/ai-engine';
import { automationEngine, type AutomationRule } from '../services/automation';

// Import demo data
import campaignsData from '../../data/campaigns.json';
import creativesData from '../../data/creatives.json';
import alertsData from '../../data/alerts.json';
import audienceData from '../../data/audience_insights.json';

interface AppState {
  // Authentication
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  isDemoMode: boolean;
  
  // Data
  campaigns: any[];
  creatives: any[];
  alerts: any[];
  audienceInsights: any;
  insights: AIInsight[];
  automationRules: AutomationRule[];
  
  // UI State
  activeTab: string;
  
  // Actions
  login: () => Promise<void>;
  loginDemo: () => void;
  logout: () => void;
  setUser: (user: UserProfile) => void;
  setCampaigns: (campaigns: any[]) => void;
  setInsights: (insights: AIInsight[]) => void;
  setActiveTab: (tab: string) => void;
  initializeApp: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  isLoading: false,
  isDemoMode: false,
  campaigns: [],
  creatives: [],
  alerts: [],
  audienceInsights: {},
  insights: [],
  automationRules: [],
  activeTab: 'dashboard',

  // Actions
  login: async () => {
    set({ isLoading: true });
    try {
      const authUrl = authService.getLinkedInAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
    }
  },

  loginDemo: () => {
    // Simulate demo login with mock user and data
    const mockUser: UserProfile = {
      id: 'demo_user_123',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@company.com',
      linkedinId: 'demo_linkedin_123'
    };

    set({ 
      isAuthenticated: true, 
      user: mockUser, 
      isDemoMode: true,
      campaigns: campaignsData,
      creatives: creativesData,
      alerts: alertsData,
      audienceInsights: audienceData
    });

    // Initialize AI context for demo
    aiEngine.initializeContext(mockUser.id, campaignsData);
    
    // Generate demo insights
    aiEngine.generateInsights(campaignsData).then(insights => {
      set({ insights });
    });

    // Initialize automation engine
    automationEngine.initializeDefaultRules();
    set({ automationRules: automationEngine.getRules() });

    console.log('Demo mode activated with simulated LinkedIn data');
  },

  logout: () => {
    if (!get().isDemoMode) {
      authService.logout();
    }
    set({
      isAuthenticated: false,
      user: null,
      isDemoMode: false,
      campaigns: [],
      creatives: [],
      alerts: [],
      audienceInsights: {},
      insights: [],
      automationRules: []
    });
  },

  setUser: (user: UserProfile) => {
    set({ user, isAuthenticated: true });
    
    // Initialize AI context
    aiEngine.initializeContext(user.id, get().campaigns);
  },

  setCampaigns: (campaigns: any[]) => {
    set({ campaigns });
    
    // Generate AI insights when campaigns are updated
    aiEngine.generateInsights(campaigns).then(insights => {
      set({ insights });
    });
  },

  setInsights: (insights: AIInsight[]) => {
    set({ insights });
  },

  setActiveTab: (activeTab: string) => {
    set({ activeTab });
  },

  initializeApp: async () => {
    set({ isLoading: true });
    
    try {
      // Check if user is already authenticated (non-demo mode)
      if (authService.isAuthenticated()) {
        const token = authService.getAccessToken();
        if (token) {
          // In production, fetch user profile
          const mockUser: UserProfile = {
            id: 'user123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            linkedinId: 'linkedin123'
          };
          
          get().setUser(mockUser);
          
          // Load cached campaigns or fetch from API
          const cachedCampaigns = localStorage.getItem('cached_campaigns');
          if (cachedCampaigns) {
            get().setCampaigns(JSON.parse(cachedCampaigns));
          }
          
          // Initialize automation engine
          automationEngine.initializeDefaultRules();
          set({ automationRules: automationEngine.getRules() });
        }
      }
    } catch (error) {
      console.error('App initialization error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  refreshData: async () => {
    const state = get();
    if (!state.isAuthenticated) return;

    set({ isLoading: true });
    
    try {
      if (state.isDemoMode) {
        // Refresh demo data (simulate API calls)
        console.log('Refreshing demo data...');
        
        // Simulate slight data changes for demo
        const updatedCampaigns = state.campaigns.map(campaign => ({
          ...campaign,
          metrics: {
            ...campaign.metrics,
            spend: campaign.metrics.spend + Math.random() * 100,
            clicks: campaign.metrics.clicks + Math.floor(Math.random() * 50)
          }
        }));
        
        set({ campaigns: updatedCampaigns });
        
        // Refresh insights
        const insights = await aiEngine.generateInsights(updatedCampaigns);
        set({ insights });
      } else {
        // In production, fetch fresh data from LinkedIn API
        // Refresh insights
        const insights = await aiEngine.generateInsights(state.campaigns);
        set({ insights });
      }
      
      // Update automation rules
      set({ automationRules: automationEngine.getRules() });
      
    } catch (error) {
      console.error('Data refresh error:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));

// Initialize app on load
if (typeof window !== 'undefined') {
  useAppStore.getState().initializeApp();
}