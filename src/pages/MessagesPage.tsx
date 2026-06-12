import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { useMessageStore } from '../stores/messageStore';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { formatDate } from '../utils/dateUtils';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { conversations, fetchConversations, isLoading } = useMessageStore();

  useEffect(() => {
    fetchConversations();
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-display font-bold text-text-primary">
            消息
          </h1>
          <p className="text-sm text-text-muted mt-1">
            与同好交流互动
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {conversations.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="font-display font-bold text-text-primary mb-2">
              还没有消息
            </h3>
            <p className="text-text-muted">
              去发现页找感兴趣的同好，发起对话吧！
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="p-4 cursor-pointer"
                onClick={() => navigate(`/messages/${conversation.user.id}`)}
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    src={conversation.user.avatar}
                    alt={conversation.user.username}
                    size="lg"
                    level={conversation.user.interests[0]?.level}
                    showBadge
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display font-bold text-text-primary truncate">
                        {conversation.user.username}
                      </h3>
                      <span className="text-xs text-text-muted flex-shrink-0">
                        {formatDate(conversation.lastMessage.sentAt)}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-1 mb-2">
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-highlight text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesPage;
