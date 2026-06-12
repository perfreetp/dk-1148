import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Activity, CreateActivityDTO, User } from '../types';
import { mockActivities } from '../data/mockData';

interface ActivityState {
  activities: Activity[];
  currentActivity: Activity | null;
  isLoading: boolean;
  filter: {
    type?: '一对一' | '小组';
    status?: string;
    search?: string;
  };
  fetchActivities: () => Promise<void>;
  getActivityById: (id: string) => Promise<Activity | null>;
  createActivity: (data: CreateActivityDTO, creator: User) => Promise<void>;
  joinActivity: (activityId: string, user: User) => Promise<void>;
  leaveActivity: (activityId: string, userId: string) => Promise<void>;
  setFilter: (filter: Partial<ActivityState['filter']>) => void;
  getMyActivities: (userId: string) => Activity[];
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [],
      currentActivity: null,
      isLoading: false,
      filter: {},

      fetchActivities: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { activities } = get();
        if (activities.length === 0) {
          set({ activities: mockActivities, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },

      getActivityById: async (id: string) => {
        const { activities } = get();
        let activity = activities.find(a => a.id === id);
        
        if (!activity && mockActivities.length > 0) {
          activity = mockActivities.find(a => a.id === id);
        }
        
        if (activity) {
          set({ currentActivity: activity });
          return activity;
        }
        
        const { activities: currentActivities } = get();
        activity = currentActivities.find(a => a.id === id);
        
        if (activity) {
          set({ currentActivity: activity });
          return activity;
        }
        
        return null;
      },

      createActivity: async (data: CreateActivityDTO, creator: User) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));

        const newActivity: Activity = {
          id: Date.now().toString(),
          ...data,
          creator,
          currentMembers: [creator],
          status: '报名中',
          createdAt: new Date().toISOString().split('T')[0]
        };

        set(state => ({
          activities: [newActivity, ...state.activities],
          currentActivity: newActivity,
          isLoading: false
        }));
      },

      joinActivity: async (activityId: string, user: User) => {
        set(state => ({
          activities: state.activities.map(activity =>
            activity.id === activityId &&
            activity.currentMembers.length < activity.maxMembers &&
            !activity.currentMembers.find(m => m.id === user.id)
              ? { ...activity, currentMembers: [...activity.currentMembers, user] }
              : activity
          ),
          currentActivity: state.currentActivity?.id === activityId
            ? {
                ...state.currentActivity,
                currentMembers: state.currentActivity.currentMembers.length < state.currentActivity.maxMembers &&
                               !state.currentActivity.currentMembers.find(m => m.id === user.id)
                  ? [...state.currentActivity.currentMembers, user]
                  : state.currentActivity.currentMembers
              }
            : state.currentActivity
        }));
      },

      leaveActivity: async (activityId: string, userId: string) => {
        set(state => ({
          activities: state.activities.map(activity =>
            activity.id === activityId
              ? { ...activity, currentMembers: activity.currentMembers.filter(m => m.id !== userId) }
              : activity
          ),
          currentActivity: state.currentActivity?.id === activityId
            ? {
                ...state.currentActivity,
                currentMembers: state.currentActivity.currentMembers.filter(m => m.id !== userId)
              }
            : state.currentActivity
        }));
      },

      setFilter: (filter) => {
        set(state => ({
          filter: { ...state.filter, ...filter }
        }));
      },

      getMyActivities: (userId: string) => {
        return get().activities.filter(
          a => a.creator.id === userId || a.currentMembers.some(m => m.id === userId)
        );
      }
    }),
    {
      name: 'tongqu-activities',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activities: state.activities,
        currentActivity: state.currentActivity
      })
    }
  )
);
