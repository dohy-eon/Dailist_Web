import React from 'react';
import { useHabitStore } from '@/store/habitStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const HabitStats: React.FC = () => {
  const { stats, habits, completions } = useHabitStore();

  const weeklyData = habits.map((habit) => {
    const weeklyCompletions = completions.filter(
      (c) =>
        c.habitId === habit.id &&
        c.completed &&
        new Date(c.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return {
      name: habit.name,
      completions: weeklyCompletions,
    };
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="bg-white p-2 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">전체 습관</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {stats.totalHabits}
          </p>
        </div>
        <div className="bg-white p-2 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">오늘 완료</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {stats.completedToday}
          </p>
        </div>
        <div className="bg-white p-2 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">현재 연속</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {stats.streak}일
          </p>
        </div>
        <div className="bg-white p-2 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">주간 진행률</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {Math.round(stats.weeklyProgress)}%
          </p>
        </div>
      </div>

      <div className="bg-white p-2 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          습관별 주간 완료율
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completions" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 