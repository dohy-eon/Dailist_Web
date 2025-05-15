import React from 'react';
import { Habit } from '@/types/habit';
import { Button } from '@/components/common/Button';
import { useHabitStore } from '@/store/habitStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface HabitCardProps {
  habit: Habit;
  date: string;
}

const calculateHabitStreak = (habitId: string, completions: any[]): number => {
  const sortedCompletions = completions
    .filter(c => c.habitId === habitId && c.completed)
    .map(c => c.date)
    .sort()
    .reverse();

  if (sortedCompletions.length === 0) return 0;

  let streak = 1;
  let currentDate = new Date(sortedCompletions[0]);
  currentDate.setDate(currentDate.getDate() - 1);

  for (let i = 1; i < sortedCompletions.length; i++) {
    const prevDate = new Date(sortedCompletions[i]);
    const diffDays = Math.floor(
      (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
};

export const HabitCard: React.FC<HabitCardProps> = ({ habit, date }) => {
  const { toggleCompletion, completions } = useHabitStore();
  
  const isCompleted = completions.some(
    (c) => c.habitId === habit.id && c.date === date && c.completed
  );

  const currentStreak = calculateHabitStreak(habit.id, completions);

  const handleToggle = () => {
    toggleCompletion(habit.id, date);
  };

  return (
    <div
      className="p-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      style={{ borderLeftColor: habit.color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{habit.icon}</span>
          <div>
            <h3 className="font-medium text-gray-900">{habit.name}</h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500">
                {format(new Date(date), 'PPP', { locale: ko })}
              </p>
              {currentStreak > 0 && (
                <span className="text-sm font-medium text-emerald-600">
                  🔥 {currentStreak}일 연속
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          variant={isCompleted ? 'primary' : 'outline'}
          size="small"
          onClick={handleToggle}
        >
          {isCompleted ? '완료됨' : '완료하기'}
        </Button>
      </div>
    </div>
  );
}; 