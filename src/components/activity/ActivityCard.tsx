import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Activity } from '../../types';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Tag } from '../common/Tag';
import { formatDateTime, getRelativeTime } from '../../utils/dateUtils';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const navigate = useNavigate();

  const statusColors: Record<string, 'default' | 'primary' | 'highlight' | 'success' | 'warning'> = {
    '报名中': 'success',
    '已确认': 'primary',
    '进行中': 'highlight',
    '已完成': 'default'
  };

  return (
    <Card
      className="overflow-hidden"
      onClick={() => navigate(`/activities/${activity.id}`)}
    >
      <div className="relative h-32 bg-gradient-to-br from-accent to-accent-light">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/20 text-6xl font-display font-bold">
            {activity.type === '一对一' ? '1v1' : '团队'}
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <Tag variant={statusColors[activity.status]} size="sm">
            {activity.status}
          </Tag>
        </div>
        <div className="absolute bottom-3 left-3">
          <Tag variant="default" size="sm">
            {activity.type}
          </Tag>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display font-bold text-text-primary mb-2 line-clamp-2">
          {activity.title}
        </h3>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar className="w-4 h-4 text-accent" />
            <span>{formatDateTime(activity.startTime)}</span>
            <span className="ml-auto text-highlight font-medium">
              {getRelativeTime(activity.startTime, activity.endTime)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="truncate">{activity.location.name}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {activity.currentMembers.slice(0, 3).map((member, idx) => (
                <Avatar
                  key={member.id}
                  src={member.avatar}
                  alt={member.username}
                  size="sm"
                  className="ring-2 ring-white"
                />
              ))}
            </div>
            <span className="text-sm text-text-muted">
              {activity.currentMembers.length}/{activity.maxMembers}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-text-muted">
            <Clock className="w-4 h-4" />
            <span>{activity.currentMembers.length < activity.maxMembers ? '可报名' : '已满'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;
