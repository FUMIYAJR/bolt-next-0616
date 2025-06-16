import React from 'react';
import { History, Settings, LogOut, Crown, Sparkles, Zap, Star, CreditCard, User, Shield, Palette } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: 'free' | 'pro' | 'enterprise';
  onPlanChange: (plan: 'free' | 'pro' | 'enterprise') => void;
  onLogout: () => void;
  onSettingsClick: () => void;
  onPlanUpgrade: () => void;
}

interface VideoHistory {
  id: string;
  title: string;
  createdAt: string;
  thumbnail: string;
  duration: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  currentPlan, 
  onPlanChange, 
  onLogout,
  onSettingsClick,
  onPlanUpgrade
}) => {
  const mockHistory: VideoHistory[] = [
    {
      id: '1',
      title: '商品紹介動画 - 新製品ローンチ',
      createdAt: '2024-01-15',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '30秒'
    },
    {
      id: '2',
      title: 'ブランドストーリー - 企業理念',
      createdAt: '2024-01-12',
      thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '60秒'
    },
    {
      id: '3',
      title: 'キャンペーン動画 - 春の新作',
      createdAt: '2024-01-10',
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '15秒'
    }
  ];

  const plans = [
    {
      id: 'free',
      name: 'フリー',
      icon: Star,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      id: 'pro',
      name: 'プロ',
      icon: Zap,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      id: 'enterprise',
      name: 'エンタープライズ',
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const settingsOptions = [
    {
      id: 'account',
      name: 'アカウント設定',
      description: 'プロフィール情報の管理',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: onSettingsClick
    },
    {
      id: 'billing',
      name: '請求・プラン管理',
      description: 'プランの変更と請求履歴',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: onPlanUpgrade
    },
    {
      id: 'privacy',
      name: 'プライバシー設定',
      description: 'データ管理とセキュリティ',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => {
        alert('プライバシー設定は開発中です。近日公開予定です。');
      }
    },
    {
      id: 'preferences',
      name: '表示設定',
      description: 'テーマと言語の設定',
      icon: Palette,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => {
        alert('表示設定は開発中です。近日公開予定です。');
      }
    }
  ];

  const handlePlanClick = (planId: string) => {
    if (planId === 'free') {
      // フリープランへのダウングレードは確認が必要
      const confirmDowngrade = window.confirm(
        'フリープランにダウングレードしますか？\n\n• 月3本までの制限が適用されます\n• プロ機能が利用できなくなります\n\n本当によろしいですか？'
      );
      if (confirmDowngrade) {
        onPlanChange(planId as any);
        alert('フリープランにダウングレードしました。');
      }
    } else {
      // 有料プランへのアップグレードは支払いモーダルを開く
      onPlanUpgrade();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-orange-900">マイページ</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Current Plan Display */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">現在のプラン</h3>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {plans.find(p => p.id === currentPlan) && (() => {
                    const plan = plans.find(p => p.id === currentPlan)!;
                    const Icon = plan.icon;
                    return (
                      <>
                        <Icon className={`w-6 h-6 mr-3 ${plan.color}`} />
                        <div>
                          <p className="font-semibold text-gray-900">{plan.name}</p>
                          <p className="text-sm text-gray-600">
                            {currentPlan === 'free' ? '月3本まで' : 
                             currentPlan === 'pro' ? '月50本まで' : '無制限'}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                {currentPlan === 'free' && (
                  <button
                    onClick={onPlanUpgrade}
                    className="px-3 py-1 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    アップグレード
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Plan Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">プラン変更</h3>
            <div className="space-y-2">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const isActive = currentPlan === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => handlePlanClick(plan.id)}
                    className={`w-full flex items-center p-3 rounded-lg border-2 transition-all ${
                      isActive
                        ? `${plan.bgColor} ${plan.borderColor} ${plan.color}`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-3 ${isActive ? plan.color : 'text-gray-500'}`} />
                    <div className="flex-1 text-left">
                      <span className={`font-medium ${isActive ? plan.color : 'text-gray-700'}`}>
                        {plan.name}
                      </span>
                      {plan.id !== 'free' && !isActive && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                          アップグレード
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <History className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="font-semibold text-orange-900">過去の作品</h3>
          </div>
          
          <div className="space-y-3">
            {mockHistory.map((video) => (
              <div
                key={video.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-12 h-8 object-cover rounded mr-3"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {video.title}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>{video.createdAt}</span>
                    <span className="mx-1">•</span>
                    <span>{video.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="font-semibold text-orange-900">設定</h3>
          </div>
          
          <div className="space-y-2">
            {settingsOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={option.action}
                  className="w-full flex items-start p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <div className={`w-8 h-8 ${option.bgColor} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${option.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{option.name}</p>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="p-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">ログアウト</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-700 to-red-600 rounded-lg mx-auto mb-2">
              <span className="text-sm font-bold text-white leading-8">Foobi</span>
            </div>
            <p className="text-xs text-gray-500">by Novan</p>
            <p className="text-xs text-gray-400 mt-1">v1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;