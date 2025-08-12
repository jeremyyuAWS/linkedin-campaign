interface LinkedInAuthResponse {
  access_token: string;
  expires_in: number;
  scope: string;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  linkedinId: string;
}

class AuthService {
  private readonly clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
  private readonly redirectUri = import.meta.env.VITE_LINKEDIN_REDIRECT_URI;
  private readonly scope = 'r_liteprofile r_ads r_ads_reporting r_organization_social';

  // Generate LinkedIn OAuth URL
  getLinkedInAuthUrl(): string {
    const state = this.generateState();
    localStorage.setItem('oauth_state', state);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state,
      scope: this.scope
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string, state: string): Promise<LinkedInAuthResponse> {
    const storedState = localStorage.getItem('oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    // In production, this would be a secure backend call
    const response = await fetch('/api/auth/linkedin/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: this.clientId,
        client_secret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await response.json();
    this.storeTokens(tokenData);
    return tokenData;
  }

  // Get user profile information
  async getUserProfile(accessToken: string): Promise<UserProfile> {
    const response = await fetch('/api/linkedin/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }

  // Store tokens securely
  private storeTokens(tokenData: LinkedInAuthResponse): void {
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);
    
    localStorage.setItem('linkedin_access_token', tokenData.access_token);
    localStorage.setItem('linkedin_token_expires_at', expiresAt.toString());
    localStorage.setItem('linkedin_scope', tokenData.scope);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('linkedin_access_token');
    const expiresAt = localStorage.getItem('linkedin_token_expires_at');
    
    if (!token || !expiresAt) return false;
    
    return Date.now() < parseInt(expiresAt);
  }

  // Get current access token
  getAccessToken(): string | null {
    if (!this.isAuthenticated()) return null;
    return localStorage.getItem('linkedin_access_token');
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('linkedin_access_token');
    localStorage.removeItem('linkedin_token_expires_at');
    localStorage.removeItem('linkedin_scope');
    localStorage.removeItem('oauth_state');
    localStorage.removeItem('user_profile');
  }

  // Generate random state for OAuth security
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Refresh token if needed
  async refreshTokenIfNeeded(): Promise<void> {
    const expiresAt = localStorage.getItem('linkedin_token_expires_at');
    if (!expiresAt) return;

    const timeUntilExpiry = parseInt(expiresAt) - Date.now();
    const oneHour = 60 * 60 * 1000;

    // Refresh if expiring within an hour
    if (timeUntilExpiry < oneHour) {
      // In production, implement refresh token logic
      console.log('Token refresh needed');
    }
  }
}

export const authService = new AuthService();
export type { UserProfile, LinkedInAuthResponse };