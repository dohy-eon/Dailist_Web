import React from 'react';
import { HabitCard } from '@/components/habits/HabitCard';
import { HabitCalendar } from '@/components/calendar/HabitCalendar';
import { useHabitStore } from '@/store/habitStore';
import { format } from 'date-fns';
import { WeekDay } from '@/types/habit';
import { Header } from '@/components/common/Header';

export const HomePage: React.FC = () => {
  const { habits } = useHabitStore();
  const today = format(new Date(), 'yyyy-MM-dd');

  const todayHabits = habits.filter((habit) => {
    if (habit.frequency === 'daily') return true;
    if (habit.frequency === 'weekly') {
      const today = new Date().getDay();
      return today === 0; // 일요일
    }
    if (habit.frequency === 'custom') {
      const today = new Date().getDay();
      const dayMap: Record<number, WeekDay> = {
        0: 'sunday',
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday',
      };
      return habit.customDays?.includes(dayMap[today]);
    }
    return false;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <Header />

      <div className="grid grid-cols-1 min-[491px]:grid-cols-2 gap-8">
        <section className="w-full">
          <div className="w-full max-w-[491px] mx-auto space-y-4">
            <h2 className="text-xl font-semibold text-gray-100 text-center">오늘의 습관</h2>
            <div className="space-y-2">
              {todayHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} date={today} />
              ))}
              {todayHabits.length === 0 && (
                <p className="text-gray-400 text-center py-4 bg-gray-800 rounded-lg">
                  오늘은 예정된 습관이 없습니다.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="w-full max-w-[491px] mx-auto">
            <h2 className="text-xl font-semibold text-gray-100 text-center mb-4">캘린더</h2>
            <HabitCalendar />
          </div>
        </section>
      </div>
    </div>
  );
}; 