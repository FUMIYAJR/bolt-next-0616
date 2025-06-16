import React, { useState } from 'react';
import { X, Scissors, Type, Image, Volume2, Palette, RotateCcw, Save, Check } from 'lucide-react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  onEditComplete?: (editData: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, videoUrl, onEditComplete }) => {
  const [activeTab, setActiveTab] = useState<'trim' | 'text' | 'effects' | 'audio'>('trim');
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(30);
  const [textOverlay, setTextOverlay] = useState('');
  const [textPosition, setTextPosition] = useState('bottom');
  const [textSize, setTextSize] = useState(24);
  const [selectedEffect, setSelectedEffect] = useState('none');
  const [audioVolume, setAudioVolume] = useState(100);
  const [isSaving, setIsSaving] = useState(false);

  const effects = [
    { id: 'none', name: 'なし', preview: 'bg-gray-100' },
    { id: 'vintage', name: 'ヴィンテージ', preview: 'bg-amber-100' },
    { id: 'bw', name: 'モノクロ', preview: 'bg-gray-300' },
    { id: 'warm', name: 'ウォーム', preview: 'bg-orange-100' },
    { id: 'cool', name: 'クール', preview: 'bg-blue-100' },
    { id: 'dramatic', name: 'ドラマチック', preview: 'bg-purple-100' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    const editData = {
      trim: { start: trimStart, end: trimEnd },
      text: { content: textOverlay, position: textPosition, size: textSize },
      effect: selectedEffect,
      audio: { volume: audioVolume }
    };
    
    console.log('Saving edited video with settings:', editData);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSaving(false);
    
    if (onEditComplete) {
      onEditComplete(editData);
    }
  };

  const handleReset = () => {
    setTrimStart(0);
    setTrimEnd(30);
    setTextOverlay('');
    setTextPosition('bottom');
    setTextSize(24);
    setSelectedEffect('none');
    setAudioVolume(100);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'trim', name: 'トリミング', icon: Scissors },
    { id: 'text', name: 'テキスト', icon: Type },
    { id: 'effects', name: 'エフェクト', icon: Palette },
    { id: 'audio', name: '音声', icon: Volume2 }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-red-900 mb-2">動画編集</h2>
            <p className="text-gray-600">動画をカスタマイズして、より魅力的に仕上げましょう</p>
          </div>

          {/* Video Preview */}
          <div className="mb-8">
            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center text-white">
                <Image className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <p className="text-lg">動画プレビュー</p>
                <p className="text-sm opacity-70">編集内容がリアルタイムで反映されます</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-red-700 shadow-sm'
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {activeTab === 'trim' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-red-900">動画のトリミング</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      開始時間: {trimStart}秒
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={trimStart}
                      onChange={(e) => setTrimStart(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      終了時間: {trimEnd}秒
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={trimEnd}
                      onChange={(e) => setTrimEnd(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">
                      動画の長さ: {trimEnd - trimStart}秒
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-red-900">テキストオーバーレイ</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      テキスト内容
                    </label>
                    <input
                      type="text"
                      value={textOverlay}
                      onChange={(e) => setTextOverlay(e.target.value)}
                      placeholder="動画に表示するテキストを入力"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        位置
                      </label>
                      <select
                        value={textPosition}
                        onChange={(e) => setTextPosition(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none"
                      >
                        <option value="top">上部</option>
                        <option value="center">中央</option>
                        <option value="bottom">下部</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        サイズ: {textSize}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="48"
                        value={textSize}
                        onChange={(e) => setTextSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'effects' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-red-900">視覚エフェクト</h3>
                <div className="grid grid-cols-3 gap-4">
                  {effects.map((effect) => (
                    <button
                      key={effect.id}
                      onClick={() => setSelectedEffect(effect.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedEffect === effect.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className={`w-full h-16 rounded-lg mb-2 ${effect.preview}`}></div>
                      <p className="text-sm font-medium text-gray-700">{effect.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-red-900">音声設定</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      音量: {audioVolume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={audioVolume}
                      onChange={(e) => setAudioVolume(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      音量を100%以上に設定すると音質が劣化する場合があります
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-colors flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              リセット
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-600 transition-all duration-200 shadow-lg flex items-center justify-center disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  編集を保存
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 text-center">
              編集内容は新しい動画として保存されます。元の動画は保持されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;