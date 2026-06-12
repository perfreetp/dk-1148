import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useMessageStore } from '../stores/messageStore';
import { useAuthStore } from '../stores/authStore';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { mockUsers } from '../data/mockData';
import { formatDate, formatTime } from '../utils/dateUtils';

const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentMessages, getMessages, sendMessage, markAsRead } = useMessageStore();
  
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatPartner = mockUsers.find(u => u.id === userId);

  useEffect(() => {
    if (userId) {
      getMessages(userId);
    }
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  if (!user || !chatPartner) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-text-muted">加载中...</p>
      </div>
    );
  }

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(chatPartner.id, message.trim(), user);
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/messages')}
              className="touch-target rounded-full hover:bg-bg-secondary transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-text-primary" />
            </button>
            <Avatar
              src={chatPartner.avatar}
              alt={chatPartner.username}
              size="md"
              level={chatPartner.interests[0]?.level}
              showBadge
            />
            <div className="flex-1">
              <h1 className="font-display font-bold text-text-primary">
                {chatPartner.username}
              </h1>
              <p className="text-xs text-text-muted">
                {chatPartner.location}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="space-y-4">
          {currentMessages.map((msg) => {
            const isOwnMessage = msg.sender.id === user.id;
            
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
              >
                {!isOwnMessage && (
                  <Avatar
                    src={msg.sender.avatar}
                    alt={msg.sender.username}
                    size="sm"
                  />
                )}
                <div
                  className={`max-w-[75%] ${
                    isOwnMessage ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-white text-text-primary rounded-bl-md'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                  <p className={`text-xs text-text-muted mt-1 ${
                    isOwnMessage ? 'text-right' : ''
                  }`}>
                    {formatTime(msg.sentAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-primary/10 p-4 z-50">
        <div className="container mx-auto max-w-md flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            className="flex-1 px-4 py-3 rounded-full bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            loading={isSending}
            className="rounded-full"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
