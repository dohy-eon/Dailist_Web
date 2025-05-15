import React, { useState } from 'react';
import { useSocialStore } from '@/store/socialStore';
import { useHabitStore } from '@/store/habitStore';
import { User } from '@/types/social';
import { Button } from '@/components/common/Button';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface FriendHabitStatusProps {
  friend: User;
}

export const FriendHabitStatus: React.FC<FriendHabitStatusProps> = ({ friend }) => {
  const { habits } = useHabitStore();
  const { socialStats, sendEncouragement } = useSocialStore();
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [encouragementMessage, setEncouragementMessage] = useState('');

  const friendStats = socialStats.filter((stat) => stat.userId === friend.id);
  const sharedHabits = habits.filter((habit) =>
    friendStats.some((stat) => stat.habitId === habit.id)
  );

  const handleSendEncouragement = () => {
    if (selectedHabit && encouragementMessage) {
      sendEncouragement(friend.id, selectedHabit, encouragementMessage);
      setEncouragementMessage('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        {friend.avatar ? (
          <img
            src={friend.avatar}
            alt={friend.username}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
            {friend.username[0].toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold">{friend.username}</h2>
          {friend.bio && <p className="text-gray-500">{friend.bio}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sharedHabits.map((habit) => {
          const stat = friendStats.find((s) => s.habitId === habit.id);
          return (
            <div
              key={habit.id}
              className="p-4 bg-white rounded-lg shadow-sm"
              style={{ borderLeftColor: habit.color, borderLeftWidth: '4px' }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{habit.icon}</span>
                <h3 className="font-medium">{habit.name}</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  현재 연속: {stat?.currentStreak || 0}일 🔥
                </p>
                <p className="text-sm text-gray-500">
                  마지막 완료: {stat?.lastCompleted ? format(new Date(stat.lastCompleted), 'PPP', { locale: ko }) : '없음'}
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="응원 메시지..."
                    className="flex-1 p-2 text-sm border rounded"
                    value={selectedHabit === habit.id ? encouragementMessage : ''}
                    onChange={(e) => {
                      setSelectedHabit(habit.id);
                      setEncouragementMessage(e.target.value);
                    }}
                  />
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleSendEncouragement}
                    disabled={!encouragementMessage}
                  >
                    응원하기
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 