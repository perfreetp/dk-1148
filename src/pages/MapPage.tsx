import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { List, Plus, Clock, MapPin, Users } from 'lucide-react';
import { useActivityStore } from '../stores/activityStore';
import { useInterestStore } from '../stores/interestStore';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ActivityCard } from '../components/activity/ActivityCard';
import { UserCard } from '../components/user/UserCard';
import { Tag } from '../components/common/Tag';
import { Skeleton } from '../components/common/Skeleton';
import { interestCategories } from '../data/mockData';
import 'leaflet/dist/leaflet.css';

type SortType = 'time' | 'distance' | 'spots';
type ListType = 'activities' | 'users';

const MapCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  
  return null;
};

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { activities, isLoading: activitiesLoading, fetchActivities } = useActivityStore();
  const { recommendedUsers, isLoading: usersLoading, fetchRecommendedUsers } = useInterestStore();
  
  const [showList, setShowList] = useState(false);
  const [listType, setListType] = useState<ListType>('activities');
  const [sortType, setSortType] = useState<SortType>('time');
  const [center] = useState<[number, number]>([31.2304, 121.4737]);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
    fetchRecommendedUsers();
  }, []);

  const currentUserInterests = user?.interests.map(i => i.category) || [];

  const filteredActivities = useMemo(() => {
    let filtered = selectedInterest
      ? activities.filter(a => a.tags?.includes(selectedInterest))
      : activities;

    switch (sortType) {
      case 'time':
        filtered.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        break;
      case 'spots':
        filtered.sort((a, b) => {
          const aSpots = a.maxMembers - a.currentMembers.length;
          const bSpots = b.maxMembers - b.currentMembers.length;
          return bSpots - aSpots;
        });
        break;
      case 'distance':
        filtered.sort((a, b) => {
          const distA = Math.sqrt(
            Math.pow(a.location.lat - center[0], 2) + 
            Math.pow(a.location.lng - center[1], 2)
          );
          const distB = Math.sqrt(
            Math.pow(b.location.lat - center[0], 2) + 
            Math.pow(b.location.lng - center[1], 2)
          );
          return distA - distB;
        });
        break;
    }

    return filtered;
  }, [activities, selectedInterest, sortType]);

  const filteredUsers = useMemo(() => {
    return selectedInterest
      ? recommendedUsers.filter(u => 
          u.interests.some(i => i.category === selectedInterest)
        )
      : recommendedUsers;
  }, [recommendedUsers, selectedInterest]);

  const filteredMarkers = useMemo(() => {
    const markers: any[] = [];
    
    filteredActivities.forEach(activity => {
      markers.push({
        id: `activity-${activity.id}`,
        type: 'activity',
        lat: activity.location.lat,
        lng: activity.location.lng,
        title: activity.title,
        subtitle: `${activity.location.name} · ${activity.currentMembers.length}/${activity.maxMembers}人`,
        data: activity
      });
    });
    
    filteredUsers.forEach(userItem => {
      const primaryInterest = userItem.interests[0];
      if (primaryInterest) {
        markers.push({
          id: `user-${userItem.id}`,
          type: 'user',
          lat: 31.2304 + (Math.random() - 0.5) * 0.1,
          lng: 121.4737 + (Math.random() - 0.5) * 0.1,
          title: userItem.username,
          subtitle: `${primaryInterest.category} · ${primaryInterest.level} · ${userItem.location}`,
          data: userItem
        });
      }
    });
    
    return markers;
  }, [filteredActivities, filteredUsers]);

  const handleMarkerClick = (marker: any) => {
    if (marker.type === 'activity') {
      navigate(`/activities/${marker.data.id}`);
    } else {
      navigate(`/profile/${marker.data.id}`);
    }
  };

  const handleInterestClick = (interest: string) => {
    const newInterest = selectedInterest === interest ? null : interest;
    setSelectedInterest(newInterest);
  };

  const sortOptions: { value: SortType; label: string; icon: React.ReactNode }[] = [
    { value: 'time', label: '最近时间', icon: <Clock className="w-4 h-4" /> },
    { value: 'distance', label: '离我最近', icon: <MapPin className="w-4 h-4" /> },
    { value: 'spots', label: '剩余名额', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="h-screen relative">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapCenter center={center} />
        
        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            eventHandlers={{
              click: () => handleMarkerClick(marker),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-text-primary mb-1">{marker.title}</h3>
                <p className="text-sm text-text-muted">{marker.subtitle}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    marker.type === 'activity' 
                      ? 'bg-accent/10 text-accent' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {marker.type === 'activity' ? '活动' : '同好'}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => handleMarkerClick(marker)}
                >
                  查看详情
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-display font-bold text-text-primary">
                同好地图
              </h1>
              <p className="text-sm text-text-muted">
                {selectedInterest 
                  ? `已筛选: ${selectedInterest}` 
                  : `发现 ${filteredActivities.length} 个活动、${filteredUsers.length} 位同好`}
              </p>
            </div>
            <button
              onClick={() => setShowList(!showList)}
              className="touch-target rounded-full bg-accent text-white hover:bg-accent-dark transition-colors"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </Card>
      </div>

      <div className="absolute top-28 left-4 right-4 z-[1000]">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <Tag
            variant={selectedInterest === null ? 'primary' : 'default'}
            onClick={() => handleInterestClick('')}
            className="cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            全部
          </Tag>
          {interestCategories.map((interest) => (
            <Tag
              key={interest.value}
              variant={selectedInterest === interest.value ? 'primary' : 'default'}
              onClick={() => handleInterestClick(interest.value)}
              className="cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              {interest.label}
            </Tag>
          ))}
        </div>
      </div>

      {showList && (
        <div className="absolute bottom-20 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-warm-lg max-h-[60vh] overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-white border-b border-primary/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setListType('activities')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    listType === 'activities'
                      ? 'bg-accent text-white'
                      : 'bg-bg-secondary text-text-secondary'
                  }`}
                >
                  活动 ({filteredActivities.length})
                </button>
                <button
                  onClick={() => setListType('users')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    listType === 'users'
                      ? 'bg-primary text-white'
                      : 'bg-bg-secondary text-text-secondary'
                  }`}
                >
                  同好 ({filteredUsers.length})
                </button>
              </div>
              <button
                onClick={() => setShowList(false)}
                className="text-sm text-text-muted hover:text-primary"
              >
                收起
              </button>
            </div>

            {listType === 'activities' && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortType(option.value)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      sortType === option.value
                        ? 'bg-primary text-white'
                        : 'bg-bg-secondary text-text-secondary'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {listType === 'activities' ? (
              activitiesLoading ? (
                <div className="space-y-4">
                  <Skeleton height={200} className="rounded-xl" />
                  <Skeleton height={200} className="rounded-xl" />
                </div>
              ) : filteredActivities.length === 0 ? (
                <p className="text-center text-text-muted py-8">
                  {selectedInterest 
                    ? `暂无${selectedInterest}相关活动` 
                    : '暂无活动'}
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              )
            ) : usersLoading ? (
              <div className="space-y-4">
                <Skeleton height={120} className="rounded-xl" />
                <Skeleton height={120} className="rounded-xl" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-text-muted py-8">
                {selectedInterest 
                  ? `暂无${selectedInterest}相关同好` 
                  : '暂无同好'}
              </p>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((userItem) => (
                  <UserCard 
                    key={userItem.id} 
                    user={userItem}
                    currentUserInterests={currentUserInterests}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/activities/create')}
        className="absolute bottom-24 right-4 z-[1000] w-14 h-14 bg-highlight text-white rounded-full shadow-warm-lg flex items-center justify-center hover:bg-highlight-dark transition-all duration-150 active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MapPage;
