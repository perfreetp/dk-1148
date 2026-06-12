import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Post, CreatePostDTO, Comment, User } from '../types';
import { mockPosts } from '../data/mockData';

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  filter: {
    type?: '作品展示' | '心得分享' | '物品交换';
    userId?: string;
  };
  fetchPosts: () => Promise<void>;
  getPostById: (id: string) => Promise<Post | null>;
  createPost: (data: CreatePostDTO, author: User) => Promise<void>;
  likePost: (postId: string, userId: string) => Promise<void>;
  bookmarkPost: (postId: string) => Promise<void>;
  addComment: (postId: string, comment: Comment) => Promise<void>;
  setFilter: (filter: Partial<PostState['filter']>) => void;
}

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      posts: [],
      currentPost: null,
      isLoading: false,
      filter: {},

      fetchPosts: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { posts } = get();
        if (posts.length === 0) {
          set({ posts: mockPosts, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },

      getPostById: async (id: string) => {
        const { posts } = get();
        let post = posts.find(p => p.id === id);
        
        if (!post && mockPosts.length > 0) {
          post = mockPosts.find(p => p.id === id);
        }
        
        if (post) {
          set({ currentPost: post });
          return post;
        }
        
        return null;
      },

      createPost: async (data: CreatePostDTO, author: User) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));

        const newPost: Post = {
          id: Date.now().toString(),
          ...data,
          author,
          likes: 0,
          comments: [],
          isLiked: false,
          isBookmarked: false,
          createdAt: new Date().toISOString().split('T')[0]
        };

        set(state => ({
          posts: [newPost, ...state.posts],
          currentPost: newPost,
          isLoading: false
        }));
      },

      likePost: async (postId: string, userId: string) => {
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: !post.isLiked,
                  likes: post.isLiked ? post.likes - 1 : post.likes + 1
                }
              : post
          ),
          currentPost: state.currentPost?.id === postId
            ? {
                ...state.currentPost,
                isLiked: !state.currentPost.isLiked,
                likes: state.currentPost.isLiked ? state.currentPost.likes - 1 : state.currentPost.likes + 1
              }
            : state.currentPost
        }));
      },

      bookmarkPost: async (postId: string) => {
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId
              ? { ...post, isBookmarked: !post.isBookmarked }
              : post
          ),
          currentPost: state.currentPost?.id === postId
            ? { ...state.currentPost, isBookmarked: !state.currentPost.isBookmarked }
            : state.currentPost
        }));
      },

      addComment: async (postId: string, comment: Comment) => {
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId
              ? { ...post, comments: [...post.comments, comment] }
              : post
          ),
          currentPost: state.currentPost?.id === postId
            ? { ...state.currentPost, comments: [...state.currentPost.comments, comment] }
            : state.currentPost
        }));
      },

      setFilter: (filter) => {
        set(state => ({
          filter: { ...state.filter, ...filter }
        }));
      }
    }),
    {
      name: 'tongqu-posts',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        posts: state.posts,
        currentPost: state.currentPost
      })
    }
  )
);
