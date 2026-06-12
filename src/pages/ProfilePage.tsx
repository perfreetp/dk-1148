import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Settings, Edit, Plus, Heart, Calendar, Users, Image } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { Tag } from '../components/common/Tag';
import { Button } from '../components/common/Button';
import { mockPosts } from '../data/mockData';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-text-muted">请先登录</p>
      </div>
    );
  }

  const userPosts = mockPosts.filter(p => p.author.id === user.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <header className="bg-gradient-to-br from-accent to-accent-light text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-display font-bold">我的主页</h1>
            <button
              onClick={() => navigate('/settings')}
              className="touch-target rounded-full hover:bg-white/20 transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-start gap-4">
            <Avatar
              src={user.avatar}
              alt={user.username}
              size="xl"
              level={user.interests[0]?.level}
              showBadge
            />
            <div className="flex-1">
              <h2 className="text-2xl font-display font-bold mb-1">
                {user.username}
              </h2>
              <div className="flex items-center gap-1 text-sm text-white/80 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
              <p className="text-sm text-white/80 line-clamp-2">
                {user.bio}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="bg-white/20 text-white hover:bg-white/30"
              onClick={() => navigate('/profile/edit')}
            >
              <Edit className="w-4 h-4 mr-1" />
              编辑
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-text-primary">
                {user.stats.activitiesCount}
              </p>
              <p className="text-sm text-text-muted">活动</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-text-primary">
                {user.stats.followersCount}
              </p>
              <p className="text-sm text-text-muted">粉丝</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-text-primary">
                {user.stats.followingCount}
              </p>
              <p className="text-sm text-text-muted">关注</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-text-primary">
                {user.stats.postsCount}
              </p>
              <p className="text-sm text-text-muted">作品</p>
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-bold text-text-primary">
              我的兴趣
            </h3>
            <button
              onClick={() => navigate('/profile/interests')}
              className="text-sm text-accent hover:text-accent-dark transition-colors"
            >
              管理兴趣
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <Tag key={interest.id} variant="primary">
                {interest.category}
              </Tag>
            ))}
            <button
              onClick={() => navigate('/profile/interests')}
              className="inline-flex items-center justify-center w-10 h-8 rounded-full border-2 border-dashed border-primary/30 text-primary hover:bg-primary/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-bold text-text-primary">
              近期作品
            </h3>
            <button
              onClick={() => navigate('/wall')}
              className="text-sm text-accent hover:text-accent-dark transition-colors"
            >
              查看全部
            </button>
          </div>
          {userPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square rounded-xl overflow-hidden bg-bg-secondary cursor-pointer"
                  onClick={() => navigate(`/wall/${post.id}`)}
                >
                  {post.images.length > 0 ? (
                    <img
                      src={post.images[0]}
                      alt="Post"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-text-muted text-xs p-2">暂无图片</div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-xs p-2">
                      心得分享
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Image className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted mb-3">还没有发布作品</p>
              <Button size="sm" onClick={() => navigate('/wall/post')}>
                发布作品
              </Button>
            </Card>
          )}
        </div>

        <div className="space-y-3">
          <Card
            className="p-4 cursor-pointer"
            onClick={() => navigate('/activities')}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">我的活动</p>
                <p className="text-sm text-text-muted">查看参与的活动</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-4 cursor-pointer"
            onClick={() => navigate('/messages')}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-highlight/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-highlight" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">我的关注</p>
                <p className="text-sm text-text-muted">查看关注的同好</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-4 cursor-pointer"
            onClick={() => navigate('/profile/settings')}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">邀请好友</p>
                <p className="text-sm text-text-muted">分享同趣给朋友</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
