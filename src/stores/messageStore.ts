import { create } from 'zustand';
import { Conversation, Message, User } from '../types';
import { mockConversations, mockUsers } from '../data/mockData';

interface MessageState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  currentMessages: Message[];
  unreadCount: number;
  isLoading: boolean;
  fetchConversations: () => Promise<void>;
  getMessages: (userId: string) => Promise<Message[]>;
  sendMessage: (receiverId: string, content: string, currentUser: User) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  currentMessages: [],
  unreadCount: 0,
  isLoading: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const unreadCount = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    
    set({ 
      conversations: mockConversations,
      unreadCount,
      isLoading: false 
    });
  },

  getMessages: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockMessages: Message[] = [
      {
        id: 'm1',
        sender: mockUsers[0],
        receiver: mockUsers[5],
        content: '你好！看到你对观鸟感兴趣，想请教一些问题',
        sentAt: '2026-06-12 10:00',
        isRead: true
      },
      {
        id: 'm2',
        sender: mockUsers[5],
        receiver: mockUsers[0],
        content: '你好！我刚入门，还不太懂观鸟的基础知识',
        sentAt: '2026-06-12 10:15',
        isRead: true
      },
      {
        id: 'm3',
        sender: mockUsers[0],
        receiver: mockUsers[5],
        content: '没关系！观鸟其实很简单，只需要一双眼睛和一颗好奇心',
        sentAt: '2026-06-12 10:20',
        isRead: true
      },
      {
        id: 'm4',
        sender: mockUsers[0],
        receiver: mockUsers[5],
        content: '周六早上7点在世纪公园门口见，带上望远镜！',
        sentAt: '2026-06-12 18:30',
        isRead: false
      }
    ];

    set({ currentMessages: mockMessages });
    return mockMessages;
  },

  sendMessage: async (receiverId: string, content: string, currentUser: User) => {
    const receiver = mockUsers.find(u => u.id === receiverId);
    if (!receiver) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: currentUser,
      receiver,
      content,
      sentAt: new Date().toISOString(),
      isRead: false
    };

    set(state => ({
      currentMessages: [...state.currentMessages, newMessage]
    }));

    await new Promise(resolve => setTimeout(resolve, 200));
  },

  markAsRead: async (conversationId: string) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
  }
}));
