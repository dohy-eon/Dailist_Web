import React, { useState } from 'react';
import { Habit } from '@/types/habit';
import { Button } from '@/components/common/Button';
import { useHabitStore } from '@/store/habitStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { HabitDetailStats } from '@/components/stats/HabitDetailStats';

interface HabitCardProps {
  habit: Habit;
  date: string;
}

const calculateHabitStreak = (habitId: string, completions: any[], date: string): number => {
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
  const [showStats, setShowStats] = useState(false);
  
  const isCompleted = completions.some(
    (c) => c.habitId === habit.id && c.date === date && c.completed
  );

  const currentStreak = calculateHabitStreak(habit.id, completions, date);

  const handleToggle = () => {
    toggleCompletion(habit.id, date);
  };

  return (
    <>
      <div
        className="p-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
        style={{ borderLeftColor: habit.color, borderLeftWidth: '4px' }}
        onClick={() => setShowStats(true)}
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
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
          >
            {isCompleted ? '완료됨' : '완료하기'}
          </Button>
        </div>
      </div>

      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">습관 상세 통계</h2>
              <Button
                variant="outline"
                size="small"
                onClick={() => setShowStats(false)}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              <HabitDetailStats habit={habit} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 