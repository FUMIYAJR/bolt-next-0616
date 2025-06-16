import React, { useState } from 'react';
import { X, User, Mail, Building, Calendar, Save, Check, Camera } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Account information
  const [name, setName] = useState('田中太郎');
  const [email, setEmail] = useState('tanaka@example.com');
  const [company, setCompany] = useState('株式会社サンプル');
  const [joinDate] = useState('2024年1月15日');
  const [plan] = useState('フリープラン');
  const [videosCreated] = useState(5);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setSaved(true);
    
    // Reset saved state after 2 seconds
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-800 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-red-900 mb-2">アカウント情報</h2>
            <p className="text-gray-600">プロフィール情報の確認・変更ができます</p>
          </div>

          {/* Profile Picture Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-4">プロフィール画像</h3>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-red-600" />
              </div>
              <div>
                <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mb-2">
                  <Camera className="w-4 h-4 mr-2" />
                  画像を変更
                </button>
                <p className="text-sm text-gray-500">JPG、PNG形式（最大5MB）</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-4">基本情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  お名前
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  会社名
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-4">アカウント統計</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-red-50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-red-900">{videosCreated}</div>
                <div className="text-sm text-red-600">作成動画数</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-blue-900">{plan}</div>
                <div className="text-sm text-blue-600">現在のプラン</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-900">150</div>
                <div className="text-sm text-green-600">総視聴時間(分)</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-purple-900">98%</div>
                <div className="text-sm text-purple-600">満足度</div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-4">アカウント詳細</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">登録日</p>
                    <p className="text-sm text-gray-600">{joinDate}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">プラン</p>
                  <p className="text-sm text-gray-600">{plan}</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  アップグレード
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">二段階認証</p>
                  <p className="text-sm text-gray-600">セキュリティを強化</p>
                </div>
                <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors">
                  設定
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-colors"
            >
              閉じる
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || saved}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center ${
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

          <div className="mt-6 p-4 bg-red-50 rounded-xl">
            <p className="text-sm text-red-700 text-center">
              アカウント情報の変更は即座に反映されます。重要な変更の場合は確認メールが送信されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;