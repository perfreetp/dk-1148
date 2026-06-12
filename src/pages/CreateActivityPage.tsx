import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, X, Check } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuthStore } from '../stores/authStore';
import { useActivityStore } from '../stores/activityStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { interestCategories } from '../data/mockData';
import { ActivityType } from '../types';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const CreateActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createActivity } = useActivityStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('小组');
  const [maxMembers, setMaxMembers] = useState(4);
  const [locationName, setLocationName] = useState('');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showLocationPreview, setShowLocationPreview] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const locationDatabase = useMemo(() => ({
    '世纪公园': [31.2194, 121.5508] as [number, number],
    '静安公园': [31.2285, 121.4545] as [number, number],
    '徐家汇公园': [31.2015, 121.4385] as [number, number],
    '上海植物园': [31.1500, 121.4333] as [number, number],
    '鲁迅公园': [31.2667, 121.4833] as [number, number],
    '人民公园': [31.2353, 121.4753] as [number, number],
    '中山公园': [31.2253, 121.4233] as [number, number],
    '延中公园': [31.2285, 121.4512] as [number, number],
    '淮海公园': [31.2208, 121.4695] as [number, number],
    '太平公园': [31.2088, 121.4512] as [number, number],
    '古城公园': [31.2350, 121.4850] as [number, number],
    '长风公园': [31.2283, 121.3950] as [number, number],
    '闸北公园': [31.2583, 121.4533] as [number, number],
    '杨浦公园': [31.2683, 121.5200] as [number, number],
    '虹口公园': [31.2667, 121.4833] as [number, number],
    '衡山路': [31.2150, 121.4433] as [number, number],
    '武康路': [31.2050, 121.4383] as [number, number],
    '安福路': [31.2200, 121.4450] as [number, number],
    '思南路': [31.2183, 121.4750] as [number, number],
    '绍兴路': [31.2150, 121.4650] as [number, number],
  }), []);

  const geocodeLocation = useCallback((name: string): { lat: number; lng: number } | null => {
    const normalizedName = name.trim();
    if (locationDatabase[normalizedName]) {
      return {
        lat: locationDatabase[normalizedName][0],
        lng: locationDatabase[normalizedName][1]
      };
    }
    
    const match = Object.keys(locationDatabase).find(key => 
      key.includes(normalizedName) || normalizedName.includes(key)
    );
    
    if (match) {
      return {
        lat: locationDatabase[match][0],
        lng: locationDatabase[match][1]
      };
    }
    
    return {
      lat: 31.2304 + (Math.random() - 0.5) * 0.1,
      lng: 121.4737 + (Math.random() - 0.5) * 0.1
    };
  }, [locationDatabase]);

  useEffect(() => {
    if (locationName.length >= 2) {
      const timer = setTimeout(() => {
        setIsLocating(true);
        setTimeout(() => {
          const coords = geocodeLocation(locationName);
          setLocationCoords(coords);
          setIsLocating(false);
          setShowLocationPreview(true);
        }, 500);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setLocationCoords(null);
      setShowLocationPreview(false);
    }
  }, [locationName, geocodeLocation]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = '请输入活动标题';
    }
    if (!description.trim()) {
      newErrors.description = '请输入活动描述';
    }
    if (!locationName.trim()) {
      newErrors.locationName = '请输入活动地点';
    }
    if (!startDate) {
      newErrors.startDate = '请选择活动日期';
    }
    if (!startTime) {
      newErrors.startTime = '请选择活动时间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const startDateTime = `${startDate} ${startTime}`;
      const endTime = startTime.split(':').map(Number);
      const endHour = (endTime[0] + 2) % 24;
      const endDateTime = `${startDate} ${endHour.toString().padStart(2, '0')}:${endTime[1].toString().padStart(2, '0')}`;

      await createActivity(
        {
          title,
          description,
          type: activityType,
          startTime: startDateTime,
          endTime: endDateTime,
          location: {
            name: locationName,
            lat: locationCoords?.lat || 31.2304,
            lng: locationCoords?.lng || 121.4737
          },
          maxMembers,
          tags: selectedTags
        },
        user
      );

      navigate('/activities');
    } catch (error) {
      console.error('创建活动失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="touch-target rounded-full hover:bg-bg-secondary transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-text-primary" />
            </button>
            <h1 className="text-xl font-display font-bold text-text-primary">
              发起活动
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display font-bold text-text-primary mb-4">
              活动类型
            </h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setActivityType('一对一')}
                className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all ${
                  activityType === '一对一'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-primary/20 text-text-secondary hover:border-primary/40'
                }`}
              >
                <div className="text-2xl mb-1">👥</div>
                <p className="font-medium">一对一</p>
                <p className="text-xs mt-1">约练指导</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivityType('小组');
                  setMaxMembers(5);
                }}
                className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all ${
                  activityType === '小组'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-primary/20 text-text-secondary hover:border-primary/40'
                }`}
              >
                <div className="text-2xl mb-1">🎯</div>
                <p className="font-medium">小组活动</p>
                <p className="text-xs mt-1">3-5人小局</p>
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display font-bold text-text-primary mb-4">
              活动信息
            </h2>
            <div className="space-y-4">
              <Input
                label="活动标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：周末城市观鸟"
                error={errors.title}
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  活动描述
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="详细描述活动内容、要求等..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-primary/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 min-h-[120px]"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-error">{errors.description}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display font-bold text-text-primary mb-4">
              时间地点
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="活动日期"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  icon={<Calendar className="w-5 h-5" />}
                  error={errors.startDate}
                />
                <Input
                  label="活动时间"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  icon={<Clock className="w-5 h-5" />}
                  error={errors.startTime}
                />
              </div>

              <Input
                label="活动地点"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="例如：世纪公园"
                icon={<MapPin className="w-5 h-5" />}
                error={errors.locationName}
              />

              {isLocating && (
                <div className="text-sm text-text-muted flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  正在定位...
                </div>
              )}

              {showLocationPreview && locationCoords && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">位置预览</span>
                    <button
                      type="button"
                      onClick={() => setShowLocationPreview(false)}
                      className="text-text-muted hover:text-text-primary"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="relative h-40 rounded-xl overflow-hidden border border-primary/20">
                    <MapContainer
                      center={[locationCoords.lat, locationCoords.lng]}
                      zoom={15}
                      className="h-full w-full"
                      zoomControl={false}
                      dragging={false}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution=''
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[locationCoords.lat, locationCoords.lng]}>
                        <Popup>
                          <div className="text-center">
                            <p className="font-medium">{locationName}</p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-text-primary flex items-center gap-1 shadow-sm">
                      <MapPin className="w-3 h-3 text-accent" />
                      <span>{locationName}</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
                    <Check className="w-3 h-3 text-success" />
                    位置已标记，发布后将在地图上显示
                  </p>
                </div>
              )}

              {!showLocationPreview && locationName.length > 0 && !isLocating && locationName.length < 2 && (
                <p className="text-xs text-text-muted mt-1">
                  输入至少2个字符查看位置预览
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display font-bold text-text-primary mb-4">
              参与人数
            </h2>
            <div className="flex items-center gap-4">
              <Users className="w-5 h-5 text-accent" />
              <input
                type="range"
                min={activityType === '一对一' ? 2 : 3}
                max={activityType === '一对一' ? 2 : 10}
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="flex-1 h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg font-bold text-primary w-16 text-center">
                {maxMembers} 人
              </span>
            </div>
            <p className="text-sm text-text-muted mt-2">
              {activityType === '一对一'
                ? '1对1约练，共2人参加'
                : `小组活动，最多${maxMembers}人参加`}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-display font-bold text-text-primary mb-4">
              兴趣标签
            </h2>
            <div className="flex flex-wrap gap-2">
              {interestCategories.map((interest) => (
                <button
                  key={interest.value}
                  type="button"
                  onClick={() => toggleTag(interest.value)}
                  className={`px-4 py-2 rounded-full border-2 transition-all ${
                    selectedTags.includes(interest.value)
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-primary/20 text-text-secondary hover:border-primary/40'
                  }`}
                >
                  {interest.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-text-muted mt-2">
              选择1-3个相关标签，帮助同好更容易发现你的活动
            </p>
          </Card>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-primary/10 p-4 z-50">
        <div className="container mx-auto max-w-md flex gap-3">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => navigate(-1)}
          >
            取消
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            发布活动
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateActivityPage;
