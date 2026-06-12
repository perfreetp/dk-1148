import { User, Activity, Post, Message, Conversation, MapMarker } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: '林间观鸟人',
    email: 'birdwatcher@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    bio: '每周必去一次公园观鸟，记录了超过200种鸟类。希望找到志同道合的朋友一起探索自然的奥秘。',
    location: '上海市浦东新区',
    interests: [
      {
        id: '1',
        category: '观鸟',
        level: '达人',
        location: '世纪公园',
        resources: ['单筒望远镜', '鸟类图鉴', '相机'],
        communicationMode: '线下'
      }
    ],
    stats: {
      activitiesCount: 45,
      followersCount: 128,
      followingCount: 56,
      postsCount: 89
    },
    createdAt: '2025-03-15'
  },
  {
    id: '2',
    username: '模型手工匠',
    email: 'modelmaker@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bio: '专注军事模型制作10年，擅长1:35比例战车模型。喜欢分享制作技巧，寻找同样热爱细节的玩家。',
    location: '上海市徐汇区',
    interests: [
      {
        id: '2',
        category: '拼模型',
        level: '达人',
        location: '个人工作室',
        resources: ['喷笔设备', '各种涂料', '参考书籍'],
        communicationMode: '混合'
      },
      {
        id: '3',
        category: '3D打印',
        level: '进阶',
        location: '家里',
        resources: ['3D打印机', '建模软件'],
        communicationMode: '线上'
      }
    ],
    stats: {
      activitiesCount: 32,
      followersCount: 256,
      followingCount: 89,
      postsCount: 156
    },
    createdAt: '2024-11-20'
  },
  {
    id: '3',
    username: '独立电影迷',
    email: 'indiefilm@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    bio: '小众独立电影爱好者，豆瓣Top250已刷完。喜欢王家卫、娄烨、贾樟柯的电影，也在发掘更多冷门佳作。',
    location: '上海市静安区',
    interests: [
      {
        id: '4',
        category: '独立电影',
        level: '达人',
        location: '上海影城',
        resources: ['私人电影收藏', '放映设备'],
        communicationMode: '线下'
      }
    ],
    stats: {
      activitiesCount: 28,
      followersCount: 89,
      followingCount: 112,
      postsCount: 203
    },
    createdAt: '2025-01-10'
  },
  {
    id: '4',
    username: '旧书收藏家',
    email: 'booklover@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    bio: '藏书3000余册，专注于民国时期文学和港台版书籍。愿意交换好书，寻找爱书之人。',
    location: '上海市黄浦区',
    interests: [
      {
        id: '5',
        category: '旧书交换',
        level: '达人',
        location: '福州路古籍书店',
        resources: ['珍贵藏书', '修复工具'],
        communicationMode: '线下'
      },
      {
        id: '6',
        category: '古籍研究',
        level: '进阶',
        location: '家中书房',
        resources: ['专业书籍', '修复材料'],
        communicationMode: '混合'
      }
    ],
    stats: {
      activitiesCount: 19,
      followersCount: 167,
      followingCount: 78,
      postsCount: 134
    },
    createdAt: '2024-08-05'
  },
  {
    id: '5',
    username: '城市速写师',
    email: 'urbansketcher@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    bio: '用画笔记录城市街景，外滩、老弄堂、石库门都是我的素材。希望和同好一起写生。',
    location: '上海市长宁区',
    interests: [
      {
        id: '7',
        category: '城市速写',
        level: '达人',
        location: '外滩',
        resources: ['水彩颜料', '速写本', '钢笔'],
        communicationMode: '线下'
      }
    ],
    stats: {
      activitiesCount: 56,
      followersCount: 234,
      followingCount: 145,
      postsCount: 298
    },
    createdAt: '2024-05-12'
  },
  {
    id: '6',
    username: '新手观鸟者',
    email: 'newbirder@example.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    bio: '刚开始观鸟，认得的鸟不超过10种。希望跟着前辈学习，一起去公园找鸟！',
    location: '上海市杨浦区',
    interests: [
      {
        id: '8',
        category: '观鸟',
        level: '新手',
        location: '杨浦公园',
        resources: ['双筒望远镜', '手机APP'],
        communicationMode: '线下'
      }
    ],
    stats: {
      activitiesCount: 8,
      followersCount: 23,
      followingCount: 45,
      postsCount: 12
    },
    createdAt: '2026-05-20'
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    creator: mockUsers[0],
    title: '周末城市观鸟',
    description: '招募2-3位观鸟爱好者，周末早晨一起去世纪公园观察鸟类，学习鸟类识别技巧。有望远镜的朋友请带上，我们可以分享观鸟经验。',
    type: '小组',
    startTime: '2026-06-15 08:00',
    endTime: '2026-06-15 11:00',
    location: {
      name: '世纪公园',
      lat: 31.2197,
      lng: 121.5512
    },
    maxMembers: 4,
    currentMembers: [mockUsers[0], mockUsers[5]],
    status: '报名中',
    createdAt: '2026-06-10',
    tags: ['观鸟', '户外', '自然']
  },
  {
    id: '2',
    creator: mockUsers[1],
    title: '模型喷涂技巧交流',
    description: '分享我的喷涂经验，讲解如何做出自然的旧化效果。适合有一定基础的模友，新手也欢迎观摩学习。',
    type: '小组',
    startTime: '2026-06-16 14:00',
    endTime: '2026-06-16 17:00',
    location: {
      name: '徐汇模型俱乐部',
      lat: 31.2001,
      lng: 121.4378
    },
    maxMembers: 5,
    currentMembers: [mockUsers[1]],
    status: '报名中',
    createdAt: '2026-06-11',
    tags: ['拼模型', '技术交流', '室内']
  },
  {
    id: '3',
    creator: mockUsers[2],
    title: '独立电影之夜',
    description: '本周放映《路边野餐》，毕赣导演的处女作，充满了诗意的长镜头。想找几位同样喜欢文艺片的朋友一起观看讨论。',
    type: '小组',
    startTime: '2026-06-14 19:30',
    endTime: '2026-06-14 22:00',
    location: {
      name: '静安区私人影院',
      lat: 31.2294,
      lng: 121.4476
    },
    maxMembers: 6,
    currentMembers: [mockUsers[2], mockUsers[3]],
    status: '报名中',
    createdAt: '2026-06-09',
    tags: ['独立电影', '观影', '文艺']
  },
  {
    id: '4',
    creator: mockUsers[3],
    title: '旧书交换市集',
    description: '我整理出一批想要交换的旧书，包含一些绝版小说和艺术画册。想找爱书的朋友来交换，可以自带书籍来，也可以直接来淘书。',
    type: '小组',
    startTime: '2026-06-20 10:00',
    endTime: '2026-06-20 16:00',
    location: {
      name: '黄浦区古籍书店',
      lat: 31.2356,
      lng: 121.4902
    },
    maxMembers: 10,
    currentMembers: [mockUsers[3], mockUsers[4]],
    status: '报名中',
    createdAt: '2026-06-08',
    tags: ['旧书交换', '藏书', '文化']
  },
  {
    id: '5',
    creator: mockUsers[4],
    title: '外滩建筑速写',
    description: '一起在外滩写生，画万国建筑博览群。我会分享构图和上色技巧，适合各level的速写爱好者。',
    type: '小组',
    startTime: '2026-06-18 16:00',
    endTime: '2026-06-18 19:00',
    location: {
      name: '外滩观景平台',
      lat: 31.2405,
      lng: 121.4905
    },
    maxMembers: 8,
    currentMembers: [mockUsers[4]],
    status: '报名中',
    createdAt: '2026-06-12',
    tags: ['城市速写', '户外', '艺术']
  },
  {
    id: '6',
    creator: mockUsers[5],
    title: '新手观鸟入门指导',
    description: '我是观鸟新手，想找有经验的朋友带我去公园认识鸟类。最好是周末早晨，时间灵活。',
    type: '一对一',
    startTime: '2026-06-21 07:00',
    endTime: '2026-06-21 09:00',
    location: {
      name: '杨浦公园',
      lat: 31.2658,
      lng: 121.5205
    },
    maxMembers: 2,
    currentMembers: [mockUsers[5]],
    status: '报名中',
    createdAt: '2026-06-13',
    tags: ['观鸟', '新手', '户外']
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    author: mockUsers[0],
    content: '今天在世纪公园观察到了一对黑水鸡育雏！小家伙毛茸茸的，太可爱了。观鸟真的让人心情平静，推荐大家都去试试。',
    images: ['https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600'],
    type: '作品展示',
    likes: 45,
    comments: [
      {
        id: 'c1',
        author: mockUsers[5],
        content: '太棒了！黑水鸡长什么样？我也想去看！',
        createdAt: '2026-06-12 16:30'
      }
    ],
    isLiked: false,
    isBookmarked: false,
    createdAt: '2026-06-12 15:20'
  },
  {
    id: '2',
    author: mockUsers[1],
    content: '历时3个月，我的1:35虎式坦克终于完工了！这次尝试了全新的旧化技法，做出了战场的沧桑感。大家看看效果如何？',
    images: [
      'https://images.unsplash.com/photo-159926806驪驪驪驪驪驪驪驪驪驪驪?w=600',
      'https://images.unsplash.com/photo-驪驪驪驪驪驪驪驪驪驪驪驪驪驪驪?w=600'
    ],
    type: '作品展示',
    likes: 128,
    comments: [
      {
        id: 'c2',
        author: mockUsers[3],
        content: '细节处理得太棒了！特别是履带的锈迹效果，求教程！',
        createdAt: '2026-06-11 20:15'
      }
    ],
    isLiked: true,
    isBookmarked: true,
    createdAt: '2026-06-11 19:00'
  },
  {
    id: '3',
    author: mockUsers[2],
    content: '重温了贾樟柯的《三峡好人》，依然被那种纪录片式的真实感震撼。好电影不在于画面多美，而在于能否触及人心。',
    images: [],
    type: '心得分享',
    likes: 67,
    comments: [
      {
        id: 'c3',
        author: mockUsers[4],
        content: '贾樟柯的电影有一种独特的诗意，我也非常喜欢。',
        createdAt: '2026-06-10 22:45'
      }
    ],
    isLiked: false,
    isBookmarked: false,
    createdAt: '2026-06-10 21:30'
  },
  {
    id: '4',
    author: mockUsers[3],
    content: '整理书架发现几本想出手的好书：民国时期的小说、港台版的诗集，还有几本绝版艺术画册。有兴趣的朋友可以私信我交换或购买。',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600'],
    type: '物品交换',
    likes: 34,
    comments: [
      {
        id: 'c4',
        author: mockUsers[5],
        content: '有港台版的小说吗？想要张爱玲的',
        createdAt: '2026-06-09 14:20'
      }
    ],
    isLiked: false,
    isBookmarked: false,
    createdAt: '2026-06-09 13:00'
  },
  {
    id: '5',
    author: mockUsers[4],
    content: '今天在外滩写生，用水彩记录了和平饭店南楼。阳光下建筑的暖色调特别美。画画让生活慢下来，强烈推荐大家尝试城市速写！',
    images: ['https://images.unsplash.com/photo-驪驪驪驪驪驪驪驪驪驪驪驪驪驪驪?w=600'],
    type: '作品展示',
    likes: 89,
    comments: [],
    isLiked: true,
    isBookmarked: false,
    createdAt: '2026-06-08 18:20'
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    user: mockUsers[0],
    lastMessage: {
      id: 'm1',
      sender: mockUsers[0],
      receiver: mockUsers[5],
      content: '周六早上7点在世纪公园门口见，带上望远镜！',
      sentAt: '2026-06-12 18:30',
      isRead: false
    },
    unreadCount: 2
  },
  {
    id: 'conv2',
    user: mockUsers[1],
    lastMessage: {
      id: 'm2',
      sender: mockUsers[1],
      receiver: mockUsers[5],
      content: '喷涂技巧分享会的时间定在下周一，你有空吗？',
      sentAt: '2026-06-12 15:20',
      isRead: true
    },
    unreadCount: 0
  }
];

