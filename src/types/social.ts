export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted';
  createdAt: string;
}

export interface HabitShare {
  id: string;
  habitId: string;
  userId: string;
  sharedWith: string[];
  createdAt: string;
}

export interface Encouragement {
  id: string;
  senderId: string;
  receiverId: string;
  habitId: string;
  message: string;
  createdAt: string;
}

export interface SocialStats {
  userId: string;
  habitId: string;
  currentStreak: number;
  totalCompletions: number;
  lastCompleted: string;
} 