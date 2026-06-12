import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Interest, FilterOptions } from '../types';
import { mockUsers } from '../data/mockData';

interface InterestState {
  recommendedUsers: User[];
  isLoading: boolean;
  filter: FilterOptions;
  fetchRecommendedUsers: () => Promise<void>;
  setFilter: (filter: Partial<FilterOptions>) => void;
  getUsersByInterest: (category: string) => User[];
}

export const useInterestStore = create<InterestState>()(
  persist(
    (set, get) => ({
      recommendedUsers: [],
      isLoading: false,
      filter: {},

      fetchRecommendedUsers: async () => {
        if (get().isLoading) return;
        
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { recommendedUsers } = get();
        if (recommendedUsers.length === 0) {
          set({ 
            recommendedUsers: mockUsers.filter(u => u.id !== '6'),
            isLoading: false 
          });
        } else {
          set({ isLoading: false });
        }
      },

      setFilter: (filter) => {
        set(state => ({
          filter: { ...state.filter, ...filter }
        }));
      },

      getUsersByInterest: (category: string) => {
        return get().recommendedUsers.filter(user =>
          user.interests.some(interest => interest.category === category)
        );
      }
    }),
    {
      name: 'tongqu-users',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        recommendedUsers: state.recommendedUsers
      })
    }
  )
);
