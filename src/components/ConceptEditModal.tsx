import React, { useState, useEffect } from 'react';
import { X, Save, Music, FileText, Clock, Plus, Trash2 } from 'lucide-react';

interface SceneData {
  id: number;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  content: string;
}

interface ConceptData {
  id: number;
  title: string;
  description: string;
  script: string;
  bgm: string;
  scenes: SceneData[];
}

interface ConceptEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  concept: ConceptData | null;
  onSave: (concept: ConceptData) => void;
}

const ConceptEditModal: React.FC<ConceptEditModalProps> = ({ isOpen, onClose, concept, onSave }) => {
  const [activeTab, setActiveTab] = useState<'script' | 'bgm' | 'scenes'>('script');
  const [editedConcept, setEditedConcept] = useState<ConceptData | null>(null);

  const bgmOptions = [
    'エモーショナル・ピアノ',
    'シネマティック・オーケストラ',
    'モダン・エレクトロニック',
    'アコースティック・ギター',
    'アンビエント・シンセ',
    'ジャズ・ピアノ',
    'ロック・インストゥルメンタル',
    'クラシック・ストリングス'
  ];

  useEffect(() => {
    if (concept) {
      setEditedConcept({ ...concept });
    }
  }, [concept]);

  const handleSave = () => {
    if (editedConcept) {
      onSave(editedConcept);
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
      content: 'シーンの内容を入力してください'
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

  if (!isOpen || !editedConcept) return null;

  const tabs = [
    { id: 'script', name: '台本', icon: FileText },
    { id: 'bgm', name: 'BGM', icon: Music },
    { id: 'scenes', name: 'シーン', icon: Clock }
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
            <h2 className="text-3xl font-bold text-red-900 mb-2">構成案を編集</h2>
            <p className="text-gray-600">{editedConcept.title}の詳細を編集できます</p>
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
            {activeTab === 'script' && (
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
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
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
                    rows={3}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
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
                    rows={8}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="動画の台本を入力してください..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'bgm' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    BGMを選択
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {bgmOptions.map((bgm) => (
                      <button
                        key={bgm}
                        onClick={() => setEditedConcept({
                          ...editedConcept,
                          bgm: bgm
                        })}
                        className={`p-4 border-2 rounded-xl transition-all text-left ${
                          editedConcept.bgm === bgm
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <Music className="w-5 h-5 text-red-600 mr-3" />
                          <span className="font-medium">{bgm}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-blue-700">
                    選択したBGM: <strong>{editedConcept.bgm}</strong>
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'scenes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-red-900">シーン構成</h3>
                  <button
                    onClick={addScene}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    シーンを追加
                  </button>
                </div>

                <div className="space-y-4">
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
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
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
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
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
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
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
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          シーン内容
                        </label>
                        <textarea
                          value={scene.content}
                          onChange={(e) => updateScene(scene.id, { content: e.target.value })}
                          rows={3}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="mt-3 text-sm text-gray-500">
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-red-700 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-800 hover:to-red-700 transition-all duration-200 shadow-lg flex items-center justify-center"
            >
              <Save className="w-5 h-5 mr-2" />
              変更を保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptEditModal;