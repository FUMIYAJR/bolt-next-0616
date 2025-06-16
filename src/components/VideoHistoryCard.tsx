import React, { useState } from 'react';
import { Edit2, Check, X, Play, Calendar, Clock } from 'lucide-react';

interface VideoHistory {
  id: string;
  title: string;
  createdAt: string;
  thumbnail: string;
  duration: string;
}

interface VideoHistoryCardProps {
  video: VideoHistory;
  onTitleUpdate: (id: string, newTitle: string) => void;
  onClick?: () => void;
}

const VideoHistoryCard: React.FC<VideoHistoryCardProps> = ({ 
  video, 
  onTitleUpdate, 
  onClick 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(video.title);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== video.title) {
      onTitleUpdate(video.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(video.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={!isEditing ? onClick : undefined}
    >
      <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden mb-3 group-hover:shadow-lg transition-shadow relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Play className="w-6 h-6 text-gray-800 ml-1" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
          {video.duration}
        </div>
      </div>
      
      {/* Title section */}
      <div className="relative">
        {isEditing ? (
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 px-3 py-2 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none text-sm font-semibold"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors flex-1 pr-2">
              {video.title}
            </h4>
            {isHovered && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-all opacity-0 group-hover:opacity-100"
                title="タイトルを編集"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        
        {/* Video metadata */}
        <div className="flex items-center text-sm text-gray-500 space-x-3">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{video.createdAt}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{video.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoHistoryCard;