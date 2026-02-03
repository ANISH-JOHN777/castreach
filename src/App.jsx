import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { NotificationsProvider } from './context/NotificationsContext';
import AppLayout from './layouts/AppLayout';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GuestDashboard from './pages/GuestDashboard';
import HostDashboard from './pages/HostDashboard';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Bookings from './pages/Bookings';
import BookingRequest from './pages/BookingRequest';
import PodcastRoom from './pages/PodcastRoom';
import Messages from './pages/Messages';
import Personalization from './pages/Personalization';
import About from './pages/About';
import Analytics from './pages/Analytics';
import CalendarView from './pages/CalendarView';

import './styles/global.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes - Guest */}
        <Route
          path="/guest/dashboard"
          element={
            <ProtectedRoute allowedRoles={['guest']}>
              <GuestDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Host */}
        <Route
          path="/host/dashboard"
          element={
            <ProtectedRoute allowedRoles={['host']}>
              <HostDashboard />
            </ProtectedRoute>
          }
        />

        {/* Personalization/Onboarding */}
        <Route
          path="/personalization"
          element={
            <ProtectedRoute>
              <Personalization />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - All Authenticated Users */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/request"
          element={
            <ProtectedRoute allowedRoles={['host']}>
              <BookingRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <ProtectedRoute>
              <PodcastRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room"
          element={
            <ProtectedRoute>
              <PodcastRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarView />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <ToastProvider>
          <AuthProvider>
            <FavoritesProvider>
              <NotificationsProvider>
                <ScrollToTop />
                <AppRoutes />
              </NotificationsProvider>
            </FavoritesProvider>
          </AuthProvider>
        </ToastProvider>
      </DarkModeProvider>
    </BrowserRouter>
  );
}

export default App;
