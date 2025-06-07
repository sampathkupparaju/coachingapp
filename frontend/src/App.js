// frontend/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom';

// Import all necessary components
import Header from './components/Header';
import Login from './components/Login';
import ProblemList from './components/ProblemList';
import PrivateRoute from './components/PrivateRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Sidebar from './components/Sidebar'; // Import the new Sidebar component

// Import API functions
import { verifyCurrentUser, getLoggedInUserEmailFromToken } from './api/problems';

// AppWrapper remains the same, providing the Router context
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

// A simple placeholder for other sections
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '30px' }}>
    <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '15px' }}>{title}</h1>
    <p>This is a placeholder page for the "{title}" section. Content will be added here soon!</p>
  </div>
);

// This component represents the main authenticated view of the application
const MainAppLayout = ({ user, onLogout }) => {
  // State to manage which section is currently active in the sidebar
  const [activeSection, setActiveSection] = useState("Problem Tracker");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "Problem Tracker":
        // The ProblemList component is now the content for this section
        return <ProblemList />;
      case "DSA Tips & Tricks":
        return <PlaceholderPage title="DSA Tips & Tricks" />;
      case "Course Notes":
        return <PlaceholderPage title="Course Notes" />;
      case "Settings":
        return <PlaceholderPage title="Settings" />;
      default:
        // Default to the problem tracker if the section is unknown
        return <ProblemList />;
    }
  };

  return (
    <div className="main-app-layout">
      <Header user={user} onLogout={onLogout} />
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main content area is now positioned to the right of the sidebar */}
      <main style={{
        marginLeft: '240px', // This must match the sidebar's width
        paddingTop: '65px',  // This must match the header's height
        minHeight: 'calc(100vh - 65px)',
        padding: '20px' // Add some padding to the content area
      }}>
        {renderActiveSection()}
      </main>
    </div>
  );
};


function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthUpdate = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) setAuthLoading(true);

    const token = localStorage.getItem('jwt-token');
    const storedUserId = localStorage.getItem('user-id');
    const storedUserEmail = localStorage.getItem('user-email');

    if (token && storedUserId) {
      if (!user || isInitialLoad) {
        try {
          const verifyResponse = await verifyCurrentUser();
          if (verifyResponse.data && verifyResponse.data.userId.toString() === storedUserId) {
            setUser({ id: storedUserId, email: storedUserEmail || getLoggedInUserEmailFromToken() || 'User' });

            const from = location.state?.from?.pathname || "/problems";
            if (location.pathname === '/login' || location.pathname === '/') {
              navigate(from, { replace: true });
            }
          } else { throw new Error("Token verification mismatch."); }
        } catch (err) {
          console.error('App.js: Token verification failed:', err.response?.data || err.message);
          localStorage.clear(); // Clear all on auth failure
          setUser(null);
          if (location.pathname !== '/login') navigate('/login', { replace: true });
        }
      }
    } else {
      setUser(null);
    }
    if (isInitialLoad) setAuthLoading(false);
  }, [navigate, location.pathname, location.state, user]);

  useEffect(() => {
    handleAuthUpdate(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const syncAuth = (event) => {
      if (['jwt-token', 'user-id', 'user-email'].includes(event.key)) handleAuthUpdate();
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, [handleAuthUpdate]);

  const handleLoginSuccess = useCallback(() => {
    handleAuthUpdate();
  }, [handleAuthUpdate]);

  const handleLogout = useCallback(() => {
    setUser(null);
    // Navigation to /login is handled by the Header and routing logic
  }, []);

  if (authLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  return (
    // The Routes now decide whether to show the Login page or the full MainAppLayout
    <Routes>
      <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      <Route
        path="*"
        element={
          <PrivateRoute>
            <MainAppLayout user={user} onLogout={handleLogout} />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppWrapper;
