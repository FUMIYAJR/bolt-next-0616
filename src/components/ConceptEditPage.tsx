import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Music, FileText, Clock, Plus, Trash2, Upload, X, Image, Video as VideoIcon } from 'lucide-react';

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

interface ConceptEditPageProps {
  concept: ConceptData | null;
  onComplete: (concept: ConceptData) => void;
  onBack: () => void;
}

interface MediaFile {
  file: File;
  preview?: string;
  type: 'image' | 'video' | 'other';
}

const ConceptEditPage: React.FC<ConceptEditPageProps> = ({ concept, onComplete, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'script' | 'bgm' | 'scenes' | 'media'>('overview');
  const [editedConcept, setEditedConcept] = useState<ConceptData | null>(null);
  const [globalMediaFiles, setGlobalMediaFiles] = useState<MediaFile[]>([]);

  const bgmOptions = [
    'エモーショナル・ピアノ',
    'シネマティック・オーケストラ',
    'モダン・エレクトロニック',
    'アコースティック・ギター',
    'アンビエント・シンセ',
    'ジャズ・ピアノ',
    'ロック・インストゥルメンタル',
    'クラシック・ストリングス',
    'ポップ・シンセサイザー',
    'フォーク・アコースティック'
  ];

  useEffect(() => {
    if (concept) {
      setEditedConcept({ ...concept });
    }
  }, [concept]);

  const getFileType = (file: File): 'image' | 'video' | 'other' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'other';
  };

  const handleGlobalMediaUpload = (files: FileList) => {
    const newFiles: MediaFile[] = [];
    
    Array.from(files).forEach((file) => {
      const fileType = getFileType(file);
      const mediaFile: MediaFile = {
        file,
        type: fileType
      };

      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          mediaFile.preview = e.target?.result as string;
          setGlobalMediaFiles(prev => [...prev, mediaFile]);
        };
        reader.readAsDataURL(file);
      } else {
        newFiles.push(mediaFile);
      }
    });

    if (newFiles.length > 0) {
      setGlobalMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleSceneMediaUpload = (sceneId: number, files: FileList) => {
    if (!editedConcept) return;

    const newFiles: File[] = Array.from(files);
    
    setEditedConcept({
      ...editedConcept,
      scenes: editedConcept.scenes.map(scene => 
        scene.id === sceneId 
          ? { ...scene, mediaFiles: [...(scene.mediaFiles || []), ...newFiles] }
          : scene
      )
    });
  };

  const removeGlobalMedia = (index: number) => {
    setGlobalMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeSceneMedia = (sceneId: number, fileIndex: number) => {
    if (!editedConcept) return;

    setEditedConcept({
      ...editedConcept,
      scenes: editedConcept.scenes.map(scene => 
        scene.id === sceneId 
          ? { ...scene, mediaFiles: scene.mediaFiles?.filter((_, i) => i !== fileIndex) || [] }
          : scene
      )
    });
  };

  const handleComplete = () => {
    if (editedConcept) {
      // Add global media files to the concept
      const conceptWithMedia = {
        ...editedConcept,
        mediaFiles: globalMediaFiles.map(mf => mf.file)
      };
      onComplete(conceptWithMedia);
    }
  };

  const addScene = () => {
    if (!editedConcept) return;
    
    const newScene: SceneData = {
      id: editedConcept.scenes.length + 1,
      title: '新しいシーン',
      description: 'シーンの説明を入力してください',
      startTime: editedConcept.scenes.length > 0 ? editedConcept.scenes[editedConcept.scenes.length - 1].endTime : 0,
      endTime: editedConcept.scenes.length > 0 ? editedConcept.scenes[editedConcept.scenes.length - 1].endTime + 5 : 5,
      content: 'シーンの内容を入力してください',
      mediaFiles: []
    };

    setEditedConcept({
      ...editedConcept,
      scenes: [...editedConcept.scenes, newScene]
    });
  };

  const removeScene = (sceneId: number) => {
    if (!editedConcept) return;
    
    setEditedConcept({
      ...editedConcept,
      scenes: editedConcept.scenes.filter(scene => scene.id !== sceneId)
    });
  };

  const updateScene = (sceneId: number, updates: Partial<SceneData>) => {
    if (!editedConcept) return;
    
    setEditedConcept({
      ...editedConcept,
      scenes: editedConcept.scenes.map(scene => 
        scene.id === sceneId ? { ...scene, ...updates } : scene
      )
    });
  };

  const getFileIcon = (type: 'image' | 'video' | 'other') => {
    switch (type) {
      case 'image': return Image;
      case 'video': return VideoIcon;
      default: return FileText;
    }
  };

  if (!editedConcept) return null;

  const tabs = [
    { id: 'overview', name: '概要', icon: FileText },
    { id: 'script', name: '台本', icon: FileText },
    { id: 'bgm', name: 'BGM', icon: Music },
    { id: 'scenes', name: 'シーン', icon: Clock },
    { id: 'media', name: 'メディア', icon: Upload }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 text-orange-700 hover:bg-orange-100 rounded-lg transition-colors mr-2"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-700 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">Foobi</span>
              </div>
              <h1 className="text-2xl font-bold text-orange-900">構成案編集</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-orange-900 mb-2">{editedConcept.title}</h2>
              <p className="text-gray-600">構成案を詳細に編集して、理想の動画を作成しましょう</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex mb-8 bg-gray-100 rounded-xl p-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-white text-orange-700 shadow-sm'
                        : 'text-gray-600 hover:text-orange-600'
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
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      構成案タイトル
                    </label>
                    <input
                      type="text"
                      value={editedConcept.title}
                      onChange={(e) => setEditedConcept({
                        ...editedConcept,
                        title: e.target.value
                      })}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      説明
                    </label>
                    <textarea
                      value={editedConcept.description}
                      onChange={(e) => setEditedConcept({
                        ...editedConcept,
                        description: e.target.value
                      })}
                      rows={4}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="bg-orange-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-orange-900 mb-2">構成案の概要</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">シーン数:</span>
                        <span className="ml-2 text-orange-700">{editedConcept.scenes.length}個</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">総時間:</span>
                        <span className="ml-2 text-orange-700">
                          {editedConcept.scenes[editedConcept.scenes.length - 1]?.endTime || 0}秒
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">BGM:</span>
                        <span className="ml-2 text-orange-700">{editedConcept.bgm}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'script' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      台本
                    </label>
                    <textarea
                      value={editedConcept.script}
                      onChange={(e) => setEditedConcept({
                        ...editedConcept,
                        script: e.target.value
                      })}
                      rows={12}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors font-mono text-sm"
                      placeholder="動画の台本を入力してください..."
                    />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-900 mb-2">台本作成のコツ</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 視聴者の注意を引く印象的な導入から始める</li>
                      <li>• 明確で簡潔な言葉を使用する</li>
                      <li>• 感情に訴えかける表現を取り入れる</li>
                      <li>• 行動を促す強いクロージングで締めくくる</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'bgm' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      BGMを選択
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {bgmOptions.map((bgm) => (
                        <button
                          key={bgm}
                          onClick={() => setEditedConcept({
                            ...editedConcept,
                            bgm: bgm
                          })}
                          className={`p-4 border-2 rounded-xl transition-all text-left ${
                            editedConcept.bgm === bgm
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <Music className="w-5 h-5 text-orange-600 mr-3" />
                            <span className="font-medium text-sm">{bgm}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm text-green-700">
                      選択したBGM: <strong>{editedConcept.bgm}</strong>
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      BGMは動画の雰囲気を大きく左右します。コンテンツの内容に合ったものを選択してください。
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'scenes' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-orange-900">シーン構成</h3>
                    <button
                      onClick={addScene}
                      className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      シーンを追加
                    </button>
                  </div>

                  <div className="space-y-6">
                    {editedConcept.scenes.map((scene, index) => (
                      <div key={scene.id} className="bg-gray-50 p-6 rounded-xl">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">
                            シーン {index + 1}
                          </h4>
                          {editedConcept.scenes.length > 1 && (
                            <button
                              onClick={() => removeScene(scene.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              タイトル
                            </label>
                            <input
                              type="text"
                              value={scene.title}
                              onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              説明
                            </label>
                            <input
                              type="text"
                              value={scene.description}
                              onChange={(e) => updateScene(scene.id, { description: e.target.value })}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              開始時間 (秒)
                            </label>
                            <input
                              type="number"
                              value={scene.startTime}
                              onChange={(e) => updateScene(scene.id, { startTime: Number(e.target.value) })}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              終了時間 (秒)
                            </label>
                            <input
                              type="number"
                              value={scene.endTime}
                              onChange={(e) => updateScene(scene.id, { endTime: Number(e.target.value) })}
                              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            シーン内容
                          </label>
                          <textarea
                            value={scene.content}
                            onChange={(e) => updateScene(scene.id, { content: e.target.value })}
                            rows={3}
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                          />
                        </div>

                        {/* Scene Media Upload */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            シーン専用メディア
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                            <input
                              type="file"
                              multiple
                              accept="image/*,video/*"
                              onChange={(e) => e.target.files && handleSceneMediaUpload(scene.id, e.target.files)}
                              className="hidden"
                              id={`scene-media-${scene.id}`}
                            />
                            <label
                              htmlFor={`scene-media-${scene.id}`}
                              className="flex flex-col items-center cursor-pointer"
                            >
                              <Upload className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-600">このシーン用の画像・動画をアップロード</span>
                            </label>
                          </div>

                          {scene.mediaFiles && scene.mediaFiles.length > 0 && (
                            <div className="mt-3 grid grid-cols-3 gap-2">
                              {scene.mediaFiles.map((file, fileIndex) => {
                                const Icon = getFileIcon(getFileType(file));
                                return (
                                  <div key={fileIndex} className="relative bg-gray-100 p-2 rounded-lg">
                                    <div className="flex items-center">
                                      <Icon className="w-4 h-4 text-gray-500 mr-2" />
                                      <span className="text-xs text-gray-700 truncate">{file.name}</span>
                                    </div>
                                    <button
                                      onClick={() => removeSceneMedia(scene.id, fileIndex)}
                                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div className="text-sm text-gray-500 bg-white p-3 rounded-lg">
                          シーンの長さ: {scene.endTime - scene.startTime}秒
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-700 text-center">
                      総動画時間: {editedConcept.scenes[editedConcept.scenes.length - 1]?.endTime || 0}秒
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-orange-900 mb-4">グローバルメディア</h3>
                    <p className="text-gray-600 mb-4">
                      動画全体で使用する画像や動画をアップロードしてください。これらのメディアは全てのシーンで利用できます。
                    </p>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={(e) => e.target.files && handleGlobalMediaUpload(e.target.files)}
                        className="hidden"
                        id="global-media-upload"
                      />
                      <label htmlFor="global-media-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">
                          画像・動画をアップロード
                        </h4>
                        <p className="text-gray-500 mb-4">
                          ドラッグ&ドロップ、またはクリックしてファイルを選択
                        </p>
                        <div className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                          ファイルを選択
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          JPG、PNG、MP4、MOV形式対応（最大100MBまで）
                        </p>
                      </label>
                    </div>
                  </div>

                  {globalMediaFiles.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-4">アップロード済みメディア</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {globalMediaFiles.map((mediaFile, index) => {
                          const Icon = getFileIcon(mediaFile.type);
                          return (
                            <div key={index} className="relative bg-gray-50 rounded-xl overflow-hidden">
                              {mediaFile.preview ? (
                                <img
                                  src={mediaFile.preview}
                                  alt={mediaFile.file.name}
                                  className="w-full h-32 object-cover"
                                />
                              ) : (
                                <div className="w-full h-32 flex items-center justify-center bg-gray-200">
                                  <Icon className="w-8 h-8 text-gray-500" />
                                </div>
                              )}
                              <div className="p-3">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {mediaFile.file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(mediaFile.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <button
                                onClick={() => removeGlobalMedia(index)}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-yellow-900 mb-2">メディア使用のヒント</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• 高解像度の画像を使用すると、より鮮明な動画が生成されます</li>
                      <li>• 動画ファイルは自動的に最適化されます</li>
                      <li>• ブランドロゴやキーとなる画像は最初にアップロードしてください</li>
                      <li>• シーン専用メディアは、特定のシーンでのみ使用されます</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-colors"
              >
                戻る
              </button>
              <button
                onClick={handleComplete}
                className="flex-2 bg-gradient-to-r from-orange-700 to-red-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-orange-800 hover:to-red-700 transition-all duration-200 shadow-lg flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" />
                編集完了・動画生成開始
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptEditPage;