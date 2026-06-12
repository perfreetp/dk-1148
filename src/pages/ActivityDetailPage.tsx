import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2, MessageCircle } from 'lucide-react';
import { useActivityStore } from '../stores/activityStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { Tag } from '../components/common/Tag';
import { Card } from '../components/common/Card';
import { formatDateTime, getRelativeTime } from '../utils/dateUtils';
import { getDistanceFromUser } from '../utils/locationUtils';

const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activities, currentActivity, getActivityById, joinActivity, leaveActivity, fetchActivities } = useActivityStore();
  const { user } = useAuthStore();
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      if (activities.length === 0) {
        await fetchActivities();
      }
      
      const activity = activities.find(a => a.id === id);
      if (activity) {
        getActivityById(id);
      } else {
        await getActivityById(id);
      }
      
      setIsLoading(false);
    };
    
    loadActivity();
  }, [id, activities.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">加载中...</p>
        </div>
      </div>
    );
  }

  if (!currentActivity) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">活动不存在或已被删除</p>
          <Button onClick={() => navigate('/activities')}>返回活动列表</Button>
        </div>
      </div>
    );
  }

  const isCreator = user?.id === currentActivity.creator.id;
  const isMember = currentActivity.currentMembers.some(m => m.id === user?.id);
  const isFull = currentActivity.currentMembers.length >= currentActivity.maxMembers;

  const handleJoinOrLeave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsJoining(true);
    try {
      if (isMember) {
        await leaveActivity(currentActivity.id, user.id);
      } else {
        if (!isFull) {
          await joinActivity(currentActivity.id, user);
        }
      }
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-accent to-accent-light">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/20 text-8xl font-display font-bold">
              {currentActivity.type === '一对一' ? '1v1' : '团队'}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-warm"
        >
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>

        <button
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-warm"
        >
          <Share2 className="w-5 h-5 text-text-primary" />
        </button>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <Card className="p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
                {currentActivity.title}
              </h1>
              <div className="flex gap-2 flex-wrap">
                <Tag variant="primary">{currentActivity.type}</Tag>
                <Tag variant={currentActivity.status === '报名中' ? 'success' : 'default'}>
                  {currentActivity.status}
                </Tag>
                {currentActivity.tags?.map(tag => (
                  <Tag key={tag} variant="default">{tag}</Tag>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 text-text-secondary">
              <Calendar className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="font-medium">{formatDateTime(currentActivity.startTime)}</p>
                <p className="text-sm text-text-muted">
                  {getRelativeTime(currentActivity.startTime, currentActivity.endTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-text-secondary">
              <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="font-medium">{currentActivity.location.name}</p>
                <p className="text-sm text-text-muted">
                  {getDistanceFromUser(currentActivity.location)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-text-secondary">
              <Users className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="font-medium">
                  {currentActivity.currentMembers.length} / {currentActivity.maxMembers} 人
                </p>
                <p className="text-sm text-text-muted">
                  {isFull ? '名额已满' : `还有 ${currentActivity.maxMembers - currentActivity.currentMembers.length} 个名额`}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-4">
          <h2 className="font-display font-bold text-text-primary mb-4">
            活动详情
          </h2>
          <p className="text-text-secondary leading-relaxed">
            {currentActivity.description}
          </p>
        </Card>

        <Card className="p-6 mb-4">
          <h2 className="font-display font-bold text-text-primary mb-4">
            组织者
          </h2>
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate(`/profile/${currentActivity.creator.id}`)}
          >
            <Avatar
              src={currentActivity.creator.avatar}
              alt={currentActivity.creator.username}
              size="lg"
              level={currentActivity.creator.interests[0]?.level}
              showBadge
            />
            <div className="flex-1">
              <h3 className="font-display font-bold text-text-primary">
                {currentActivity.creator.username}
              </h3>
              <p className="text-sm text-text-muted">
                {currentActivity.creator.location}
              </p>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/messages/${currentActivity.creator.id}`);
              }}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              私信
            </Button>
          </div>
        </Card>

        <Card className="p-6 mb-4">
          <h2 className="font-display font-bold text-text-primary mb-4">
            已报名成员 ({currentActivity.currentMembers.length})
          </h2>
          <div className="space-y-3">
            {currentActivity.currentMembers.length === 0 ? (
              <p className="text-text-muted text-center py-4">还没有人报名，快来成为第一个吧！</p>
            ) : (
              currentActivity.currentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/profile/${member.id}`)}
                >
                  <Avatar
                    src={member.avatar}
                    alt={member.username}
                    size="md"
                    level={member.interests[0]?.level}
                    showBadge
                  />
                  <div className="flex-1">
                    <p className="font-medium text-text-primary">{member.username}</p>
                    <p className="text-sm text-text-muted">
                      {member.interests[0]?.category} · {member.interests[0]?.level}
                    </p>
                  </div>
                  {member.id === currentActivity.creator.id && (
                    <Tag variant="primary" size="sm">组织者</Tag>
                  )}
                </div>
              ))
            )}
          </div>
          
          {!isFull && currentActivity.currentMembers.length > 0 && (
            <p className="text-sm text-accent mt-4 text-center">
              还差 {currentActivity.maxMembers - currentActivity.currentMembers.length} 人成局，快来报名吧！
            </p>
          )}
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-primary/10 p-4">
        <div className="container mx-auto max-w-md flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => navigate(`/messages/${currentActivity.creator.id}`)}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            咨询
          </Button>
          {!isCreator && (
            <Button
              variant={isMember ? 'ghost' : 'primary'}
              className="flex-1"
              onClick={handleJoinOrLeave}
              loading={isJoining}
              disabled={!isMember && isFull}
            >
              {isMember ? '取消报名' : isFull ? '已满' : '立即报名'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
