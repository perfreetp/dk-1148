import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Sparkles } from 'lucide-react';
import { User } from '../../types';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Tag } from '../common/Tag';
import { Button } from '../common/Button';

interface UserCardProps {
  user: User;
  showFollowButton?: boolean;
  currentUserInterests?: string[];
  matchReason?: string;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  showFollowButton = true,
  currentUserInterests = [],
  matchReason 
}) => {
  const navigate = useNavigate();
  const primaryInterest = user.interests[0];

  const getMatchReason = () => {
    if (matchReason) return matchReason;
    
    const commonInterests = user.interests
      .filter(i => currentUserInterests.includes(i.category))
      .map(i => i.category);
    
    if (commonInterests.length > 0) {
      return `你们都热爱${commonInterests[0]}`;
    }
    
    if (primaryInterest.level === '达人') {
      return `${primaryInterest.category}达人，愿意分享经验`;
    }
    
    if (primaryInterest.communicationMode === '线下') {
      return `喜欢线下交流，常在${primaryInterest.location}活动`;
    }
    
    return null;
  };

  const reason = getMatchReason();

  return (
    <Card
      className="p-4"
      onClick={() => navigate(`/profile/${user.id}`)}
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar
          src={user.avatar}
          alt={user.username}
          size="lg"
          level={primaryInterest?.level}
          showBadge
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-text-primary truncate">
            {user.username}
          </h3>
          <div className="flex items-center gap-1 text-sm text-text-muted mt-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{user.location}</span>
          </div>
        </div>
      </div>

      {reason && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-accent/5 rounded-lg">
          <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
          <p className="text-sm text-accent font-medium line-clamp-1">
            {reason}
          </p>
        </div>
      )}

      <p className="text-sm text-text-secondary line-clamp-2 mb-3">
        {user.bio}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {user.interests.slice(0, 2).map((interest) => (
          <Tag key={interest.id} variant="primary" size="sm">
            {interest.category}
          </Tag>
        ))}
        {user.interests.length > 2 && (
          <Tag variant="default" size="sm">
            +{user.interests.length - 2}
          </Tag>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {user.stats.activitiesCount} 活动
          </span>
        </div>
        {showFollowButton && (
          <Button size="sm" variant="secondary">
            关注
          </Button>
        )}
      </div>
    </Card>
  );
};

export default UserCard;
