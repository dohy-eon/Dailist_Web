import React from 'react';
import { useHabitStore } from '@/store/habitStore';
import { Habit } from '@/types/habit';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { ko } from 'date-fns/locale';

interface HabitDetailStatsProps {
  habit: Habit;
}

export const HabitDetailStats: React.FC<HabitDetailStatsProps> = ({ habit }) => {
  const { completions } = useHabitStore();

  // 최근 30일 데이터 준비
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date(),
  });

  const chartData = last30Days.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isCompleted = completions.some(
      c => c.habitId === habit.id && c.date === dateStr && c.completed
    );

    return {
      date: format(date, 'MM/dd'),
      completed: isCompleted ? 1 : 0,
    };
  });

  // 성공률 계산
  const totalDays = chartData.length;
  const completedDays = chartData.filter(d => d.completed === 1).length;
  const successRate = Math.round((completedDays / totalDays) * 100);

  // 현재 Streak 계산
  let currentStreak = 0;
  for (let i = chartData.length - 1; i >= 0; i--) {
    if (chartData[i].completed === 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <span className="text-3xl">{habit.icon}</span>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{habit.name}</h2>
          <p className="text-sm text-gray-500">최근 30일 통계</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">성공률</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{successRate}%</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">현재 연속</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {currentStreak}일 🔥
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="completed"
              stroke={habit.color}
              strokeWidth={2}
              dot={{ fill: habit.color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 