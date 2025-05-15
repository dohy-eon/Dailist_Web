import { create } from 'zustand';
import { User, Friendship, HabitShare, Encouragement, SocialStats } from '@/types/social';

interface SocialState {
  friends: User[];
  friendships: Friendship[];
  sharedHabits: HabitShare[];
  encouragements: Encouragement[];
  socialStats: SocialStats[];
  addFriend: (friendId: string) => void;
  acceptFriendRequest: (friendshipId: string) => void;
  shareHabit: (habitId: string, friendIds: string[]) => void;
  sendEncouragement: (receiverId: string, habitId: string, message: string) => void;
  updateSocialStats: (stats: SocialStats) => void;
}

export const useSocialStore = create<SocialState>((set) => ({
  friends: [],
  friendships: [],
  sharedHabits: [],
  encouragements: [],
  socialStats: [],

  addFriend: (friendId) => {
    set((state) => ({
      friendships: [
        ...state.friendships,
        {
          id: Date.now().toString(),
          userId: 'current-user-id', // TODO: Get from auth
          friendId,
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },

  acceptFriendRequest: (friendshipId) => {
    set((state) => ({
      friendships: state.friendships.map((f) =>
        f.id === friendshipId ? { ...f, status: 'accepted' } : f
      ),
    }));
  },

  shareHabit: (habitId, friendIds) => {
    set((state) => ({
      sharedHabits: [
        ...state.sharedHabits,
        {
          id: Date.now().toString(),
          habitId,
          userId: 'current-user-id', // TODO: Get from auth
          sharedWith: friendIds,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },

  sendEncouragement: (receiverId, habitId, message) => {
    set((state) => ({
      encouragements: [
        ...state.encouragements,
        {
          id: Date.now().toString(),
          senderId: 'current-user-id', // TODO: Get from auth
          receiverId,
          habitId,
          message,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateSocialStats: (stats) => {
    set((state) => ({
      socialStats: state.socialStats.map((s) =>
        s.userId === stats.userId && s.habitId === stats.habitId ? stats : s
      ),
    }));
  },
})); 