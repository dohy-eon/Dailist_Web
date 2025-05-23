import React from 'react';
import { useSocialStore } from '@/store/socialStore';
import { Button } from '@/components/common/Button';

export const FriendsList: React.FC = () => {
  const { friends, friendships } = useSocialStore();

  const pendingRequests = friendships.filter(
    (f) => f.status === 'pending' && f.friendId === 'current-user-id',
  );

  return (
    <div className='space-y-4'>
      {pendingRequests.length > 0 && (
        <div className='bg-yellow-50 p-4 rounded-lg'>
          <h3 className='font-medium text-yellow-800'>친구 요청</h3>
          {pendingRequests.map((request) => (
            <div key={request.id} className='mt-2 flex items-center justify-between'>
              <span>{request.userId}</span>
              <div className='space-x-2'>
                <Button variant='primary' size='small'>
                  수락
                </Button>
                <Button variant='outline' size='small'>
                  거절
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h3 className='font-medium text-gray-900'>친구 목록</h3>
        {friends.map((friend) => (
          <div
            key={friend.id}
            className='flex items-center justify-between p-3 bg-white rounded-lg shadow-sm'
          >
            <div className='flex items-center space-x-3'>
              {friend.avatar ? (
                <img src={friend.avatar} alt={friend.username} className='w-10 h-10 rounded-full' />
              ) : (
                <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                  {friend.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className='font-medium'>{friend.username}</p>
                {friend.bio && <p className='text-sm text-gray-500'>{friend.bio}</p>}
              </div>
            </div>
            <Button variant='outline' size='small'>
              습관 공유
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
