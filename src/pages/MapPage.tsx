import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Filter, List, Plus } from 'lucide-react';
import { mockMapMarkers, mockActivities } from '../data/mockData';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ActivityCard } from '../components/activity/ActivityCard';
import { Tag } from '../components/common/Tag';
import { interestCategories } from '../data/mockData';
import 'leaflet/dist/leaflet.css';

const MapCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  
  return null;
};

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [showList, setShowList] = useState(false);
  const [center] = useState<[number, number]>([31.2304, 121.4737]);
  const [selectedMarker, setSelectedMarker] = useState<typeof mockMapMarkers[0] | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  const filteredMarkers = selectedInterest
    ? mockMapMarkers.filter(m => {
        const activity = mockActivities.find(a => 
          a.title === m.title || m.title.includes(a.tags?.[0] || '')
        );
        if (!activity) return true;
        return activity.tags?.includes(selectedInterest);
      })
    : mockMapMarkers;

  const filteredActivities = selectedInterest
    ? mockActivities.filter(a => a.tags?.includes(selectedInterest))
    : mockActivities;

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
              click: () => setSelectedMarker(marker),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-text-primary mb-1">{marker.title}</h3>
                <p className="text-sm text-text-muted">{marker.subtitle}</p>
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => {
                    if (marker.type === 'activity') {
                      const activity = mockActivities.find(a => a.title === marker.title);
                      if (activity) {
                        navigate(`/activities/${activity.id}`);
                      }
                    } else {
                      navigate(`/profile/${marker.id.replace('marker', '')}`);
                    }
                  }}
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
                发现附近的同好和活动
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowList(!showList)}
                className="touch-target rounded-full bg-accent text-white hover:bg-accent-dark transition-colors"
              >
                <List className="w-5 h-5" />
              </button>
              <button className="touch-target rounded-full bg-white text-accent border border-accent hover:bg-accent hover:text-white transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="absolute top-28 left-4 right-4 z-[1000] flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        <Tag
          variant={selectedInterest === null ? 'primary' : 'default'}
          onClick={() => setSelectedInterest(null)}
          className="cursor-pointer whitespace-nowrap flex-shrink-0"
        >
          全部
        </Tag>
        {interestCategories.map((interest) => (
          <Tag
            key={interest.value}
            variant={selectedInterest === interest.value ? 'primary' : 'default'}
            onClick={() => setSelectedInterest(
              selectedInterest === interest.value ? null : interest.value
            )}
            className="cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            {interest.label}
          </Tag>
        ))}
      </div>

      {showList && (
        <div className="absolute bottom-20 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-warm-lg max-h-[50vh] overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-text-primary">
                附近活动 {selectedInterest && `· ${selectedInterest}`} ({filteredActivities.length})
              </h2>
              <button
                onClick={() => setShowList(false)}
                className="text-sm text-text-muted hover:text-primary"
              >
                收起
              </button>
            </div>
            <div className="space-y-4">
              {filteredActivities.length === 0 ? (
                <p className="text-center text-text-muted py-8">暂无符合条件的活动</p>
              ) : (
                filteredActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))
              )}
            </div>
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
