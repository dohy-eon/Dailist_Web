import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { SocialPage } from '@/pages/SocialPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { Navbar } from '@/components/common/Navbar';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to='/login' />;
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className='min-h-screen bg-gray-50'>
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/social'
            element={
              <ProtectedRoute>
                <SocialPage />
              </ProtectedRoute>
            }
          />
          <Route path='/login' element={isAuthenticated ? <Navigate to='/' /> : <LoginPage />} />
          <Route path='/signup' element={isAuthenticated ? <Navigate to='/' /> : <SignupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
