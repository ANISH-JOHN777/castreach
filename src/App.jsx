import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GuestDashboard from './pages/GuestDashboard';
import HostDashboard from './pages/HostDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import Messages from './pages/Messages';

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
        <div className="skeleton" style={{ width: '200px', height: '40px' }}>
          Loading...
        </div>
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

        {/* Protected Routes - Organizer */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['organizer']}>
              <OrganizerDashboard />
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
          path="/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
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

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
