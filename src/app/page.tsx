'use client'

import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Zap, Crown, Star, Menu, User, LogIn, ChevronRight, Check, Clock, FileText, Video, Download, Edit, ArrowLeft, BarChart3, Plus, Home } from 'lucide-react';
import LoginModal from '@/components/LoginModal';
import PlanModal from '@/components/PlanModal';
import EditModal from '@/components/EditModal';
import EditPage from '@/components/EditPage';
import SettingsModal from '@/components/SettingsModal';
import Sidebar from '@/components/Sidebar';
import ConceptEditModal from '@/components/ConceptEditModal';
import ConceptEditPage from '@/components/ConceptEditPage';
import AccountModal from '@/components/AccountModal';
import SettingsPage from '@/components/SettingsPage';
import DownloadOptionsModal from '@/components/DownloadOptionsModal';
import AutoSidebar from '@/components/AutoSidebar';
import StepNavigation from '@/components/StepNavigation';
import VideoHistoryCard from '@/components/VideoHistoryCard';

type AppState = 'landing' | 'dashboard' | 'videoDetails' | 'conceptsLoading' | 'concepts' | 'conceptEdit' | 'generating' | 'result' | 'edit' | 'settings';
type Plan = 'free' | 'pro' | 'enterprise';

interface VideoHistory {
  id: string;
  title: string;
  createdAt: string;
  thumbnail: string;
  duration: string;
}

interface SceneData {
  id: number;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  content: string;
  mediaFiles?: File[];
}

interface ConceptData {
  id: number;
  title: string;
  description: string;
  script: string;
  bgm: string;
  scenes: SceneData[];
  mediaFiles?: File[];
}

