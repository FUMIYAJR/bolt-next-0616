import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

interface AutoSidebarProps {
  isLoggedIn: boolean;
  onSidebarOpen: () => void;
}

const AutoSidebar: React.FC<AutoSidebarProps> = ({ isLoggedIn, onSidebarOpen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Left edge trigger zone (0-50px from left)
      if (e.clientX <= 50) {
        setShowTrigger(true);
        if (e.clientX <= 20) {
          setIsHovered(true);
        }
      } else {
        setShowTrigger(false);
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setShowTrigger(false);
      setIsHovered(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => {
        onSidebarOpen();
        setIsHovered(false);
        setShowTrigger(false);
      }, 300); // 300ms delay before opening

      return () => clearTimeout(timer);
    }
  }, [isHovered, onSidebarOpen]);

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Invisible trigger zone */}
      <div 
        className="fixed left-0 top-0 w-12 h-full z-30 pointer-events-auto"
        style={{ background: 'transparent' }}
      />
      
      {/* Always visible sidebar indicator */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
        <button
          onClick={onSidebarOpen}
          className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group"
        >
          <Menu className="w-5 h-5 text-white group-hover:w-6 group-hover:h-6 transition-all duration-200" />
        </button>
        
        {/* Tooltip */}
        <div className="absolute left-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          サイドバーを開く
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </div>
      
      {/* Enhanced trigger indicator (appears on hover) */}
      {showTrigger && (
        <div 
          className={`fixed left-0 top-1/2 transform -translate-y-1/2 z-30 transition-all duration-200 ${
            isHovered ? 'translate-x-2 scale-110' : 'translate-x-0'
          }`}
        >
          <div className={`w-8 h-16 bg-gradient-to-r from-orange-600/80 to-orange-500/80 rounded-r-full flex items-center justify-center shadow-lg transition-all duration-200 ${
            isHovered ? 'w-12 shadow-xl from-orange-600 to-orange-500' : ''
          }`}>
            <Menu className={`text-white transition-all duration-200 ${
              isHovered ? 'w-6 h-6' : 'w-4 h-4'
            }`} />
          </div>
          
          {/* Enhanced tooltip */}
          {isHovered && (
            <div className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
              自動でサイドバーを開く
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AutoSidebar;