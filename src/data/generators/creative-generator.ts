import { Creative } from '../../types';

interface CreativeTemplate {
  type: string;
  headlinePatterns: string[];
  descriptionPatterns: string[];
  imageCategories: string[];
  performanceProfile: 'high' | 'medium' | 'low';
}

class CreativeDataGenerator {
  private templates: CreativeTemplate[] = [
    {
      type: 'single_image',
      headlinePatterns: [
        "Accelerate {action} with {solution}",
        "Transform Your {area} in {timeframe}",
        "{benefit} for {audience}",
        "The Future of {industry} is Here"
      ],
      descriptionPatterns: [
        "Join {number}+ {audience} using our platform to {action} faster than ever.",
        "Discover why top {industry} teams choose our {solution} for {use_case}.",
        "See how {industry} leaders are using our {solution} to {benefit}.",
        "Built for {audience} who demand {quality}. Try it free for {timeframe}."
      ],
      imageCategories: ['tech', 'business', 'analytics', 'team'],
      performanceProfile: 'high'
    },
    {
      type: 'video',
      headlinePatterns: [
        "Watch: {action} in {timeframe}",
        "See {solution} in Action",
        "{number} Minute Demo: {benefit}",
        "Live Demo: {solution}"
      ],
      descriptionPatterns: [
        "Watch our {timeframe} demo to see how {solution} can {benefit}.",
        "See real {audience} getting {result} with our platform.",
        "Live walkthrough of {feature} that's changing {industry}.",
        "Demo: How to {action} {percentage} faster."
      ],
      imageCategories: ['demo', 'screen', 'presentation'],
      performanceProfile: 'medium'
    },
    {
      type: 'carousel',
      headlinePatterns: [
        "{number} Ways to {action}",
        "Everything You Need to {goal}",
        "From {starting_point} to {end_goal}",
        "Complete {solution} Suite"
      ],
      descriptionPatterns: [
        "Explore {number} powerful features designed for {audience}.",
        "Everything you need to {action} in one integrated platform.",
        "See how our complete suite helps {audience} achieve {goal}.",
        "Discover the tools that {industry} leaders trust."
      ],
      imageCategories: ['features', 'workflow', 'integration'],
      performanceProfile: 'medium'
    }
  ];

  private variables = {
    action: ["Development", "Deployment", "Scaling", "Building", "Growing", "Optimizing"],
    solution: ["Cloud-Native Tools", "AI Platform", "Analytics Suite", "Integration Platform", "Security Suite"],
    area: ["Development Workflow", "Business Process", "Data Pipeline", "Security Framework"],
    timeframe: ["Minutes", "Days", "Weeks", "30 Days"],
    benefit: ["40% Cost Reduction", "3x Faster Deployment", "Zero Downtime", "Enterprise Security"],
    audience: ["Developers", "Engineering Teams", "CTOs", "Product Managers", "Data Scientists"],
    industry: ["Tech", "SaaS", "Enterprise", "Startup", "Enterprise"],
    number: ["50,000", "100,000", "500", "1,000", "10,000"],
    use_case: ["mission-critical applications", "rapid scaling", "data integration", "security compliance"],
    quality: ["reliability", "performance", "security", "scalability"],
    percentage: ["50%", "75%", "80%", "3x"],
    feature: ["automated deployment", "real-time analytics", "smart monitoring", "security scanning"],
    goal: ["Scale Faster", "Deploy Securely", "Monitor Effectively", "Integrate Seamlessly"],
    starting_point: ["Concept", "Development", "Testing"],
    end_goal: ["Production", "Scale", "Success"]
  };

  private imageUrls = {
    tech: [
      "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
      "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg"
    ],
    business: [
      "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
      "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg",
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
    ],
    analytics: [
      "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg",
      "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg",
      "https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg"
    ],
    team: [
      "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
      "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg",
      "https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg"
    ],
    demo: [
      "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg",
      "https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg"
    ],
    screen: [
      "https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg",
      "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg"
    ],
    presentation: [
      "https://images.pexels.com/photos/3861787/pexels-photo-3861787.jpeg"
    ],
    features: [
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
    ],
    workflow: [
      "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg"
    ],
    integration: [
      "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg"
    ]
  };

