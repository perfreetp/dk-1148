import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit2, MapPin, Package, MessageCircle, Star } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Tag } from '../components/common/Tag';
import { Modal } from '../components/common/Modal';
import { interestCategories } from '../data/mockData';
import { Interest, InterestLevel, CommunicationMode } from '../types';

const InterestManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, addInterest, removeInterest } = useAuthStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [level, setLevel] = useState<InterestLevel>('新手');
  const [location, setLocation] = useState('');
  const [resources, setResources] = useState('');
  const [communicationMode, setCommunicationMode] = useState<CommunicationMode>('线下');

  if (!user) {
    navigate('/login');
    return null;
  }

  const levels: { value: InterestLevel; label: string; description: string }[] = [
    { value: '新手', label: '🌱 新手', description: '刚开始接触，愿意学习' },
    { value: '进阶', label: '🌿 进阶', description: '有一定基础，寻求交流' },
    { value: '达人', label: '🌳 达人', description: '经验丰富，愿意分享' }
  ];

  const communicationModes: { value: CommunicationMode; label: string; icon: string }[] = [
    { value: '线下', label: '线下', icon: '🤝' },
    { value: '线上', label: '线上', icon: '💻' },
    { value: '混合', label: '混合', icon: '🔄' }
  ];

  const handleAddInterest = () => {
    if (!selectedCategory || !location.trim()) {
      return;
    }

    const newInterest: Interest = {
      id: Date.now().toString(),
      category: selectedCategory,
      level,
      location: location.trim(),
      resources: resources.split(',').map(r => r.trim()).filter(Boolean),
      communicationMode
    };

    addInterest(newInterest);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedCategory('');
    setLevel('新手');
    setLocation('');
    setResources('');
    setCommunicationMode('线下');
  };

  const getLevelColor = (lvl: InterestLevel) => {
    switch (lvl) {
      case '新手': return 'success';
      case '进阶': return 'warning';
      case '达人': return 'primary';
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="touch-target rounded-full hover:bg-bg-secondary transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-text-primary" />
              </button>
              <h1 className="text-xl font-display font-bold text-text-primary">
                管理兴趣
              </h1>
            </div>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              新增
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-text-secondary mb-4">
            添加你的兴趣爱好，让同好更容易找到你。你可以添加多个兴趣标签。
          </p>
        </div>

        {user.interests.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="font-display font-bold text-text-primary mb-2">
              还没有添加兴趣
            </h3>
            <p className="text-text-muted mb-4">
              点击右上角的按钮添加你的第一个兴趣标签
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              添加兴趣
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {user.interests.map((interest) => (
              <Card key={interest.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display font-bold text-text-primary text-lg">
                        {interest.category}
                      </h3>
                      <Tag variant={getLevelColor(interest.level)} size="sm">
                        {interest.level}
                      </Tag>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-accent" />
                        {interest.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-accent" />
                        {interest.communicationMode}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeInterest(interest.id)}
                    className="touch-target rounded-full text-error hover:bg-error/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {interest.resources.length > 0 && (
                  <div className="pt-3 border-t border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium text-text-primary">可分享资源</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {interest.resources.map((resource, idx) => (
                        <Tag key={idx} variant="default" size="sm">
                          {resource}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="添加新兴趣"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              选择兴趣类型
            </label>
            <div className="grid grid-cols-2 gap-2">
              {interestCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    selectedCategory === cat.value
                      ? 'border-primary bg-primary/5'
                      : 'border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <p className={`font-medium ${
                    selectedCategory === cat.value ? 'text-primary' : 'text-text-primary'
                  }`}>
                    {cat.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              经验阶段
            </label>
            <div className="grid grid-cols-3 gap-2">
              {levels.map((lvl) => (
                <button
                  key={lvl.value}
                  onClick={() => setLevel(lvl.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    level === lvl.value
                      ? 'border-primary bg-primary/5'
                      : 'border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <p className={`font-medium ${
                    level === lvl.value ? 'text-primary' : 'text-text-primary'
                  }`}>
                    {lvl.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="常用地点"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="例如：世纪公园，家中书房"
            icon={<MapPin className="w-5 h-5" />}
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              可分享资源（用逗号分隔）
            </label>
            <textarea
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              placeholder="例如：望远镜、参考书籍、工具设备"
              className="w-full px-4 py-3 rounded-xl bg-white border border-primary/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[80px] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              希望交流方式
            </label>
            <div className="grid grid-cols-3 gap-2">
              {communicationModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setCommunicationMode(mode.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    communicationMode === mode.value
                      ? 'border-primary bg-primary/5'
                      : 'border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <p className="text-2xl mb-1">{mode.icon}</p>
                  <p className={`font-medium ${
                    communicationMode === mode.value ? 'text-primary' : 'text-text-primary'
                  }`}>
                    {mode.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              取消
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddInterest}
              disabled={!selectedCategory || !location.trim()}
            >
              保存
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InterestManagePage;