export const mockMapMarkers: MapMarker[] = [
  {
    id: 'marker1',
    type: 'user',
    lat: 31.2197,
    lng: 121.5512,
    title: '林间观鸟人',
    subtitle: '观鸟达人 · 世纪公园附近'
  },
  {
    id: 'marker2',
    type: 'activity',
    lat: 31.2197,
    lng: 121.5512,
    title: '周末城市观鸟',
    subtitle: '6月15日 · 世纪公园'
  },
  {
    id: 'marker3',
    type: 'user',
    lat: 31.2001,
    lng: 121.4378,
    title: '模型手工匠',
    subtitle: '拼模型达人 · 徐汇区'
  },
  {
    id: 'marker4',
    type: 'activity',
    lat: 31.2001,
    lng: 121.4378,
    title: '模型喷涂技巧交流',
    subtitle: '6月16日 · 徐汇模型俱乐部'
  },
  {
    id: 'marker5',
    type: 'user',
    lat: 31.2405,
    lng: 121.4905,
    title: '城市速写师',
    subtitle: '城市速写达人 · 外滩附近'
  },
  {
    id: 'marker6',
    type: 'activity',
    lat: 31.2405,
    lng: 121.4905,
    title: '外滩建筑速写',
    subtitle: '6月18日 · 外滩'
  }
];

export const interestCategories = [
  { value: '观鸟', label: '观鸟', icon: 'bird' },
  { value: '拼模型', label: '拼模型', icon: 'truck' },
  { value: '独立电影', label: '独立电影', icon: 'film' },
  { value: '旧书交换', label: '旧书交换', icon: 'book' },
  { value: '城市速写', label: '城市速写', icon: 'pen-tool' },
  { value: '3D打印', label: '3D打印', icon: 'box' },
  { value: '古籍研究', label: '古籍研究', icon: 'scroll' },
  { value: '集邮', label: '集邮', icon: 'stamp' },
  { value: '古钱币', label: '古钱币', icon: 'coins' },
  { value: '昆虫采集', label: '昆虫采集', icon: 'bug' }
];
