import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Plus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useActivityStore } from '../stores/activityStore';
import { useInterestStore } from '../stores/interestStore';
import { ActivityCard } from '../components/activity/ActivityCard';
import { UserCard } from '../components/user/UserCard';
import { CardSkeleton, ActivitySkeleton } from '../components/common/Skeleton';
import { interestCategories } from '../data/mockData';
import { Tag } from '../components/common/Tag';
import { Avatar } from '../components/common/Avatar';
import { Card } from '../components/common/Card';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { activities, isLoading: activitiesLoading, fetchActivities } = useActivityStore();
  const { recommendedUsers, isLoading: usersLoading, fetchRecommendedUsers } = useInterestStore();
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
    fetchRecommendedUsers();
  }, []);

  const filteredActivities = selectedInterest
    ? activities.filter(a => a.tags?.includes(selectedInterest))
    : activities;

  const filteredUsers = selectedInterest
    ? recommendedUsers.filter(u => 
        u.interests.some(i => i.category === selectedInterest)
      )
    : recommendedUsers;

  const displayedActivities = filteredActivities.slice(0, 4);
  const displayedUsers = filteredUsers.slice(0, 4);

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-gradient">
                同趣
              </h1>
              <p className="text-sm text-text-muted">
                发现身边的同好
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/search')}
                className="touch-target rounded-full hover:bg-bg-secondary transition-colors"
              >
                <Search className="w-6 h-6 text-text-secondary" />
              </button>
              <button
                onClick={() => navigate('/messages')}
                className="touch-target rounded-full hover:bg-bg-secondary transition-colors"
              >
                <Bell className="w-6 h-6 text-text-secondary" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Avatar
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
              alt={user?.username || 'User'}
              size="md"
            />
            <div className="flex-1">
              <p className="text-sm text-text-muted">欢迎回来，</p>
              <p className="font-display font-bold text-text-primary">
                {user?.username || '用户'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">探索兴趣</h2>
            {selectedInterest && (
              <button
                onClick={() => setSelectedInterest(null)}
                className="text-sm text-accent hover:text-accent-dark transition-colors"
              >
                清除筛选
              </button>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            <Tag
              variant={selectedInterest === null ? 'primary' : 'default'}
              className="cursor-pointer whitespace-nowrap flex-shrink-0"
              onClick={() => setSelectedInterest(null)}
            >
              全部
            </Tag>
            {interestCategories.map((interest) => (
              <Tag
                key={interest.value}
                variant={selectedInterest === interest.value ? 'primary' : 'default'}
                className="cursor-pointer whitespace-nowrap flex-shrink-0"
                onClick={() => setSelectedInterest(
                  selectedInterest === interest.value ? null : interest.value
                )}
              >
                {interest.label}
              </Tag>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">
              推荐同好 {selectedInterest && `· ${selectedInterest}`}
            </h2>
            <button
              onClick={() => navigate('/users')}
              className="text-sm text-accent hover:text-accent-dark transition-colors"
            >
              查看更多
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 stagger-animation">
            {usersLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : displayedUsers.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-text-muted">
                  {selectedInterest 
                    ? `暂无${selectedInterest}相关的同好` 
                    : '暂无推荐的同好'}
                </p>
              </Card>
            ) : (
              displayedUsers.map((userItem) => (
                <UserCard key={userItem.id} user={userItem} />
              ))
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">
              近期活动 {selectedInterest && `· ${selectedInterest}`}
            </h2>
            <button
              onClick={() => navigate('/activities')}
              className="text-sm text-accent hover:text-accent-dark transition-colors"
            >
              查看全部
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-animation">
            {activitiesLoading ? (
              <>
                <ActivitySkeleton />
                <ActivitySkeleton />
              </>
            ) : displayedActivities.length === 0 ? (
              <Card className="col-span-full p-8 text-center">
                <p className="text-text-muted">
                  {selectedInterest 
                    ? `暂无${selectedInterest}相关的活动` 
                    : '暂无活动'}
                </p>
              </Card>
            ) : (
              displayedActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </section>
      </main>

      <button
        onClick={() => navigate('/activities/create')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-highlight text-white rounded-full shadow-warm-lg flex items-center justify-center hover:bg-highlight-dark transition-all duration-150 active:scale-95 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default HomePage;
