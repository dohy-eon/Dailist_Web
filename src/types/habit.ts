export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  customDays?: WeekDay[];
  createdAt: string;
  updatedAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  streak: number;
  weeklyProgress: number;
  monthlyProgress: number;
} 