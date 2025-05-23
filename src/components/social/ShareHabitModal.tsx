import React, { useState } from 'react';
import { useSocialStore } from '@/store/socialStore';
import { Habit } from '@/types/habit';
import { Button } from '@/components/common/Button';

interface ShareHabitModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareHabitModal: React.FC<ShareHabitModalProps> = ({ habit, isOpen, onClose }) => {
  const { friends, shareHabit } = useSocialStore();
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const handleShare = () => {
    if (selectedFriends.length > 0) {
      shareHabit(habit.id, selectedFriends);
      onClose();
    }
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId],
    );
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg max-w-md w-full p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold'>습관 공유하기</h2>
          <Button variant='outline' size='small' onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className='mb-4'>
          <div className='flex items-center space-x-2 mb-2'>
            <span className='text-2xl'>{habit.icon}</span>
            <h3 className='font-medium'>{habit.name}</h3>
          </div>
          <p className='text-sm text-gray-500'>이 습관을 공유할 친구를 선택하세요</p>
        </div>

        <div className='space-y-2 max-h-60 overflow-y-auto mb-4'>
          {friends.map((friend) => (
            <div
              key={friend.id}
              className='flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer'
              onClick={() => toggleFriendSelection(friend.id)}
            >
              <input
                type='checkbox'
                checked={selectedFriends.includes(friend.id)}
                onChange={() => {}}
                className='rounded'
              />
              {friend.avatar ? (
                <img src={friend.avatar} alt={friend.username} className='w-8 h-8 rounded-full' />
              ) : (
                <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center'>
                  {friend.username[0].toUpperCase()}
                </div>
              )}
              <span>{friend.username}</span>
            </div>
          ))}
        </div>

        <div className='flex justify-end space-x-2'>
          <Button variant='outline' size='small' onClick={onClose}>
            취소
          </Button>
          <Button
            variant='primary'
            size='small'
            onClick={handleShare}
            disabled={selectedFriends.length === 0}
          >
            공유하기
          </Button>
        </div>
      </div>
    </div>
  );
};
