export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  interests: Interest[];
  stats: UserStats;
  createdAt: string;
}

export interface UserStats {
  activitiesCount: number;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export type InterestLevel = '新手' | '进阶' | '达人';
export type CommunicationMode = '线下' | '线上' | '混合';

export interface Interest {
  id: string;
  category: string;
  level: InterestLevel;
  location: string;
  resources: string[];
  communicationMode: CommunicationMode;
}

export type ActivityType = '一对一' | '小组';
export type ActivityStatus = '报名中' | '已确认' | '进行中' | '已完成';

export interface ActivityLocation {
  name: string;
  lat: number;
  lng: number;
}

export interface Activity {
  id: string;
  creator: User;
  title: string;
  description: string;
  type: ActivityType;
  startTime: string;
  endTime: string;
  location: ActivityLocation;
  maxMembers: number;
  currentMembers: User[];
  status: ActivityStatus;
  createdAt: string;
  tags?: string[];
}

export type PostType = '作品展示' | '心得分享' | '物品交换';

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  images: string[];
  type: PostType;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface Message {
  id: string;
  sender: User;
  receiver: User;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface MapMarker {
  id: string;
  type: 'user' | 'activity';
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  icon?: string;
}

export interface CreateActivityDTO {
  title: string;
  description: string;
  type: ActivityType;
  startTime: string;
  endTime: string;
  location: ActivityLocation;
  maxMembers: number;
  tags?: string[];
}

export interface CreatePostDTO {
  content: string;
  images: string[];
  type: PostType;
}

export interface CreateInterestDTO {
  category: string;
  level: InterestLevel;
  location: string;
  resources: string[];
  communicationMode: CommunicationMode;
}

export interface FilterOptions {
  interestCategory?: string;
  activityType?: ActivityType;
  interestLevel?: InterestLevel;
  distance?: number;
  timeRange?: 'today' | 'week' | 'month';
}
