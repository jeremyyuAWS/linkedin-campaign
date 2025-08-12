import React, { useState } from 'react';
import { Edit3, Copy, TrendingUp, Eye, Sparkles, BarChart3, Target, Zap, AlertTriangle, CheckCircle, Upload, Play, Pause, Download, Filter, Plus, X, FileImage, Video, Mic, Brain, Award, Clock, Lightbulb, RefreshCw, Share2 } from 'lucide-react';
import { Creative } from '../types';

interface CreativeLabProps {
  creatives: Creative[];
}

interface CreativeAnalysis {
  id: string;
  performanceScore: number;
  fatigueLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  elementAnalysis: {
    headline: { score: number; suggestions: string[]; sentiment: string; length: number; };
    description: { score: number; suggestions: string[]; sentiment: string; length: number; };
    image: { score: number; suggestions: string[]; composition: string; colorScheme: string; };
    cta: { score: number; suggestions: string[]; urgency: string; clarity: string; };
  };
  competitorAnalysis: {
    uniqueness: number;
    marketPosition: string;
    differentiators: string[];
  };
  audienceAlignment: {
    score: number;
    demographics: string[];
    psychographics: string[];
    resonanceFactors: string[];
  };
  optimizationPotential: {
    quickWins: Array<{ action: string; impact: string; effort: string; }>;
    longTermImprovements: Array<{ action: string; impact: string; timeframe: string; }>;
  };
  predictedPerformance: {
    expectedCTR: number;
    confidenceInterval: [number, number];
    factors: string[];
  };
}

interface AssetLibraryItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  size: string;
  uploadDate: string;
  usedInCampaigns: number;
  performance: {
    ctr: number;
    impressions: number;
    clicks: number;
  };
  tags: string[];
}

interface ABTest {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  variants: {
    id: string;
    name: string;
    type: 'control' | 'variant';
    creative: Creative;
    metrics: {
      impressions: number;
      clicks: number;
      ctr: number;
      conversions: number;
      cost: number;
    };
    trafficSplit: number;
  }[];
  confidence: number;
  significance: number;
  winner?: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (asset: Omit<AssetLibraryItem, 'id' | 'uploadDate' | 'performance'>) => void;
}

interface CreateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatives: Creative[];
  onCreateTest: (test: Omit<ABTest, 'id' | 'confidence' | 'significance'>) => void;
}

