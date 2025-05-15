import React, { useState } from 'react';
import { FriendsList } from '@/components/social/FriendsList';
import { ShareHabitModal } from '@/components/social/ShareHabitModal';
import { useSocialStore } from '@/store/socialStore';
import { Habit } from '@/types/habit';

export const SocialPage: React.FC = () => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">소셜</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽 사이드바: 친구 목록 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <FriendsList />
          </div>
        </div>

        {/* 메인 컨텐츠: 선택된 친구의 습관 현황 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">
              왼쪽에서 친구를 선택하여 습관 현황을 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* 습관 공유 모달 */}
      {selectedHabit && (
        <ShareHabitModal
          habit={selectedHabit}
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedHabit(null);
          }}
        />
      )}
    </div>
  );
}; 