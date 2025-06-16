import React, { useState } from 'react';
import { X, Volume2, Palette, Ratio, Clock, Download, Share2, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  onSettingsApply?: (settings: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, videoUrl, onSettingsApply }) => {
  const [volume, setVolume] = useState(80);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [exportFormat, setExportFormat] = useState('mp4');
  const [exportQuality, setExportQuality] = useState('1080p');
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    const settings = {
      volume,
      brightness,
      contrast,
      saturation,
      format: exportFormat,
      quality: exportQuality
    };
    
    console.log('Exporting video with settings:', settings);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate download
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `fubi-video-${exportQuality}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    setIsExporting(false);
    alert(`動画を${exportQuality} ${exportFormat.toUpperCase()}形式でエクスポートしました！`);
  };

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      if (navigator.share && videoUrl) {
        await navigator.share({
          title: 'Fūbiで作成した動画',
          text: 'AIで生成した素晴らしい動画をご覧ください！',
          url: videoUrl
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        if (videoUrl) {
          await navigator.clipboard.writeText(videoUrl);
          alert('動画のURLをクリップボードにコピーしました！');
        }
      }
    } catch (error) {
      console.error('Share failed:', error);
      if (videoUrl) {
        await navigator.clipboard.writeText(videoUrl);
        alert('動画のURLをクリップボードにコピーしました！');
      }
    }
    
    setIsSharing(false);
  };

  const handleApplySettings = () => {
    const settings = {
      volume,
      brightness,
      contrast,
      saturation,
      format: exportFormat,
      quality: exportQuality
    };
    
    if (onSettingsApply) {
      onSettingsApply(settings);
    }
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
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-red-900 mb-2">動画設定</h2>
            <p className="text-gray-600">動画の品質や出力設定を調整できます</p>
          </div>

          {/* Audio Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              音声設定
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  音量: {volume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Visual Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              映像設定
            </h3>
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Export Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
              <Download className="w-5 h-5 mr-2" />
              エクスポート設定
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  フォーマット
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
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
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                >
                  <option value="4k">4K (3840x2160)</option>
                  <option value="1080p">Full HD (1920x1080)</option>
                  <option value="720p">HD (1280x720)</option>
                  <option value="480p">SD (854x480)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg flex items-center justify-center disabled:opacity-50"
            >
              {isSharing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  共有中...
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5 mr-2" />
                  共有
                </>
              )}
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-600 transition-all duration-200 shadow-lg flex items-center justify-center disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  エクスポート中...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  エクスポート
                </>
              )}
            </button>
          </div>

          {/* Apply Settings Button */}
          <button
            onClick={handleApplySettings}
            className="w-full bg-gradient-to-r from-red-600 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-amber-600 transition-all duration-200 shadow-lg flex items-center justify-center"
          >
            <Check className="w-5 h-5 mr-2" />
            設定を適用
          </button>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 text-center">
              設定を変更すると、動画の品質や容量に影響する場合があります
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;