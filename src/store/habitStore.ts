import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Habit, HabitCompletion, HabitStats } from '@/types/habit';

interface HabitState {
  habits: Habit[];
  completions: HabitCompletion[];
  stats: HabitStats;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, date: string) => void;
  calculateStats: () => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: [],
      stats: {
        totalHabits: 0,
        completedToday: 0,
        streak: 0,
        weeklyProgress: 0,
        monthlyProgress: 0,
      },

      addHabit: (habit) => {
        const newHabit: Habit = {
          ...habit,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
        get().calculateStats();
      },

      updateHabit: (id, habit) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...habit, updatedAt: new Date().toISOString() } : h,
          ),
        }));
        get().calculateStats();
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          completions: state.completions.filter((c) => c.habitId !== id),
        }));
        get().calculateStats();
      },

      toggleCompletion: (habitId, date) => {
        set((state) => {
          const existingCompletion = state.completions.find(
            (c) => c.habitId === habitId && c.date === date,
          );

          if (existingCompletion) {
            return {
              completions: state.completions.map((c) =>
                c.id === existingCompletion.id ? { ...c, completed: !c.completed } : c,
              ),
            };
          }

          return {
            completions: [
              ...state.completions,
              {
                id: crypto.randomUUID(),
                habitId,
                date,
                completed: true,
              },
            ],
          };
        });
        get().calculateStats();
      },

      calculateStats: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const thisWeek = getWeekDates();
        const thisMonth = getMonthDates();

        const completedToday = state.completions.filter(
          (c) => c.date === today && c.completed,
        ).length;

        const weeklyCompletions = state.completions.filter(
          (c) => thisWeek.includes(c.date) && c.completed,
        ).length;

        const monthlyCompletions = state.completions.filter(
          (c) => thisMonth.includes(c.date) && c.completed,
        ).length;

        set((state) => ({
          stats: {
            totalHabits: state.habits.length,
            completedToday,
            streak: calculateStreak(state.completions),
            weeklyProgress: state.habits.length
              ? (weeklyCompletions / (state.habits.length * 7)) * 100
              : 0,
            monthlyProgress: state.habits.length
              ? (monthlyCompletions / (state.habits.length * 30)) * 100
              : 0,
          },
        }));
      },
    }),
    {
      name: 'habit-storage',
    },
  ),
);

// Utility functions
function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date.toISOString().split('T')[0];
  });
}

function getMonthDates(): string[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return date.toISOString().split('T')[0];
  });
}

function calculateStreak(completions: HabitCompletion[]): number {
  const sortedCompletions = completions
    .filter((c) => c.completed)
    .map((c) => c.date)
    .sort()
    .reverse();

  if (sortedCompletions.length === 0) return 0;

  let streak = 1;
  let currentDate = new Date(sortedCompletions[0]);
  currentDate.setDate(currentDate.getDate() - 1);

  for (let i = 1; i < sortedCompletions.length; i++) {
    const prevDate = new Date(sortedCompletions[i]);
    const diffDays = Math.floor(
      (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
}
