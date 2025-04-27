import React, { useState } from 'react';
import { useHabitStore } from '@/store/habitStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Habit } from '@/types/habit';

export const HabitCalendar: React.FC = () => {
  const { habits, completions } = useHabitStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getCompletionsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return completions.filter(
      (c) =>
        c.date === dateStr &&
        c.completed &&
        (!selectedHabit || c.habitId === selectedHabit.id)
    );
  };

  const getCompletionColor = (date: Date) => {
    const completionsForDate = getCompletionsForDate(date);
    if (completionsForDate.length === 0) return 'bg-gray-800';
    if (selectedHabit) return 'bg-indigo-600';
    return 'bg-emerald-600';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900 rounded-xl shadow-lg">
      <div className="w-full max-w-md space-y-4 px-5 sm:px-10 md:px-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-100">
            {format(selectedDate, 'yyyy년 MMMM', { locale: ko })}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() =>
                setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))
              }
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors"
            >
              ←
            </button>
            <button
              onClick={() =>
                setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))
              }
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
          {daysInMonth.map((day) => (
            <div
              key={day.toISOString()}
              className={`aspect-square p-1 ${
                isSameMonth(day, selectedDate) ? '' : 'opacity-50'
              }`}
            >
              <div
                className={`w-full h-full rounded-lg ${getCompletionColor(day)} ${
                  getCompletionsForDate(day).length > 0
                    ? 'cursor-pointer hover:opacity-80'
                    : ''
                } flex items-center justify-center`}
                onClick={() => {
                  const completionsForDate = getCompletionsForDate(day);
                  if (completionsForDate.length > 0) {
                    console.log('Completions for', format(day, 'yyyy-MM-dd'));
                  }
                }}
              >
                <span className="text-sm text-gray-100">{format(day, 'd')}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <select
            value={selectedHabit?.id || ''}
            onChange={(e) => {
              const habit = habits.find((h) => h.id === e.target.value);
              setSelectedHabit(habit || null);
            }}
            className="w-full rounded-lg bg-gray-800 border-gray-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">모든 습관</option>
            {habits.map((habit) => (
              <option key={habit.id} value={habit.id}>
                {habit.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}; 