import React, { useState } from 'react';
import { ArrowLeft, User, Bell, Shield, CreditCard, Globe, Moon, Sun, Volume2, Palette, Save, Check } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'billing' | 'preferences'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile settings
  const [name, setName] = useState('田中太郎');
  const [email, setEmail] = useState('tanaka@example.com');
  const [company, setCompany] = useState('株式会社サンプル');
  const [bio, setBio] = useState('動画制作に情熱を注ぐクリエイターです。');

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Privacy settings
  const [profilePublic, setProfilePublic] = useState(false);
  const [analyticsSharing, setAnalyticsSharing] = useState(true);

  // Preferences
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [language, setLanguage] = useState('ja');
  const [autoSave, setAutoSave] = useState(true);

  const tabs = [
    { id: 'profile', name: 'プロフィール', icon: User },
    { id: 'notifications', name: '通知', icon: Bell },
    { id: 'privacy', name: 'プライバシー', icon: Shield },
    { id: 'billing', name: '請求', icon: CreditCard },
    { id: 'preferences', name: '設定', icon: Palette }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setSaved(true);
    
    // Reset saved state after 2 seconds
    setTimeout(() => setSaved(false), 2000);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-red-900 mb-4">基本情報</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              お名前
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              会社名
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              自己紹介
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-red-900 mb-4">プロフィール画像</h3>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-red-600" />
          </div>
          <div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              画像を変更
            </button>
            <p className="text-sm text-gray-500 mt-1">JPG、PNG形式（最大5MB）</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-red-900 mb-4">通知設定</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">メール通知</h4>
              <p className="text-sm text-gray-600">動画生成完了時にメールで通知</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">プッシュ通知</h4>
              <p className="text-sm text-gray-600">ブラウザでのプッシュ通知</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">マーケティングメール</h4>
              <p className="text-sm text-gray-600">新機能やキャンペーンの案内</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={marketingEmails}
                onChange={(e) => setMarketingEmails(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-red-900 mb-4">プライバシー設定</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">プロフィール公開</h4>
              <p className="text-sm text-gray-600">他のユーザーがプロフィールを閲覧可能</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profilePublic}
                onChange={(e) => setProfilePublic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">分析データ共有</h4>
              <p className="text-sm text-gray-600">サービス改善のためのデータ提供</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={analyticsSharing}
                onChange={(e) => setAnalyticsSharing(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-red-900 mb-4">データ管理</h3>
        <div className="space-y-3">
          <button className="w-full p-3 text-left border-2 border-gray-200 rounded-xl hover:border-red-300 transition-colors">
            <h4 className="font-medium text-gray-900">データのエクスポート</h4>
            <p className="text-sm text-gray-600">あなたのデータをダウンロード</p>
          </button>
          <button className="w-full p-3 text-left border-2 border-red-200 rounded-xl hover:border-red-400 transition-colors text-red-600">
            <h4 className="font-medium">アカウントの削除</h4>
            <p className="text-sm">すべてのデータが永久に削除されます</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-red-900 mb-4">現在のプラン</h3>
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-red-900">フリープラン</h4>
              <p className="text-red-600">月3本まで動画生成可能</p>
            </div>
            <span className="text-2xl font-bold text-red-900">¥0</span>
          </div>
          <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors">
            プランをアップグレード
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-red-900 mb-4">支払い方法</h3>
        <div className="space-y-3">
          <div className="p-4 border-2 border-gray-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-6 h-6 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">**** **** **** 1234</p>
                  <p className="text-sm text-gray-600">有効期限: 12/25</p>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-700 font-medium">編集</button>
            </div>
          </div>
          <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors">
            + 新しい支払い方法を追加
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-red-900 mb-4">請求履歴</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">2024年1月</p>
              <p className="text-sm text-gray-600">フリープラン</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">¥0</p>
              <button className="text-sm text-red-600 hover:text-red-700">詳細</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-red-900 mb-4">表示設定</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              テーマ
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', name: 'ライト', icon: Sun },
                { id: 'dark', name: 'ダーク', icon: Moon },
                { id: 'auto', name: '自動', icon: Globe }
              ].map((themeOption) => {
                const Icon = themeOption.icon;
                return (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id as any)}
                    className={`p-3 border-2 rounded-xl transition-all ${
                      theme === themeOption.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">{themeOption.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              言語
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
              <option value="ko">한국어</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-red-900 mb-4">動作設定</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">自動保存</h4>
              <p className="text-sm text-gray-600">編集中の内容を自動的に保存</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={onBack}
              className="p-2 text-red-700 hover:bg-red-100 rounded-lg transition-colors mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-800 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">Fūbi</span>
              </div>
              <h1 className="text-2xl font-bold text-red-900">設定</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center p-3 rounded-lg transition-all ${
                          activeTab === tab.id
                            ? 'bg-red-50 text-red-700 border-2 border-red-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8">
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'notifications' && renderNotificationsTab()}
                {activeTab === 'privacy' && renderPrivacyTab()}
                {activeTab === 'billing' && renderBillingTab()}
                {activeTab === 'preferences' && renderPreferencesTab()}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={isSaving || saved}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center ${
                      saved
                        ? 'bg-green-600 text-white'
                        : 'bg-gradient-to-r from-red-700 to-red-600 text-white hover:from-red-800 hover:to-red-700'
                    } disabled:opacity-50`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        保存中...
                      </>
                    ) : saved ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        保存完了
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        変更を保存
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;