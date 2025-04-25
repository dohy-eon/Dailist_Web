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
    if (completionsForDate.length === 0) return 'bg-gray-100';
    if (selectedHabit) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          {format(selectedDate, 'yyyy년 MMMM', { locale: ko })}
        </h2>
        <div className="flex space-x-1">
          <button
            onClick={() =>
              setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))
            }
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            ←
          </button>
          <button
            onClick={() =>
              setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))
            }
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-1"
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
              }`}
              onClick={() => {
                const completionsForDate = getCompletionsForDate(day);
                if (completionsForDate.length > 0) {
                  // Show completions for this date
                  console.log('Completions for', format(day, 'yyyy-MM-dd'));
                }
              }}
            >
              <span className="text-sm">{format(day, 'd')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2">
        <select
          value={selectedHabit?.id || ''}
          onChange={(e) => {
            const habit = habits.find((h) => h.id === e.target.value);
            setSelectedHabit(habit || null);
          }}
          className="w-full rounded-lg border-gray-300"
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
  );
}; 