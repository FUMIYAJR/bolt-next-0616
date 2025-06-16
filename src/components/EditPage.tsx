import React, { useState } from 'react';
import { ArrowLeft, Scissors, Type, Image, Volume2, Palette, RotateCcw, Save, Check, Play, Download, Share2, Home } from 'lucide-react';

interface EditPageProps {
  videoUrl: string | null;
  onBack: () => void;
  onComplete?: (editData: any) => void;
  onDashboard?: () => void;
}

const EditPage: React.FC<EditPageProps> = ({ videoUrl, onBack, onComplete, onDashboard }) => {
  const [activeTab, setActiveTab] = useState<'trim' | 'text' | 'effects' | 'audio' | 'export'>('trim');
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(30);
  const [textOverlay, setTextOverlay] = useState('');
  const [textPosition, setTextPosition] = useState('bottom');
  const [textSize, setTextSize] = useState(24);
  const [textColor, setTextColor] = useState('#ffffff');
  const [selectedEffect, setSelectedEffect] = useState('none');
  const [audioVolume, setAudioVolume] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [exportFormat, setExportFormat] = useState('mp4');
  const [exportQuality, setExportQuality] = useState('1080p');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const effects = [
    { id: 'none', name: 'なし', preview: 'bg-gray-100', description: 'エフェクトなし' },
    { id: 'vintage', name: 'ヴィンテージ', preview: 'bg-amber-100', description: 'レトロな雰囲気' },
    { id: 'bw', name: 'モノクロ', preview: 'bg-gray-300', description: 'クラシックな白黒' },
    { id: 'warm', name: 'ウォーム', preview: 'bg-orange-100', description: '暖かい色調' },
    { id: 'cool', name: 'クール', preview: 'bg-blue-100', description: '冷たい色調' },
    { id: 'dramatic', name: 'ドラマチック', preview: 'bg-purple-100', description: '高コントラスト' },
    { id: 'soft', name: 'ソフト', preview: 'bg-pink-100', description: '柔らかい印象' },
    { id: 'vibrant', name: 'ビビッド', preview: 'bg-green-100', description: '鮮やかな色彩' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    const editData = {
      trim: { start: trimStart, end: trimEnd },
      text: { content: textOverlay, position: textPosition, size: textSize, color: textColor },
      effect: selectedEffect,
      audio: { volume: audioVolume },
      visual: { brightness, contrast, saturation },
      export: { format: exportFormat, quality: exportQuality }
    };
    
    console.log('Saving edited video with settings:', editData);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSaving(false);
    
    if (onComplete) {
      onComplete(editData);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate download
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `foobi-edited-video-${exportQuality}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    setIsExporting(false);
    alert(`動画を${exportQuality} ${exportFormat.toUpperCase()}形式でエクスポートしました！`);
  };

  const handleReset = () => {
    setTrimStart(0);
    setTrimEnd(30);
    setTextOverlay('');
    setTextPosition('bottom');
    setTextSize(24);
    setTextColor('#ffffff');
    setSelectedEffect('none');
    setAudioVolume(100);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  const tabs = [
    { id: 'trim', name: 'トリミング', icon: Scissors, description: '動画の長さを調整' },
    { id: 'text', name: 'テキスト', icon: Type, description: 'テキストオーバーレイ' },
    { id: 'effects', name: 'エフェクト', icon: Palette, description: '視覚エフェクト' },
    { id: 'audio', name: '音声', icon: Volume2, description: '音声設定' },
    { id: 'export', name: 'エクスポート', icon: Download, description: '出力設定' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors mr-2"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-500 rounded-xl flex items-center justify-center">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-amber-900">動画編集</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {onDashboard && (
                <button
                  onClick={onDashboard}
                  className="flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  <Home className="w-4 h-4 mr-2" />
                  ダッシュボード
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Left Panel - Video Preview */}
        <div className="w-1/2 p-8">
          <div className="bg-white rounded-2xl shadow-xl h-full p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">プレビュー</h2>
            
            {/* Video Preview */}
            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <p className="text-lg">動画プレビュー</p>
                <p className="text-sm opacity-70">編集内容がリアルタイムで反映されます</p>
              </div>
            </div>

            {/* Preview Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">再生時間</span>
                <span className="text-sm text-amber-700">{trimEnd - trimStart}秒</span>
              </div>
              
              {textOverlay && (
                <div className="bg-amber-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-amber-900">テキストオーバーレイ</p>
                  <p className="text-sm text-amber-700">"{textOverlay}"</p>
                </div>
              )}
              
              {selectedEffect !== 'none' && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-purple-900">適用エフェクト</p>
                  <p className="text-sm text-purple-700">{effects.find(e => e.id === selectedEffect)?.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Edit Controls */}
        <div className="w-1/2 p-8">
          <div className="bg-white rounded-2xl shadow-xl h-full p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-amber-900 mb-6">編集ツール</h2>

            {/* Tab Navigation */}
            <div className="flex mb-6 bg-gray-100 rounded-xl p-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-center py-2 px-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                      activeTab === tab.id
                        ? 'bg-white text-amber-700 shadow-sm'
                        : 'text-gray-600 hover:text-amber-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'trim' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 mb-4">動画のトリミング</h3>
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
                </div>
              )}

              {activeTab === 'text' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-amber-900">テキストオーバーレイ</h3>
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
                          色
                        </label>
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-full h-12 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none"
                        />
                      </div>
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
              )}

              {activeTab === 'effects' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-amber-900">視覚エフェクト</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {effects.map((effect) => (
                      <button
                        key={effect.id}
                        onClick={() => setSelectedEffect(effect.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          selectedEffect === effect.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className={`w-full h-12 rounded-lg mb-2 ${effect.preview}`}></div>
                        <p className="text-sm font-medium text-gray-700">{effect.name}</p>
                        <p className="text-xs text-gray-500">{effect.description}</p>
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        明度: {brightness}%
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        コントラスト: {contrast}%
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        彩度: {saturation}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'audio' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-amber-900">音声設定</h3>
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

              {activeTab === 'export' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-amber-900">エクスポート設定</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        フォーマット
                      </label>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none"
                      >
                        <option value="mp4">MP4</option>
                        <option value="mov">MOV</option>
                        <option value="avi">AVI</option>
                        <option value="webm">WebM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        品質
                      </label>
                      <select
                        value={exportQuality}
                        onChange={(e) => setExportQuality(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none"
                      >
                        <option value="4k">4K (3840x2160)</option>
                        <option value="1080p">Full HD (1920x1080)</option>
                        <option value="720p">HD (1280x720)</option>
                        <option value="480p">SD (854x480)</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg flex items-center justify-center disabled:opacity-50"
                  >
                    {isExporting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        エクスポート中...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        動画をエクスポート
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
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

            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 text-center">
                編集内容は新しい動画として保存されます。元の動画は保持されます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;