function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [uploadData, setUploadData] = useState({
    name: '',
    type: 'image' as 'image' | 'video' | 'gif',
    url: '',
    size: '',
    tags: '',
    usedInCampaigns: 0
  });
  const [dragActive, setDragActive] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      setUploadData(prev => ({
        ...prev,
        name: file.name,
        type: file.type.startsWith('video/') ? 'video' : file.type === 'image/gif' ? 'gif' : 'image',
        size: `${Math.round(file.size / 1024)}KB`,
        url: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpload({
      ...uploadData,
      tags: uploadData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
    setUploadData({ name: '', type: 'image', url: '', size: '', tags: '', usedInCampaigns: 0 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Upload Creative Asset</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to upload</p>
            <p className="text-sm text-gray-600">Support for images, videos, and GIFs up to 10MB</p>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploadData(prev => ({
                    ...prev,
                    name: file.name,
                    type: file.type.startsWith('video/') ? 'video' : file.type === 'image/gif' ? 'gif' : 'image',
                    size: `${Math.round(file.size / 1024)}KB`,
                    url: URL.createObjectURL(file)
                  }));
                }
              }}
            />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name</label>
              <input
                type="text"
                value={uploadData.name}
                onChange={(e) => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter asset name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
              <select
                value={uploadData.type}
                onChange={(e) => setUploadData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="gif">GIF</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={uploadData.tags}
              onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="AI, Technology, Professional, Blue"
            />
          </div>

          {uploadData.url && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img src={uploadData.url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateTestModal({ isOpen, onClose, creatives, onCreateTest }: CreateTestModalProps) {
  const [testData, setTestData] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    controlCreative: '',
    variantCreative: '',
    testType: 'headline' as 'headline' | 'image' | 'description' | 'cta',
    trafficSplit: 50
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const controlCreative = creatives.find(c => c.id === testData.controlCreative);
    const variantCreative = creatives.find(c => c.id === testData.variantCreative);
    
    if (!controlCreative || !variantCreative) return;

    const newTest: Omit<ABTest, 'id' | 'confidence' | 'significance'> = {
      name: testData.name,
      status: 'draft',
      startDate: testData.startDate,
      endDate: testData.endDate || undefined,
      variants: [
        {
          id: 'control',
          name: 'Control',
          type: 'control',
          creative: controlCreative,
          metrics: { impressions: 0, clicks: 0, ctr: 0, conversions: 0, cost: 0 },
          trafficSplit: testData.trafficSplit
        },
        {
          id: 'variant',
          name: 'Variant',
          type: 'variant',
          creative: variantCreative,
          metrics: { impressions: 0, clicks: 0, ctr: 0, conversions: 0, cost: 0 },
          trafficSplit: 100 - testData.trafficSplit
        }
      ]
    };

    onCreateTest(newTest);
    setTestData({
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      controlCreative: '',
      variantCreative: '',
      testType: 'headline',
      trafficSplit: 50
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create A/B Test</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
              <input
                type="text"
                value={testData.name}
                onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Headline A vs B Test"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
              <select
                value={testData.testType}
                onChange={(e) => setTestData(prev => ({ ...prev, testType: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="headline">Headlines</option>
                <option value="image">Images</option>
                <option value="description">Descriptions</option>
                <option value="cta">Call-to-Action</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={testData.startDate}
                onChange={(e) => setTestData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date (optional)</label>
              <input
                type="date"
                value={testData.endDate}
                onChange={(e) => setTestData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Traffic Split</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="90"
                value={testData.trafficSplit}
                onChange={(e) => setTestData(prev => ({ ...prev, trafficSplit: parseInt(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 min-w-[120px]">
                {testData.trafficSplit}% / {100 - testData.trafficSplit}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Control Creative</label>
              <select
                value={testData.controlCreative}
                onChange={(e) => setTestData(prev => ({ ...prev, controlCreative: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select control creative</option>
                {creatives.map(creative => (
                  <option key={creative.id} value={creative.id}>
                    {creative.headline.substring(0, 50)}...
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Variant Creative</label>
              <select
                value={testData.variantCreative}
                onChange={(e) => setTestData(prev => ({ ...prev, variantCreative: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select variant creative</option>
                {creatives.map(creative => (
                  <option key={creative.id} value={creative.id}>
                    {creative.headline.substring(0, 50)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreativeLab({ creatives }: CreativeLabProps) {
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'analyzer' | 'library' | 'testing'>('overview');
  const [analysisResults, setAnalysisResults] = useState<CreativeAnalysis | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<'all' | 'image' | 'video' | 'gif'>('all');
  const [selectedTestStatus, setSelectedTestStatus] = useState<'all' | 'running' | 'completed' | 'draft'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateTestModal, setShowCreateTestModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assetLibrary, setAssetLibrary] = useState<AssetLibraryItem[]>([
    {
      id: 'asset_001',
      name: 'AI Platform Hero Image',
      type: 'image',
      url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
      size: '1200x628',
      uploadDate: '2024-01-15',
      usedInCampaigns: 3,
      performance: { ctr: 4.2, impressions: 45000, clicks: 1890 },
      tags: ['AI', 'Technology', 'Blue', 'Professional']
    },
    {
      id: 'asset_002',
      name: 'Team Collaboration Photo',
      type: 'image',
      url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
      size: '1200x628',
      uploadDate: '2024-01-12',
      usedInCampaigns: 2,
      performance: { ctr: 3.8, impressions: 32000, clicks: 1216 },
      tags: ['Team', 'Collaboration', 'Office', 'Diverse']
    }
  ]);
  const [abTests, setAbTests] = useState<ABTest[]>([
    {
      id: 'test_001',
      name: 'AI Platform Headlines Test',
      status: 'running',
      startDate: '2024-01-10',
      variants: [
        {
          id: 'var_001_a',
          name: 'Control - Original',
          type: 'control',
          creative: creatives[0],
          metrics: { impressions: 25000, clicks: 750, ctr: 3.0, conversions: 45, cost: 3750 },
          trafficSplit: 50
        },
        {
          id: 'var_001_b',
          name: 'Variant - AI-Powered',
          type: 'variant',
          creative: { ...creatives[0], headline: 'AI-Powered Development Platform' },
          metrics: { impressions: 25000, clicks: 900, ctr: 3.6, conversions: 58, cost: 3750 },
          trafficSplit: 50
        }
      ],
      confidence: 87,
      significance: 0.05,
      winner: 'var_001_b'
    }
  ]);

  const performanceGrades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D'];
  
  const aiSuggestions = {
    headlines: [
      "Transform Your Development in 30 Days",
      "Join 50,000+ Teams Building Faster",
      "Boost Team Productivity by 40%",
      "The Future of Software Development",
      "Cut Deployment Time by 80%"
    ],
    descriptions: [
      "Discover why top engineering teams choose our platform for mission-critical applications.",
      "From code to production in one click. Experience the future of software development.",
      "Cut deployment time by 80% with automated CI/CD pipelines and intelligent scaling.",
      "Trusted by unicorn startups and Fortune 500 companies worldwide.",
      "Join the revolution in cloud-native development. Start your free trial today."
    ]
  };

  const generateCreativeAnalysis = (creative: Creative): CreativeAnalysis => {
    const baseScore = creative.performance.ctr * 25;
    const variation = Math.random() * 20 - 10;
    const performanceScore = Math.max(0, Math.min(100, baseScore + variation));
    
    const fatigueLevel = performanceScore > 75 ? 'low' : performanceScore > 50 ? 'medium' : 'high';
    
    return {
      id: creative.id,
      performanceScore: Math.round(performanceScore),
      fatigueLevel,
      recommendations: [
        'Test outcome-focused headlines for higher engagement',
        'Add social proof elements to build credibility',
        'Consider video format for increased attention',
        'A/B test call-to-action button text',
        'Include specific metrics in messaging',
        'Test different emotional appeals'
      ],
      elementAnalysis: {
        headline: {
          score: Math.round(performanceScore + Math.random() * 10 - 5),
          suggestions: [
            'Include specific metrics (e.g., "40% faster")',
            'Add urgency or time-bound elements',
            'Test question-based headlines',
            'Consider benefit-driven approach'
          ],
          sentiment: Math.random() > 0.6 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative',
          length: creative.headline.length
        },
        description: {
          score: Math.round(performanceScore + Math.random() * 10 - 5),
          suggestions: [
            'Highlight unique value proposition',
            'Use customer success language',
            'Add credibility indicators',
            'Include call-to-action flow'
          ],
          sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
          length: creative.description.length
        },
        image: {
          score: Math.round(performanceScore + Math.random() * 10 - 5),
          suggestions: [
            'Show product in action',
            'Include diverse team representation',
            'Test different color schemes',
            'Consider lifestyle vs product focus'
          ],
          composition: Math.random() > 0.5 ? 'balanced' : Math.random() > 0.5 ? 'left-focused' : 'center-focused',
          colorScheme: Math.random() > 0.6 ? 'blue-dominant' : Math.random() > 0.3 ? 'multi-color' : 'monochrome'
        },
        cta: {
          score: Math.round(performanceScore + Math.random() * 10 - 5),
          suggestions: [
            'Use action-oriented language',
            'Test "Start Free Trial" vs "Get Demo"',
            'Add value proposition to CTA',
            'Test button color variations'
          ],
          urgency: Math.random() > 0.5 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
          clarity: Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : 'needs improvement'
        }
      },
      competitorAnalysis: {
        uniqueness: Math.round(Math.random() * 40 + 60), // 60-100%
        marketPosition: Math.random() > 0.5 ? 'differentiated' : Math.random() > 0.5 ? 'competitive' : 'needs positioning',
        differentiators: [
          'Technical depth of messaging',
          'Specific outcome focus',
          'Developer-centric language',
          'Enterprise credibility signals'
        ]
      },
      audienceAlignment: {
        score: Math.round(Math.random() * 30 + 70), // 70-100
        demographics: ['Software Engineers', 'Technical Leaders', 'Product Managers'],
        psychographics: ['Innovation-driven', 'Efficiency-focused', 'Quality-conscious'],
        resonanceFactors: [
          'Technical accuracy',
          'Time-saving benefits',
          'Scalability messaging',
          'Team productivity focus'
        ]
      },
      optimizationPotential: {
        quickWins: [
          { action: 'Add specific metrics to headline', impact: '+15-25% CTR', effort: 'Low' },
          { action: 'Include social proof in description', impact: '+10-20% trust', effort: 'Low' },
          { action: 'Test urgent CTA language', impact: '+8-15% clicks', effort: 'Low' },
          { action: 'Optimize image contrast', impact: '+5-12% attention', effort: 'Medium' }
        ],
        longTermImprovements: [
          { action: 'Create video variation', impact: '+30-50% engagement', timeframe: '2-3 weeks' },
          { action: 'Develop interactive demo', impact: '+40-60% conversion', timeframe: '4-6 weeks' },
          { action: 'A/B test messaging themes', impact: '+20-35% performance', timeframe: '3-4 weeks' }
        ]
      },
      predictedPerformance: {
        expectedCTR: Math.round((creative.performance.ctr * (1 + Math.random() * 0.4 - 0.2)) * 100) / 100,
        confidenceInterval: [
          Math.round((creative.performance.ctr * 0.8) * 100) / 100,
          Math.round((creative.performance.ctr * 1.3) * 100) / 100
        ],
        factors: [
          'Audience targeting alignment',
          'Market timing',
          'Competitive landscape',
          'Seasonal trends',
          'Platform algorithm changes'
        ]
      }
    };
  };

  const handleAnalyzeCreative = (creative: Creative) => {
    setSelectedCreative(creative);
    setIsAnalyzing(true);
    setActiveView('analyzer');
    
    // Simulate AI analysis delay
    setTimeout(() => {
      setAnalysisResults(generateCreativeAnalysis(creative));
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleUploadAsset = (asset: Omit<AssetLibraryItem, 'id' | 'uploadDate' | 'performance'>) => {
    const newAsset: AssetLibraryItem = {
      ...asset,
      id: `asset_${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      performance: { ctr: 0, impressions: 0, clicks: 0 }
    };
    setAssetLibrary(prev => [newAsset, ...prev]);
  };

  const handleCreateTest = (test: Omit<ABTest, 'id' | 'confidence' | 'significance'>) => {
    const newTest: ABTest = {
      ...test,
      id: `test_${Date.now()}`,
      confidence: 0,
      significance: 0.05
    };
    setAbTests(prev => [newTest, ...prev]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getFatigueColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredAssets = assetLibrary.filter(asset => 
    selectedAssetType === 'all' || asset.type === selectedAssetType
  );

  const filteredTests = abTests.filter(test => 
    selectedTestStatus === 'all' || test.status === selectedTestStatus
  );

  return (
    <div className="space-y-6">
      {/* Header with AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Creative Intelligence</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Headlines with "AI-Powered" show 34% higher engagement than generic tech terms. 
              Consider emphasizing specific outcomes like "40% cost reduction" for better conversion rates.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                High-performing elements detected
              </span>
              <span className="flex items-center gap-1 text-blue-600">
                <Target className="w-4 h-4" />
                3 optimization opportunities
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Performance Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'analyzer', label: 'AI Analyzer', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'library', label: 'Asset Library', icon: <Copy className="w-4 h-4" /> },
            { id: 'testing', label: 'A/B Testing', icon: <Target className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeView === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active view */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">3.2%</p>
              <p className="text-sm text-gray-600">Avg CTR</p>
              <p className="text-xs text-green-600 mt-1">+18% vs benchmark</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{creatives.length}</p>
              <p className="text-sm text-gray-600">Active Creatives</p>
              <p className="text-xs text-gray-500 mt-1">Across 4 campaigns</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">2</p>
              <p className="text-sm text-gray-600">Need Refresh</p>
              <p className="text-xs text-yellow-600 mt-1">Fatigue detected</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{abTests.length}</p>
              <p className="text-sm text-gray-600">Tests Running</p>
              <p className="text-xs text-blue-600 mt-1">2 ready for results</p>
            </div>
          </div>

          {/* Creative Performance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {creatives.map((creative) => {
              const performanceScore = Math.round(creative.performance.ctr * 25 + Math.random() * 10);
              const grade = performanceGrades[Math.floor((100 - performanceScore) / 15)] || 'F';
              
              return (
                <div key={creative.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-200">
                  {/* Creative Image */}
                  <div className="aspect-video bg-gray-100 overflow-hidden relative">
                    <img 
                      src={creative.image_url} 
                      alt={creative.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${getScoreColor(performanceScore)}`}>
                        {grade}
                      </span>
                    </div>
                  </div>
                  
                  {/* Creative Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{creative.headline}</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">{creative.description}</p>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">CTR</p>
                        <p className="text-sm font-bold text-gray-900">{creative.performance.ctr.toFixed(2)}%</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">CPC</p>
                        <p className="text-sm font-bold text-gray-900">${creative.performance.cpc.toFixed(2)}</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">Score</p>
                        <p className={`text-sm font-bold ${getScoreColor(performanceScore).split(' ')[0]}`}>
                          {performanceScore}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAnalyzeCreative(creative)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm">AI Analyze</span>
                      </button>
                      <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeView === 'analyzer' && (
        <div className="space-y-6">
          {/* Analysis Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">AI Creative Analyzer</h3>
                  <p className="text-gray-600">
                    {selectedCreative ? `Analyzing: ${selectedCreative.headline.substring(0, 50)}...` : 'Select a creative to analyze'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {selectedCreative && (
                  <button
                    onClick={() => handleAnalyzeCreative(selectedCreative)}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    Re-analyze
                  </button>
                )}
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share Report
                </button>
              </div>
            </div>
          </div>

          {isAnalyzing ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AI Analysis in Progress</h3>
                <p className="text-gray-600 max-w-md">
                  Our AI is analyzing headline effectiveness, image composition, audience alignment, and optimization opportunities...
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          ) : !analysisResults ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analysis Selected</h3>
              <p className="text-gray-600 mb-6">Choose a creative from the overview tab to see detailed AI analysis</p>
              <button
                onClick={() => setActiveView('overview')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Select Creative
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Performance Score */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Overall Performance Analysis</h3>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getScoreColor(analysisResults.performanceScore)}`}>
                      {analysisResults.performanceScore}/100
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 mb-1">{analysisResults.performanceScore}</p>
                    <p className="text-sm text-gray-600">Performance Score</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${analysisResults.performanceScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 mb-1">{analysisResults.competitorAnalysis.uniqueness}%</p>
                    <p className="text-sm text-gray-600">Market Uniqueness</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${analysisResults.competitorAnalysis.uniqueness}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 mb-1">{analysisResults.audienceAlignment.score}%</p>
                    <p className="text-sm text-gray-600">Audience Alignment</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${analysisResults.audienceAlignment.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Element Analysis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Element-by-Element Analysis</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(analysisResults.elementAnalysis).map(([element, analysis]) => (
                    <div key={element} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 capitalize">{element}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(analysis.score)}`}>
                          {analysis.score}/100
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {element === 'headline' && (
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600">Sentiment</p>
                              <p className="font-semibold capitalize">{analysis.sentiment}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Length</p>
                              <p className="font-semibold">{analysis.length} chars</p>
                            </div>
                          </div>
                        )}
                        
                        {element === 'description' && (
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600">Sentiment</p>
                              <p className="font-semibold capitalize">{analysis.sentiment}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Length</p>
                              <p className="font-semibold">{analysis.length} chars</p>
                            </div>
                          </div>
                        )}
                        
                        {element === 'image' && (
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600">Composition</p>
                              <p className="font-semibold capitalize">{analysis.composition}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Color Scheme</p>
                              <p className="font-semibold capitalize">{analysis.colorScheme}</p>
                            </div>
                          </div>
                        )}
                        
                        {element === 'cta' && (
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-600">Urgency</p>
                              <p className="font-semibold capitalize">{analysis.urgency}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Clarity</p>
                              <p className="font-semibold capitalize">{analysis.clarity}</p>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-xs text-gray-600 mb-2">Top Suggestions:</p>
                          <ul className="space-y-1">
                            {analysis.suggestions.slice(0, 2).map((suggestion, idx) => (
                              <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                                <Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optimization Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Wins */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Quick Wins
                  </h3>
                  <div className="space-y-4">
                    {analysisResults.optimizationPotential.quickWins.map((win, index) => (
                      <div key={index} className="p-4 border border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-green-900">{win.action}</h4>
                          <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                            {win.effort}
                          </span>
                        </div>
                        <p className="text-sm text-green-700 font-medium">{win.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Long-term Improvements */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Long-term Improvements
                  </h3>
                  <div className="space-y-4">
                    {analysisResults.optimizationPotential.longTermImprovements.map((improvement, index) => (
                      <div key={index} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-blue-900">{improvement.action}</h4>
                          <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                            {improvement.timeframe}
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 font-medium">{improvement.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Predicted Performance */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Performance Prediction
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600 mb-1">
                      {analysisResults.predictedPerformance.expectedCTR}%
                    </p>
                    <p className="text-sm text-gray-600">Expected CTR</p>
                    <p className="text-xs text-purple-700 mt-1">
                      Range: {analysisResults.predictedPerformance.confidenceInterval[0]}% - {analysisResults.predictedPerformance.confidenceInterval[1]}%
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600 mb-1">85%</p>
                    <p className="text-sm text-gray-600">Confidence Level</p>
                    <p className="text-xs text-purple-700 mt-1">Based on historical data</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600 mb-1">
                      {Math.round((analysisResults.predictedPerformance.expectedCTR - (selectedCreative?.performance.ctr || 0)) / (selectedCreative?.performance.ctr || 1) * 100)}%
                    </p>
                    <p className="text-sm text-gray-600">Improvement Potential</p>
                    <p className="text-xs text-purple-700 mt-1">vs current performance</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Key Performance Factors:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.predictedPerformance.factors.map((factor, index) => (
                      <span key={index} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Audience Alignment */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Audience Alignment Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Demographics</h4>
                    <div className="space-y-2">
                      {analysisResults.audienceAlignment.demographics.map((demo, index) => (
                        <span key={index} className="block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                          {demo}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Psychographics</h4>
                    <div className="space-y-2">
                      {analysisResults.audienceAlignment.psychographics.map((psycho, index) => (
                        <span key={index} className="block px-3 py-1 text-sm bg-green-100 text-green-800 rounded">
                          {psycho}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Resonance Factors</h4>
                    <div className="space-y-2">
                      {analysisResults.audienceAlignment.resonanceFactors.map((factor, index) => (
                        <span key={index} className="block px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeView === 'library' && (
        <div className="space-y-6">
          {/* Asset Library Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Creative Asset Library</h3>
                <p className="text-gray-600">Manage and track performance of your creative assets</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedAssetType}
                  onChange={(e) => setSelectedAssetType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Assets</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="gif">GIFs</option>
                </select>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Asset
                </button>
              </div>
            </div>

            {/* Asset Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{assetLibrary.length}</p>
                <p className="text-sm text-gray-600">Total Assets</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{assetLibrary.filter(a => a.performance.ctr > 4.0).length}</p>
                <p className="text-sm text-gray-600">High Performers</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{assetLibrary.filter(a => a.performance.ctr < 3.0).length}</p>
                <p className="text-sm text-gray-600">Need Refresh</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{assetLibrary.reduce((sum, a) => sum + a.usedInCampaigns, 0)}</p>
                <p className="text-sm text-gray-600">Campaign Uses</p>
              </div>
            </div>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all duration-200">
                {/* Asset Preview */}
                <div className="aspect-video bg-gray-100 overflow-hidden relative">
                  <img 
                    src={asset.url} 
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-black bg-opacity-50 text-white">
                      {asset.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getScoreColor(asset.performance.ctr * 25)}`}>
                      {asset.performance.ctr.toFixed(1)}% CTR
                    </span>
                  </div>
                </div>

                {/* Asset Info */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 truncate">{asset.name}</h4>
                  <div className="text-sm text-gray-600 mb-3">
                    <p>{asset.size} • Uploaded {asset.uploadDate}</p>
                    <p>Used in {asset.usedInCampaigns} campaigns</p>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-gray-600">Impressions</p>
                      <p className="font-bold text-gray-900">{asset.performance.impressions.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-gray-600">Clicks</p>
                      <p className="font-bold text-gray-900">{asset.performance.clicks.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {asset.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 text-xs bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors">
                      Use in Campaign
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'testing' && (
        <div className="space-y-6">
          {/* A/B Testing Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">A/B Testing Hub</h3>
                <p className="text-gray-600">Create and monitor creative A/B tests to optimize performance</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedTestStatus}
                  onChange={(e) => setSelectedTestStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Tests</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
                <button
                  onClick={() => setShowCreateTestModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Test
                </button>
              </div>
            </div>

            {/* Testing Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">Completed</h4>
                </div>
                <p className="text-2xl font-bold text-green-600">{abTests.filter(t => t.status === 'completed').length}</p>
                <p className="text-sm text-green-700">Tests with results</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Play className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Running</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600">{abTests.filter(t => t.status === 'running').length}</p>
                <p className="text-sm text-blue-700">Active experiments</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Edit3 className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Draft</h4>
                </div>
                <p className="text-2xl font-bold text-gray-600">{abTests.filter(t => t.status === 'draft').length}</p>
                <p className="text-sm text-gray-700">Ready to launch</p>
              </div>

              <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Avg Lift</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600">+23%</p>
                <p className="text-sm text-purple-700">Performance improvement</p>
              </div>
            </div>
          </div>

          {/* A/B Tests List */}
          <div className="space-y-6">
            {filteredTests.map((test) => (
              <div key={test.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{test.name}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(test.status)}`}>
                        {test.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Started: {test.startDate} {test.endDate && `• Ended: ${test.endDate}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {test.status === 'running' && (
                      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Pause className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                    {test.status === 'draft' && (
                      <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Test Results */}
                {test.status !== 'draft' && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-gray-900">Results</h5>
                      {test.winner && (
                        <span className="text-sm text-green-600 font-medium">
                          Winner: {test.variants.find(v => v.id === test.winner)?.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {test.variants.map((variant) => (
                        <div key={variant.id} className={`p-4 border rounded-lg ${
                          variant.id === test.winner ? 'border-green-500 bg-green-50' : 'border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <h6 className="font-medium text-gray-900">{variant.name}</h6>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">{variant.trafficSplit}% traffic</span>
                              {variant.id === test.winner && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Impressions</p>
                              <p className="font-semibold text-gray-900">{variant.metrics.impressions.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Clicks</p>
                              <p className="font-semibold text-gray-900">{variant.metrics.clicks.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">CTR</p>
                              <p className="font-semibold text-gray-900">{variant.metrics.ctr.toFixed(2)}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Conversions</p>
                              <p className="font-semibold text-gray-900">{variant.metrics.conversions}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Statistical Significance */}
                    {test.status === 'completed' && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-blue-900">Statistical Significance</p>
                            <p className="text-sm text-blue-700">Confidence: {test.confidence}% • p-value: {test.significance}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">
                              +{Math.round(((test.variants[1]?.metrics.ctr || 0) - (test.variants[0]?.metrics.ctr || 0)) / (test.variants[0]?.metrics.ctr || 1) * 100)}%
                            </p>
                            <p className="text-sm text-blue-700">CTR improvement</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Draft Test Setup */}
                {test.status === 'draft' && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-3">Test Configuration</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {test.variants.map((variant) => (
                        <div key={variant.id} className="p-4 border border-gray-200 rounded-lg bg-white">
                          <h6 className="font-medium text-gray-900 mb-2">{variant.name}</h6>
                          <p className="text-sm text-gray-600 mb-2">Traffic allocation: {variant.trafficSplit}%</p>
                          <div className="text-sm">
                            <p className="font-medium text-gray-700">Creative: {variant.creative.headline}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadAsset}
      />
      
      <CreateTestModal
        isOpen={showCreateTestModal}
        onClose={() => setShowCreateTestModal(false)}
        creatives={creatives}
        onCreateTest={handleCreateTest}
      />
    </div>
  );
}