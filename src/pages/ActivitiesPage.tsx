import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useActivityStore } from '../stores/activityStore';
import { ActivityCard } from '../components/activity/ActivityCard';
import { ActivitySkeleton } from '../components/common/Skeleton';
import { Tag } from '../components/common/Tag';
import { Card } from '../components/common/Card';
import { interestCategories } from '../data/mockData';

const ActivitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { activities, isLoading, fetchActivities } = useActivityStore();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = selectedTag
    ? activities.filter(a => a.tags?.includes(selectedTag))
    : activities;

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-display font-bold text-text-primary">
            活动列表
          </h1>
          <p className="text-sm text-text-muted mt-1">
            发现精彩活动，找到志同道合的伙伴
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <Tag
            variant={selectedTag === null ? 'primary' : 'default'}
            onClick={() => setSelectedTag(null)}
            className="cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            全部
          </Tag>
          {interestCategories.map((interest) => (
            <Tag
              key={interest.value}
              variant={selectedTag === interest.value ? 'primary' : 'default'}
              onClick={() => setSelectedTag(
                selectedTag === interest.value ? null : interest.value
              )}
              className="cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              {interest.label}
            </Tag>
          ))}
        </div>

        <div className="space-y-4 stagger-animation">
          {isLoading ? (
            <>
              <ActivitySkeleton />
              <ActivitySkeleton />
              <ActivitySkeleton />
            </>
          ) : filteredActivities.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-text-muted">暂无符合条件的活动</p>
              <button
                onClick={() => navigate('/activities/create')}
                className="mt-4 text-accent hover:text-accent-dark"
              >
                发起第一个活动
              </button>
            </Card>
          ) : (
            filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </div>
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

export default ActivitiesPage;
