import React from 'react';
import { X, Home, RotateCcw, Download, Plus } from 'lucide-react';

interface DownloadOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptionSelect: (action: 'dashboard' | 'result' | 'new') => void;
}

const DownloadOptionsModal: React.FC<DownloadOptionsModalProps> = ({ 
  isOpen, 
  onClose, 
  onOptionSelect 
}) => {
  if (!isOpen) return null;

  const options = [
    {
      id: 'dashboard',
      title: 'ダッシュボードに戻る',
      description: '作成した動画一覧を確認し、新しいプロジェクトを開始',
      icon: Home,
      color: 'bg-blue-600 hover:bg-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'result',
      title: 'この画面に留まる',
      description: '動画の編集や設定を続行',
      icon: RotateCcw,
      color: 'bg-green-600 hover:bg-green-700',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 'new',
      title: '新しい動画を作成',
      description: '別の動画プロジェクトを開始',
      icon: Plus,
      color: 'bg-orange-600 hover:bg-orange-700',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">ダウンロード完了！</h2>
            <p className="text-gray-600">動画のダウンロードが完了しました。次にどうしますか？</p>
          </div>

          <div className="space-y-4 mb-8">
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => onOptionSelect(option.id as any)}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${option.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${option.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-gray-700">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600 text-center">
              動画は自動的に履歴に保存されています。いつでもサイドバーからアクセスできます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadOptionsModal;