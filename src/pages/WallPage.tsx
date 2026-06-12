import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Plus, Filter } from 'lucide-react';
import { usePostStore } from '../stores/postStore';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { Tag } from '../components/common/Tag';
import { Skeleton } from '../components/common/Skeleton';
import { formatDate } from '../utils/dateUtils';

const WallPage: React.FC = () => {
  const navigate = useNavigate();
  const { posts, isLoading, fetchPosts, likePost, bookmarkPost } = usePostStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-text-primary">
                作品墙
              </h1>
              <p className="text-sm text-text-muted mt-1">
                发现灵感，分享热爱
              </p>
            </div>
            <button className="touch-target rounded-full hover:bg-bg-secondary transition-colors">
              <Filter className="w-6 h-6 text-text-secondary" />
            </button>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-2">
            <Tag variant="primary">全部</Tag>
            <Tag variant="default">作品展示</Tag>
            <Tag variant="default">心得分享</Tag>
            <Tag variant="default">物品交换</Tag>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 stagger-animation">
          {isLoading ? (
            <>
              <div className="bg-white rounded-xl shadow-card overflow-hidden">
                <Skeleton height={200} className="w-full" />
                <div className="p-4">
                  <Skeleton width="80%" height={20} className="mb-2" />
                  <Skeleton height={60} className="mb-3" />
                  <div className="flex justify-between">
                    <Skeleton width={100} height={32} />
                    <Skeleton width={100} height={32} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="p-4">
                  <div
                    className="flex items-start gap-3 mb-3 cursor-pointer"
                    onClick={() => navigate(`/profile/${post.author.id}`)}
                  >
                    <Avatar
                      src={post.author.avatar}
                      alt={post.author.username}
                      size="md"
                      level={post.author.interests[0]?.level}
                      showBadge
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-text-primary">
                        {post.author.username}
                      </h3>
                      <p className="text-sm text-text-muted">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                    <Tag variant="highlight" size="sm">
                      {post.type}
                    </Tag>
                  </div>

                  <p className="text-text-secondary mb-3 leading-relaxed">
                    {post.content}
                  </p>

                  {post.images.length > 0 && (
                    <div className="mb-3">
                      <img
                        src={post.images[0]}
                        alt="Post image"
                        className="w-full h-64 object-cover rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => user && likePost(post.id, user.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          post.isLiked ? 'text-highlight' : 'text-text-muted hover:text-highlight'
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`}
                        />
                        <span className="text-sm">{post.likes}</span>
                      </button>

                      <button
                        onClick={() => navigate(`/wall/${post.id}`)}
                        className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments.length}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => bookmarkPost(post.id)}
                      className={`touch-target rounded-full transition-colors ${
                        post.isBookmarked ? 'text-highlight' : 'text-text-muted hover:text-highlight'
                      }`}
                    >
                      <Bookmark
                        className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`}
                      />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      <button
        onClick={() => navigate('/wall/post')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-highlight text-white rounded-full shadow-warm-lg flex items-center justify-center hover:bg-highlight-dark transition-all duration-150 active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default WallPage;
