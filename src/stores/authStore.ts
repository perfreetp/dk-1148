import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Interest } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addInterest: (interest: Interest) => void;
  removeInterest: (id: string) => void;
  updateInterest: (id: string, data: Partial<Interest>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(u => u.email === email) || mockUsers[0];
        
        set({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        });
      },

      updateProfile: (data: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...data }
          });
        }
      },

      addInterest: (interest: Interest) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              interests: [...user.interests, interest]
            }
          });
        }
      },

      removeInterest: (id: string) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              interests: user.interests.filter(i => i.id !== id)
            }
          });
        }
      },

      updateInterest: (id: string, data: Partial<Interest>) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              interests: user.interests.map(i =>
                i.id === id ? { ...i, ...data } : i
              )
            }
          });
        }
      }
    }),
    {
      name: 'tongqu-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
