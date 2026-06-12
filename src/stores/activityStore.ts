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
  createActivity: (data: CreateActivityDTO, creator: User) => Promise<Activity>;
  joinActivity: (activityId: string, user: User) => Promise<void>;
  leaveActivity: (activityId: string, userId: string) => Promise<void>;
  setFilter: (filter: Partial<ActivityState['filter']>) => void;
  getMyActivities: (userId: string) => Activity[];
  clearCurrentActivity: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [],
      currentActivity: null,
      isLoading: false,
      filter: {},

      fetchActivities: async () => {
        if (get().isLoading) return;
        
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { activities } = get();
        if (activities.length === 0) {
          set({ activities: [...mockActivities], isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },

      getActivityById: async (id: string) => {
        const { activities } = get();
        
        let activity = activities.find(a => a.id === id);
        
        if (activity) {
          set({ currentActivity: activity });
          return activity;
        }
        
        activity = mockActivities.find(a => a.id === id);
        
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

        set(state => {
          const updatedActivities = [newActivity, ...state.activities];
          return {
            activities: updatedActivities,
            currentActivity: newActivity,
            isLoading: false
          };
        });

        return newActivity;
      },

      joinActivity: async (activityId: string, user: User) => {
        set(state => {
          const updatedActivities = state.activities.map(activity => {
            if (activity.id === activityId &&
                activity.currentMembers.length < activity.maxMembers &&
                !activity.currentMembers.find(m => m.id === user.id)) {
              return {
                ...activity,
                currentMembers: [...activity.currentMembers, user]
              };
            }
            return activity;
          });

          const updatedCurrentActivity = state.currentActivity?.id === activityId
            ? updatedActivities.find(a => a.id === activityId) || state.currentActivity
            : state.currentActivity;

          return {
            activities: updatedActivities,
            currentActivity: updatedCurrentActivity
          };
        });
      },

      leaveActivity: async (activityId: string, userId: string) => {
        set(state => {
          const updatedActivities = state.activities.map(activity => {
            if (activity.id === activityId) {
              return {
                ...activity,
                currentMembers: activity.currentMembers.filter(m => m.id !== userId)
              };
            }
            return activity;
          });

          const updatedCurrentActivity = state.currentActivity?.id === activityId
            ? updatedActivities.find(a => a.id === activityId) || state.currentActivity
            : state.currentActivity;

          return {
            activities: updatedActivities,
            currentActivity: updatedCurrentActivity
          };
        });
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
      },

      clearCurrentActivity: () => {
        set({ currentActivity: null });
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
