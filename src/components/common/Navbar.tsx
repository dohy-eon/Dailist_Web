import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/common/Button';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthStore();

  return (
    <nav className='bg-white shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-4'>
            <Link to='/' className='text-xl font-bold text-gray-900'>
              Dailist
            </Link>
            {isAuthenticated && (
              <Link to='/social' className='text-gray-600 hover:text-gray-900'>
                소셜
              </Link>
            )}
          </div>
          <div className='flex items-center space-x-4'>
            {isAuthenticated ? (
              <>
                <div className='flex items-center space-x-2'>
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className='w-8 h-8 rounded-full' />
                  ) : (
                    <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center'>
                      {user?.username[0].toUpperCase()}
                    </div>
                  )}
                  <span className='text-sm text-gray-700'>{user?.username}</span>
                </div>
                <Button variant='outline' size='small' onClick={logout}>
                  로그아웃
                </Button>
              </>
            ) : (
              <div className='flex items-center space-x-2'>
                <Link to='/login'>
                  <Button variant='outline' size='small'>
                    로그인
                  </Button>
                </Link>
                <Link to='/signup'>
                  <Button variant='primary' size='small'>
                    회원가입
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
