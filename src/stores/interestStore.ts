import { create } from 'zustand';
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

export const useInterestStore = create<InterestState>((set, get) => ({
  recommendedUsers: [],
  isLoading: false,
  filter: {},

  fetchRecommendedUsers: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set({ 
      recommendedUsers: mockUsers.filter(u => u.id !== '6'),
      isLoading: false 
    });
  },

  setFilter: (filter) => {
    set(state => ({
      filter: { ...state.filter, ...filter }
    }));
  },

  getUsersByInterest: (category: string) => {
    return mockUsers.filter(user =>
      user.interests.some(interest => interest.category === category)
    );
  }
}));
