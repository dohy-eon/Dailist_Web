import React from 'react';
import { HabitCard } from '@/components/habits/HabitCard';
import { HabitCalendar } from '@/components/calendar/HabitCalendar';
import { useHabitStore } from '@/store/habitStore';
import { format } from 'date-fns';

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
      const dayMap = {
        0: '일요일',
        1: '월요일',
        2: '화요일',
        3: '수요일',
        4: '목요일',
        5: '금요일',
        6: '토요일',
      };
      return habit.customDays?.includes(dayMap[today as keyof typeof dayMap]);
    }
    return false;
  });

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">데일리스트</h1>
      </div>

      <div className="space-y-4">
        <section>
          <h2 className="text-xl font-semibold mb-2">오늘의 습관</h2>
          <div className="space-y-2">
            {todayHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} date={today} />
            ))}
            {todayHabits.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                오늘은 예정된 습관이 없습니다.
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">캘린더</h2>
          <div className="bg-white rounded-lg shadow p-2">
            <HabitCalendar />
          </div>
        </section>
      </div>
    </div>
  );
}; 