interface SavedProgress {
  state: AppState;
  step: number;
  videoTitle: string;
  videoDescription: string;
  targetAudience: string;
  videoLength: string;
  selectedModel: string;
  uploadedFiles: File[];
  selectedConcept: number | null;
  concepts: ConceptData[];
  editedConcept: ConceptData | null;
}

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan>('free');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showConceptEditModal, setShowConceptEditModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showDownloadOptionsModal, setShowDownloadOptionsModal] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedVideos, setGeneratedVideos] = useState<VideoHistory[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [savedProgress, setSavedProgress] = useState<SavedProgress | null>(null);

  // Video creation form data
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [videoLength, setVideoLength] = useState('30');
  const [selectedModel, setSelectedModel] = useState('basic');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
  const [concepts, setConcepts] = useState<ConceptData[]>([]);
  const [editingConcept, setEditingConcept] = useState<ConceptData | null>(null);

  const aiModels = [
    {
      id: 'basic',
      name: 'ベーシックAI',
      description: '高品質な動画を素早く生成',
      requiredPlan: 'free',
      icon: Star,
      color: 'text-gray-600'
    },
    {
      id: 'pro',
      name: 'プロAI',
      description: 'より洗練された表現力',
      requiredPlan: 'pro',
      icon: Zap,
      color: 'text-amber-600'
    },
    {
      id: 'enterprise',
      name: 'エンタープライズAI',
      description: '最高峰のクリエイティブ生成',
      requiredPlan: 'enterprise',
      icon: Crown,
      color: 'text-purple-600'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToTop();
  }, [currentState]);

  // Save progress whenever important state changes
  useEffect(() => {
    if (isLoggedIn && currentState !== 'landing' && currentState !== 'dashboard') {
      const progress: SavedProgress = {
        state: currentState,
        step: currentStep,
        videoTitle,
        videoDescription,
        targetAudience,
        videoLength,
        selectedModel,
        uploadedFiles,
        selectedConcept,
        concepts,
        editedConcept: editingConcept
      };
      setSavedProgress(progress);
      if (typeof window !== 'undefined') {
        localStorage.setItem('foobi_progress', JSON.stringify(progress));
      }
    }
  }, [currentState, currentStep, videoTitle, videoDescription, targetAudience, videoLength, selectedModel, uploadedFiles, selectedConcept, concepts, editingConcept, isLoggedIn]);

  // Load saved progress on login
  const loadSavedProgress = () => {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem('foobi_progress');
    if (saved) {
      try {
        const progress: SavedProgress = JSON.parse(saved);
        setSavedProgress(progress);
        
        // Restore state
        setCurrentState(progress.state);
        setCurrentStep(progress.step);
        setVideoTitle(progress.videoTitle);
        setVideoDescription(progress.videoDescription);
        setTargetAudience(progress.targetAudience);
        setVideoLength(progress.videoLength);
        setSelectedModel(progress.selectedModel);
        setUploadedFiles(progress.uploadedFiles);
        setSelectedConcept(progress.selectedConcept);
        setConcepts(progress.concepts);
        setEditingConcept(progress.editedConcept);
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    }
  };

  const clearSavedProgress = () => {
    setSavedProgress(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('foobi_progress');
    }
  };

  const goToDashboard = () => {
    setCurrentState('dashboard');
    setCurrentStep(1);
    // Reset form
    setVideoTitle('');
    setVideoDescription('');
    setTargetAudience('');
    setSelectedConcept(null);
    setGeneratedVideoUrl(null);
    setEditingConcept(null);
    clearSavedProgress();
  };

  const handleLogin = (email: string, password: string) => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    
    // Check if there's saved progress and user was in the middle of creation
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('foobi_progress');
      if (saved) {
        const shouldResume = window.confirm(
          '前回の作業が保存されています。続きから始めますか？\n\nOK: 続きから開始\nキャンセル: ダッシュボードに移動'
        );
        
        if (shouldResume) {
          loadSavedProgress();
        } else {
          setCurrentState('dashboard');
          setCurrentStep(1);
          clearSavedProgress();
        }
      } else {
        setCurrentState('dashboard');
        setCurrentStep(1);
      }
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    setCurrentPlan(plan);
    setShowPlanModal(false);
  };

  const handlePlanUpgrade = () => {
    setShowPlanModal(true);
    setShowSidebar(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentState('landing');
    setCurrentStep(1);
    setShowSidebar(false);
    clearSavedProgress();
  };

  const checkPlanRequirement = (modelId: string): boolean => {
    const model = aiModels.find(m => m.id === modelId);
    if (!model) return false;

    const planHierarchy = { free: 0, pro: 1, enterprise: 2 };
    const requiredLevel = planHierarchy[model.requiredPlan as keyof typeof planHierarchy];
    const currentLevel = planHierarchy[currentPlan];

    return currentLevel >= requiredLevel;
  };

  const handleVideoDetailsSubmit = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!checkPlanRequirement(selectedModel)) {
      setShowPlanModal(true);
      return;
    }

    setCurrentState('conceptsLoading');
    setCurrentStep(2);
    
    // Simulate loading time
    setTimeout(() => {
      setCurrentState('concepts');
      
      // Generate mock concepts with detailed scenes
      const mockConcepts: ConceptData[] = [
        {
          id: 1,
          title: '感情重視アプローチ',
          description: '視聴者の感情に訴えかける構成で、ブランドとの深いつながりを創出',
          script: `${videoDescription}を通じて、視聴者の心に響く物語を紡ぎます。感情的なつながりを重視し、ブランドの価値を深く伝える構成です。`,
          bgm: 'エモーショナル・ピアノ',
          scenes: [
            {
              id: 1,
              title: 'オープニング',
              description: '視聴者の注意を引く印象的な導入',
              startTime: 0,
              endTime: 8,
              content: 'ブランドロゴと共に、印象的なビジュアルで視聴者の関心を引きつけます'
            },
            {
              id: 2,
              title: '問題提起',
              description: 'ターゲットが抱える課題を明確化',
              startTime: 8,
              endTime: 18,
              content: `${targetAudience}が日常で感じる課題や悩みを具体的に描写します`
            },
            {
              id: 3,
              title: '解決策提示',
              description: '商品・サービスによる解決方法',
              startTime: 18,
              endTime: 25,
              content: 'あなたの商品がどのように問題を解決するかを分かりやすく説明します'
            },
            {
              id: 4,
              title: 'クロージング',
              description: '行動を促す力強い結び',
              startTime: 25,
              endTime: 30,
              content: '視聴者に具体的なアクションを促す、印象に残るメッセージで締めくくります'
            }
          ]
        },
        {
          id: 2,
          title: 'ストーリーテリング',
          description: '物語性を重視した構成で、記憶に残る印象的な動画を制作',
          script: `物語の力を活用して${videoDescription}を魅力的に伝えます。視聴者が自然と引き込まれる構成で、ブランドメッセージを効果的に届けます。`,
          bgm: 'シネマティック・オーケストラ',
          scenes: [
            {
              id: 1,
              title: '導入シーン',
              description: '物語の舞台設定と主人公登場',
              startTime: 0,
              endTime: 7,
              content: '物語の世界観を設定し、視聴者が共感できる主人公を登場させます'
            },
            {
              id: 2,
              title: '展開',
              description: '主人公の課題と成長の過程',
              startTime: 7,
              endTime: 16,
              content: '主人公が直面する課題と、それを乗り越えていく過程を描きます'
            },
            {
              id: 3,
              title: 'クライマックス',
              description: '商品との出会いと変化',
              startTime: 16,
              endTime: 24,
              content: 'あなたの商品・サービスとの出会いによる劇的な変化を表現します'
            },
            {
              id: 4,
              title: 'エンディング',
              description: '希望に満ちた未来への展望',
              startTime: 24,
              endTime: 30,
              content: '商品によって実現される明るい未来を印象的に描写します'
            }
          ]
        },
        {
          id: 3,
          title: 'データドリブン',
          description: '具体的な数値と実績を活用した信頼性重視の構成',
          script: `データと実績に基づいて${videoDescription}の価値を証明します。具体的な数値と事実で説得力のあるメッセージを構築します。`,
          bgm: 'モダン・エレクトロニック',
          scenes: [
            {
              id: 1,
              title: '現状分析',
              description: '市場データと課題の可視化',
              startTime: 0,
              endTime: 8,
              content: '業界の現状と課題を具体的なデータで示し、問題の重要性を伝えます'
            },
            {
              id: 2,
              title: '実績紹介',
              description: '具体的な成果と顧客の声',
              startTime: 8,
              endTime: 17,
              content: 'これまでの実績と顧客満足度を数値で示し、信頼性を構築します'
            },
            {
              id: 3,
              title: '比較優位',
              description: '競合との明確な差別化',
              startTime: 17,
              endTime: 25,
              content: '他社との比較データを用いて、あなたの商品の優位性を明確に示します'
            },
            {
              id: 4,
              title: 'ROI提示',
              description: '投資対効果の具体的な提示',
              startTime: 25,
              endTime: 30,
              content: '導入による具体的なメリットとROIを数値で分かりやすく提示します'
            }
          ]
        }
      ];

      setConcepts(mockConcepts);
    }, 3000);
  };

  const handleConceptSelect = (conceptId: number) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const concept = concepts.find(c => c.id === conceptId);
    if (concept) {
      setEditingConcept(concept);
      setCurrentState('conceptEdit');
    }
  };

  const handleConceptEditComplete = (editedConcept: ConceptData) => {
    setSelectedConcept(editedConcept.id);
    setCurrentState('generating');
    setCurrentStep(3);
    
    // Simulate video generation
    setTimeout(() => {
      const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      setGeneratedVideoUrl(videoUrl);
      
      // Add to history
      const newVideo: VideoHistory = {
        id: Date.now().toString(),
        title: videoTitle || '新しい動画',
        createdAt: new Date().toISOString().split('T')[0],
        thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
        duration: `${videoLength}秒`
      };
      
      setGeneratedVideos(prev => [newVideo, ...prev]);
      setCurrentState('result');
      setCurrentStep(4);
      clearSavedProgress(); // Clear progress when video is completed
    }, 8000);
  };

  const handleConceptEdit = (concept: ConceptData) => {
    setEditingConcept(concept);
    setShowConceptEditModal(true);
  };

  const handleConceptSave = (updatedConcept: ConceptData) => {
    setConcepts(prev => prev.map(concept => 
      concept.id === updatedConcept.id ? updatedConcept : concept
    ));
    setShowConceptEditModal(false);
    setEditingConcept(null);
  };

  const handleDownload = () => {
    if (generatedVideoUrl) {
      const link = document.createElement('a');
      link.href = generatedVideoUrl;
      link.download = `${videoTitle || 'foobi-video'}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show download options modal
      setShowDownloadOptionsModal(true);
    }
  };

  const handleDownloadComplete = (action: 'dashboard' | 'result' | 'new') => {
    setShowDownloadOptionsModal(false);
    
    if (action === 'dashboard') {
      goToDashboard();
    } else if (action === 'new') {
      setCurrentState('videoDetails');
      setCurrentStep(1);
      // Reset form
      setVideoTitle('');
      setVideoDescription('');
      setTargetAudience('');
      setSelectedConcept(null);
      setGeneratedVideoUrl(null);
      setEditingConcept(null);
      clearSavedProgress();
    }
    // If 'result', stay on current page
  };

  const handleStepNavigation = (step: number) => {
    if (step === 1) {
      setCurrentState('videoDetails');
      setCurrentStep(1);
    } else if (step === 2) {
      setCurrentState('concepts');
      setCurrentStep(2);
    }
    // Steps 3 and 4 are not navigable backwards for safety
  };

  // Handle video title update
  const handleVideoTitleUpdate = (videoId: string, newTitle: string) => {
    setGeneratedVideos(prev => 
      prev.map(video => 
        video.id === videoId 
          ? { ...video, title: newTitle }
          : video
      )
    );
    
    // Show success message
    const video = generatedVideos.find(v => v.id === videoId);
    if (video) {
      // You could add a toast notification here
      console.log(`動画タイトルを「${newTitle}」に変更しました`);
    }
  };

  const renderHeader = () => (
    <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            {/* Back button for non-dashboard pages */}
            {currentState !== 'landing' && currentState !== 'dashboard' && (
              <button
                onClick={() => {
                  if (currentState === 'videoDetails') {
                    goToDashboard();
                  } else if (currentState === 'concepts' || currentState === 'conceptEdit') {
                    setCurrentState('videoDetails');
                    setCurrentStep(1);
                  } else if (currentState === 'generating' || currentState === 'result') {
                    setCurrentState('concepts');
                    setCurrentStep(2);
                  } else if (currentState === 'edit') {
                    setCurrentState('result');
                  }
                }}
                className="p-2 text-orange-700 hover:bg-orange-100 rounded-lg transition-colors mr-2"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            
            <div className="w-10 h-10 bg-gradient-to-br from-orange-700 to-red-600 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">Foobi</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-orange-900">Foobi</h1>
              <p className="text-sm text-orange-600">by Novan</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Dashboard button - always visible when logged in */}
            {isLoggedIn && currentState !== 'dashboard' && (
              <button
                onClick={goToDashboard}
                className="flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                ダッシュボード
              </button>
            )}
            
            {!isLoggedIn && (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center px-4 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-colors"
              >
                <LogIn className="w-4 h-4 mr-2" />
                ログイン
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  const renderLandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {renderHeader()}

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Novan AI Technology
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-orange-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-700 to-red-600 bg-clip-text text-transparent">
                Foobi
              </span>で創る<br />
              心に響く広告動画
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Novanの最先端AI技術で、あなたのビジョンを一瞬で世界に届ける動画へと昇華させます。
              プロ品質の広告動画を、誰でも簡単に。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setCurrentState('dashboard');
                  setCurrentStep(1);
                }}
                className="px-8 py-4 bg-gradient-to-r from-orange-700 to-red-600 text-white rounded-xl text-lg font-semibold hover:from-orange-800 hover:to-red-700 transition-all duration-200 shadow-lg flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                ダッシュボードへ
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setCurrentState('videoDetails');
                    setCurrentStep(1);
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-orange-700 to-red-600 text-white rounded-xl text-lg font-semibold hover:from-orange-800 hover:to-red-700 transition-all duration-200 shadow-lg flex items-center justify-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  無料で試してみる
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-8 py-4 border-2 border-orange-600 text-orange-600 rounded-xl text-lg font-semibold hover:bg-orange-50 transition-all duration-200 flex items-center justify-center"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  ログイン
                </button>
              </>
            )}
          </div>

          {/* Demo Video */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-xl font-semibold mb-2">Foobi デモ動画</p>
                  <p className="text-gray-300">Novan AI Technologyで作成された動画をご覧ください</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-orange-900 mb-4">
              なぜFoobiが選ばれるのか
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Novanの最先端AI技術と直感的なインターフェースで、誰でもプロ品質の動画を作成できます
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-orange-900 mb-4">Novan AI自動生成</h3>
              <p className="text-gray-600 leading-relaxed">
                Novanの最新AI技術により、あなたの要望を理解し、最適な動画構成を自動生成します
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-amber-900 mb-4">高速処理</h3>
              <p className="text-gray-600 leading-relaxed">
                従来の動画制作に比べて圧倒的な速度で、高品質な動画を生成します
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-900 mb-4">プロ品質</h3>
              <p className="text-gray-600 leading-relaxed">
                プロの映像クリエイターが制作したような、高品質な動画を誰でも作成可能
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-700 to-red-600 rounded-full mx-auto mb-4">
              <User className="w-8 h-8 text-white m-4" />
            </div>
            <h3 className="text-xl font-bold text-orange-900 mb-2">Novan 代表取締役 池内大翔</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              「AIの力で、すべての人がクリエイターになれる世界を創造します。Foobiは、あなたの想像力を現実に変える最高のパートナーです。」
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-orange-900">Foobi</span>
              </div>
              <span className="text-2xl font-bold">Foobi by Novan</span>
            </div>
            <p className="text-orange-200 mb-4">AI動画生成プラットフォーム</p>
            <p className="text-orange-300 text-sm">© 2024 Novan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {renderHeader()}

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-orange-900 mb-4">
              おかえりなさい！
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Foobiで新しい動画を作成しましょう
            </p>
            
            {/* Show resume option if there's saved progress */}
            {savedProgress && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">作業を再開</h3>
                <p className="text-blue-700 mb-4">
                  前回の作業が保存されています。続きから始めますか？
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={loadSavedProgress}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    続きから開始
                  </button>
                  <button
                    onClick={clearSavedProgress}
                    className="px-6 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    新規作成
                  </button>
                </div>
              </div>
            )}
            
            <button
              onClick={() => {
                setCurrentState('videoDetails');
                setCurrentStep(1);
              }}
              className="px-8 py-4 bg-gradient-to-r from-orange-700 to-red-600 text-white rounded-xl text-lg font-semibold hover:from-orange-800 hover:to-red-700 transition-all duration-200 shadow-lg flex items-center mx-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              新しい動画を作成
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Video className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-900">{generatedVideos.length}</p>
                  <p className="text-gray-600">作成済み動画</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">1,250</p>
                  <p className="text-gray-600">総視聴回数</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Crown className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900">{currentPlan}</p>
                  <p className="text-gray-600">現在のプラン</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Videos */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-orange-900">最近の動画</h3>
              <button className="text-orange-600 hover:text-orange-700 font-medium">
                すべて表示
              </button>
            </div>

            {generatedVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedVideos.slice(0, 6).map((video) => (
                  <VideoHistoryCard
                    key={video.id}
                    video={video}
                    onTitleUpdate={handleVideoTitleUpdate}
                    onClick={() => {
                      // Handle video click - could open video player or details
                      console.log('Video clicked:', video.title);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-600 mb-2">
                  まだ動画がありません
                </h4>
                <p className="text-gray-500 mb-6">
                  最初の動画を作成して、Foobiの力を体験してみましょう
                </p>
                <button
                  onClick={() => {
                    setCurrentState('videoDetails');
                    setCurrentStep(1);
                  }}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  動画を作成する
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVideoDetailsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {renderHeader()}
      <StepNavigation 
        currentStep={currentStep} 
        onStepClick={handleStepNavigation}
        allowNavigation={true}
      />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-orange-900 mb-2">動画の詳細を入力</h2>
              <p className="text-gray-600">作成したい動画の内容を詳しく教えてください</p>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  動画タイトル
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="例: 新商品の魅力を伝える動画"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  動画の説明・目的
                </label>
                <textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  rows={4}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="どのような動画を作成したいか、詳しく説明してください"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ターゲット層
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="例: 20-30代の働く女性"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    動画の長さ
                  </label>
                  <select
                    value={videoLength}
                    onChange={(e) => setVideoLength(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  >
                    <option value="15">15秒</option>
                    <option value="30">30秒</option>
                    <option value="60">60秒</option>
                    <option value="90">90秒</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  AIモデルを選択
                </label>
                <div className="grid gap-4">
                  {aiModels.map((model) => {
                    const Icon = model.icon;
                    const canUse = checkPlanRequirement(model.id);
                    return (
                      <div
                        key={model.id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedModel === model.id
                            ? 'border-orange-500 bg-orange-50'
                            : canUse
                              ? 'border-gray-200 hover:border-orange-300'
                              : 'border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => canUse && setSelectedModel(model.id)}
                      >
                        <div className="flex items-center">
                          <Icon className={`w-6 h-6 mr-3 ${model.color}`} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{model.name}</h3>
                            <p className="text-sm text-gray-600">{model.description}</p>
                          </div>
                          {!canUse && (
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                              アップグレード必要
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleVideoDetailsSubmit}
                className="w-full bg-gradient-to-r from-orange-700 to-red-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-orange-800 hover:to-red-700 transition-all duration-200 shadow-lg"
              >
                構成案を生成する
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConceptsLoadingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {renderHeader()}
      <StepNavigation 
        currentStep={currentStep} 
        onStepClick={handleStepNavigation}
        allowNavigation={false}
      />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
            
            <h2 className="text-3xl font-bold text-orange-900 mb-4">
              Novan AIが構成案を生成中
            </h2>
            <p className="text-gray-600 mb-8">
              最先端のAI技術で、あなたの要望に最適な3つの構成案を作成しています...
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-gray-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-600 to-red-500 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
              <p className="text-sm text-gray-500">推定残り時間: 約30秒</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl">
              <h3 className="font-semibold text-orange-900 mb-2">Novan AI Technology</h3>
              <p className="text-sm text-orange-700">
                深層学習と自然言語処理を組み合わせた独自のAIエンジンが、
                あなたのビジョンを理解し、最適な動画構成を提案します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConceptsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {renderHeader()}
      <StepNavigation 
        currentStep={currentStep} 
        onStepClick={handleStepNavigation}
        allowNavigation={true}
      />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-orange-900 mb-2">構成案を選択</h2>
            <p className="text-gray-600">Novan AIが生成した3つの構成案から、最適なものを選択してください</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {concepts.map((concept) => (
              <div
                key={concept.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-200"
              >
                <h3 className="text-xl font-bold text-orange-900 mb-4">{concept.title}</h3>
                <p className="text-gray-600 mb-6">{concept.description}</p>
                
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-800">シーン構成:</h4>
                  {concept.scenes.map((scene) => (
                    <div key={scene.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm text-orange-700">
                          シーン{scene.id}: {scene.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          {scene.startTime}s - {scene.endTime}s
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{scene.content}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">台本:</h4>
                  <p className="text-sm text-gray-600 mb-3">{concept.script}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">BGM:</span>
                    <span className="ml-2">{concept.bgm}</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleConceptSelect(concept.id)}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-600 transition-all"
                >
                  この構成を選択して編集
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneratingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {renderHeader()}
      <StepNavigation 
        currentStep={currentStep} 
        onStepClick={handleStepNavigation}
        allowNavigation={false}
      />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
            
            <h2 className="text-3xl font-bold text-orange-900 mb-4">
              Novan AIが動画を生成中
            </h2>
            <p className="text-gray-600 mb-8">
              選択された構成案をもとに、高品質な動画を作成しています...
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-gray-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-600 to-red-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
              <p className="text-sm text-gray-500">推定残り時間: 約30秒</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl">
              <h3 className="font-semibold text-orange-900 mb-2">Foobi by Novan</h3>
              <p className="text-sm text-orange-700">
                最先端の映像生成AI技術により、プロ品質の動画を自動生成しています。
                シーン構成、BGM、エフェクトまで、すべてAIが最適化します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {renderHeader()}
      <StepNavigation 
        currentStep={currentStep} 
        onStepClick={handleStepNavigation}
        allowNavigation={false}
      />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-orange-900 mb-2">動画が完成しました！</h2>
              <p className="text-gray-600">Novan AIが生成した高品質な動画をご確認ください</p>
            </div>

            <div className="mb-8">
              <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                {generatedVideoUrl ? (
                  <video
                    src={generatedVideoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                      <p className="text-lg">動画プレビュー</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setCurrentState('edit')}
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-600 transition-all duration-200 shadow-lg"
              >
                編集する
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-600 transition-all duration-200 shadow-lg"
              >
                設定・共有
              </button>
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-orange-700 to-red-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-orange-800 hover:to-red-700 transition-all duration-200 shadow-lg flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              動画をダウンロード
            </button>

            <div className="mt-6 p-4 bg-orange-50 rounded-xl">
              <p className="text-sm text-orange-700 text-center">
                動画は自動的に履歴に保存されました。サイドバーからいつでもアクセスできます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="App">
      {/* Auto Sidebar Component */}
      <AutoSidebar 
        isLoggedIn={isLoggedIn}
        onSidebarOpen={() => setShowSidebar(true)}
      />

      {currentState === 'landing' && renderLandingPage()}
      {currentState === 'dashboard' && renderDashboard()}
      {currentState === 'videoDetails' && renderVideoDetailsPage()}
      {currentState === 'conceptsLoading' && renderConceptsLoadingPage()}
      {currentState === 'concepts' && renderConceptsPage()}
      {currentState === 'conceptEdit' && (
        <ConceptEditPage
          concept={editingConcept}
          onComplete={handleConceptEditComplete}
          onBack={() => setCurrentState('concepts')}
        />
      )}
      {currentState === 'generating' && renderGeneratingPage()}
      {currentState === 'result' && renderResultPage()}
      {currentState === 'edit' && (
        <EditPage
          videoUrl={generatedVideoUrl}
          onBack={() => setCurrentState('result')}
          onDashboard={goToDashboard}
        />
      )}
      {currentState === 'settings' && <SettingsPage onBack={() => setCurrentState('dashboard')} />}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <PlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanSelect={handlePlanSelect}
      />

      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        videoUrl={generatedVideoUrl}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        videoUrl={generatedVideoUrl}
      />

      <ConceptEditModal
        isOpen={showConceptEditModal}
        onClose={() => setShowConceptEditModal(false)}
        concept={editingConcept}
        onSave={handleConceptSave}
      />

      <AccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />

      <DownloadOptionsModal
        isOpen={showDownloadOptionsModal}
        onClose={() => setShowDownloadOptionsModal(false)}
        onOptionSelect={handleDownloadComplete}
      />

      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        currentPlan={currentPlan}
        onPlanChange={setCurrentPlan}
        onLogout={handleLogout}
        onSettingsClick={() => {
          setShowAccountModal(true);
          setShowSidebar(false);
        }}
        onPlanUpgrade={handlePlanUpgrade}
      />
    </div>
  );
}