  generateCreatives(campaignIds?: string[]): Creative[] {
    // Use provided campaign IDs or generate default ones
    const campaigns = campaignIds || ['camp_001', 'camp_002', 'camp_003', 'camp_004'];
    const creatives: Creative[] = [];

    campaigns.forEach((campaignId, campaignIndex) => {
      // Generate 2-4 creatives per campaign
      const creativeCount = this.getRandomBetween(2, 5);
      
      for (let i = 0; i < creativeCount; i++) {
        const template = this.getRandomFromArray(this.templates);
        const creative = this.generateCreativeFromTemplate(template, campaignId, campaignIndex * 10 + i + 1);
        creatives.push(creative);
      }
    });

    return creatives;
  }

  private generateCreativeFromTemplate(template: CreativeTemplate, campaignId: string, index: number): Creative {
    const headline = this.generateText(this.getRandomFromArray(template.headlinePatterns));
    const description = this.generateText(this.getRandomFromArray(template.descriptionPatterns));
    const imageUrl = this.getRandomImageUrl(template.imageCategories);
    const performance = this.generatePerformance(template.performanceProfile);

    return {
      id: `creative_${String(index).padStart(3, '0')}`,
      campaign_id: campaignId,
      type: template.type,
      headline,
      description,
      image_url: imageUrl,
      performance,
      status: this.getRandomStatus()
    };
  }

  private generateText(pattern: string): string {
    let text = pattern;
    
    // Replace all variables in the pattern
    Object.entries(this.variables).forEach(([key, values]) => {
      const placeholder = `{${key}}`;
      if (text.includes(placeholder)) {
        text = text.replace(placeholder, this.getRandomFromArray(values));
      }
    });

    return text;
  }

  private getRandomImageUrl(categories: string[]): string {
    const category = this.getRandomFromArray(categories);
    const urls = this.imageUrls[category as keyof typeof this.imageUrls] || this.imageUrls.tech;
    return this.getRandomFromArray(urls);
  }

  private generatePerformance(profile: 'high' | 'medium' | 'low') {
    let baseCTR: number;
    let baseCPC: number;

    switch (profile) {
      case 'high':
        baseCTR = this.getRandomBetween(3.0, 4.5);
        baseCPC = this.getRandomBetween(4.00, 6.50);
        break;
      case 'medium':
        baseCTR = this.getRandomBetween(2.0, 3.0);
        baseCPC = this.getRandomBetween(5.00, 7.50);
        break;
      case 'low':
        baseCTR = this.getRandomBetween(1.0, 2.0);
        baseCPC = this.getRandomBetween(6.50, 9.00);
        break;
    }

    const impressions = this.getRandomBetween(30000, 60000);
    const clicks = Math.round(impressions * (baseCTR / 100));

    return {
      impressions,
      clicks,
      ctr: Math.round(baseCTR * 100) / 100,
      cpc: Math.round(baseCPC * 100) / 100
    };
  }

  private getRandomStatus(): Creative['status'] {
    return Math.random() > 0.1 ? 'active' : 'paused'; // 90% active
  }

  private getRandomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // A/B test variations generator
  generateCreativeVariations(baseCreative: Creative, count: number = 3): Creative[] {
    const variations: Creative[] = [];
    
    for (let i = 0; i < count; i++) {
      const variation = { ...baseCreative };
      variation.id = `${baseCreative.id}_var_${i + 1}`;
      
      // Vary headline
      if (Math.random() > 0.5) {
        variation.headline = this.generateText(this.getRandomFromArray(this.templates[0].headlinePatterns));
      }
      
      // Vary description
      if (Math.random() > 0.5) {
        variation.description = this.generateText(this.getRandomFromArray(this.templates[0].descriptionPatterns));
      }
      
      // Slightly vary performance
      const performanceVariation = this.getRandomBetween(0.8, 1.2);
      variation.performance = {
        ...variation.performance,
        ctr: Math.round(variation.performance.ctr * performanceVariation * 100) / 100,
        clicks: Math.round(variation.performance.clicks * performanceVariation)
      };
      
      variations.push(variation);
    }
    
    return variations;
  }
}

export const creativeDataGenerator = new CreativeDataGenerator();