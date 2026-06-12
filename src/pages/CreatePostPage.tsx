import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, X, Tag } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { usePostStore } from '../stores/postStore';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { PostType } from '../types';

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createPost } = usePostStore();

  const [postType, setPostType] = useState<PostType>('作品展示');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const postTypes: { value: PostType; label: string; icon: string; description: string }[] = [
    {
      value: '作品展示',
      label: '作品展示',
      icon: '🎨',
      description: '分享你的作品或成果'
    },
    {
      value: '心得分享',
      label: '心得分享',
      icon: '💡',
      description: '记录学习心得和经验'
    },
    {
      value: '物品交换',
      label: '物品交换',
      icon: '🔄',
      description: '发布可交换的物品清单'
    }
  ];

  const handleImageUpload = () => {
    const url = prompt('请输入图片URL（演示用）:');
    if (url && url.trim()) {
      setImages(prev => [...prev, url.trim()]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('请输入内容');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await createPost(
        {
          content: content.trim(),
          images,
          type: postType
        },
        user
      );

      navigate('/wall');
    } catch (err) {
      setError('发布失败，请重试');
      console.error('发布失败:', err);
    } finally {
      setIsSubmitting(false);
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
                发布动态
              </h1>
            </div>
            <Button
              size="sm"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!content.trim()}
            >
              发布
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card className="p-6 mb-6">
          <h2 className="font-display font-bold text-text-primary mb-4">
            选择类型
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {postTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setPostType(type.value)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  postType === type.value
                    ? 'border-primary bg-primary/5'
                    : 'border-primary/20 hover:border-primary/40'
                }`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <p className={`font-medium ${
                  postType === type.value ? 'text-primary' : 'text-text-primary'
                }`}>
                  {type.label}
                </p>
                <p className="text-xs text-text-muted mt-1 hidden sm:block">
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="font-display font-bold text-text-primary mb-4">
            内容
          </h2>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError('');
            }}
            placeholder={
              postType === '作品展示'
                ? '分享你的作品，记录创作过程和心得...'
                : postType === '心得分享'
                ? '记录你的学习心得、经验总结...'
                : '列出你想要交换的物品，标注期望交换的对象...'
            }
            className="w-full px-4 py-3 rounded-xl bg-white border border-primary/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150 min-h-[200px] resize-none"
          />
          {error && (
            <p className="mt-2 text-sm text-error">{error}</p>
          )}
          <p className="text-sm text-text-muted mt-2">
            {content.length} / 500 字符
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-display font-bold text-text-primary mb-4">
            添加图片
          </h2>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {images.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                  <img
                    src={url}
                    alt={`上传图片 ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=图片加载失败';
                    }}
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {images.length < 9 && (
            <button
              onClick={handleImageUpload}
              className="w-full py-8 border-2 border-dashed border-primary/20 rounded-xl text-text-muted hover:border-primary/40 hover:text-primary transition-colors flex flex-col items-center justify-center"
            >
              <Image className="w-8 h-8 mb-2" />
              <p className="font-medium">点击添加图片</p>
              <p className="text-sm mt-1">最多9张图片</p>
            </button>
          )}
        </Card>

        {postType === '物品交换' && (
          <Card className="p-6 mt-6 bg-highlight/5 border border-highlight/20">
            <div className="flex items-start gap-3">
              <Tag className="w-6 h-6 text-highlight flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-display font-bold text-text-primary mb-2">
                  物品交换小贴士
                </h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• 清晰描述物品的来源和新旧程度</li>
                  <li>• 说明期望交换的物品类型或价格范围</li>
                  <li>• 留下联系方式，方便他人联系你</li>
                  <li>• 建议在线下公共场所进行交换</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-primary/10 p-4 z-50">
        <div className="container mx-auto max-w-md">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!content.trim()}
          >
            发布{postType}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
