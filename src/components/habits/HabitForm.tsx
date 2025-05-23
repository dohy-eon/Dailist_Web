import React, { useState } from 'react';
import { Habit, HabitFrequency, WeekDay } from '@/types/habit';
import { Button } from '@/components/common/Button';
import { useHabitStore } from '@/store/habitStore';

interface HabitFormProps {
  habit?: Habit;
  onSubmit: () => void;
}

const WEEKDAYS: WeekDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const WEEKDAY_LABELS: Record<WeekDay, string> = {
  monday: '월',
  tuesday: '화',
  wednesday: '수',
  thursday: '목',
  friday: '금',
  saturday: '토',
  sunday: '일',
};

export const HabitForm: React.FC<HabitFormProps> = ({ habit, onSubmit }) => {
  const { addHabit, updateHabit } = useHabitStore();
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    icon: habit?.icon || '🎯',
    color: habit?.color || '#3B82F6',
    frequency: habit?.frequency || 'daily',
    customDays: habit?.customDays || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habit) {
      updateHabit(habit.id, formData);
    } else {
      addHabit(formData);
    }
    onSubmit();
  };

  const handleFrequencyChange = (frequency: HabitFrequency) => {
    setFormData((prev) => ({
      ...prev,
      frequency,
      customDays: frequency === 'daily' ? [] : prev.customDays,
    }));
  };

  const handleDayToggle = (day: WeekDay) => {
    setFormData((prev) => ({
      ...prev,
      customDays: prev.customDays.includes(day)
        ? prev.customDays.filter((d) => d !== day)
        : [...prev.customDays, day],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-gray-300'>습관 이름</label>
        <input
          type='text'
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className='mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-300'>아이콘</label>
        <input
          type='text'
          value={formData.icon}
          onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
          className='mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-300'>색상</label>
        <input
          type='color'
          value={formData.color}
          onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
          className='mt-1 block w-full h-10 rounded-md border-gray-700 bg-gray-800'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-300'>반복 주기</label>
        <select
          value={formData.frequency}
          onChange={(e) => handleFrequencyChange(e.target.value as HabitFrequency)}
          className='mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
        >
          <option value='daily'>매일</option>
          <option value='weekly'>매주</option>
          <option value='custom'>사용자 지정</option>
        </select>
      </div>

      {formData.frequency === 'custom' && (
        <div>
          <label className='block text-sm font-medium text-gray-300'>요일 선택</label>
          <div className='mt-2 flex flex-wrap gap-2'>
            {WEEKDAYS.map((day) => (
              <button
                key={day}
                type='button'
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-1 rounded-full text-sm ${
                  formData.customDays.includes(day)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {WEEKDAY_LABELS[day]}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button type='submit' fullWidth>
        {habit ? '습관 수정하기' : '습관 만들기'}
      </Button>
    </form>
  );
};
