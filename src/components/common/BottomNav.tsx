import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, Calendar, Image, MessageCircle } from 'lucide-react';
import { useMessageStore } from '../../stores/messageStore';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useMessageStore();

  const navItems = [
    { path: '/', icon: Home, label: '发现' },
    { path: '/map', icon: Map, label: '地图' },
    { path: '/activities', icon: Calendar, label: '活动' },
    { path: '/wall', icon: Image, label: '作品墙' },
    { path: '/messages', icon: MessageCircle, label: '消息' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-primary/10 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const showBadge = item.path === '/messages' && unreadCount > 0;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full touch-target transition-colors relative ${
                  active ? 'text-primary' : 'text-text-muted'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 ${active ? 'fill-primary/20' : ''}`} />
                  {showBadge && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-highlight text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
