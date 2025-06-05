// frontend/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate, // Import Navigate for default route
} from 'react-router-dom';

import Header from './components/Header';
import Login from './components/Login';
import ProblemList from './components/ProblemList';
import PrivateRoute from './components/PrivateRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Import the API function to verify the current user
// and the utility to get email from token if needed
import { verifyCurrentUser, getLoggedInUserEmailFromToken } from './api/problems';

// AppWrapper is necessary because hooks like useNavigate can only be used inside a Router component.
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  // user state: null if not logged in, or { id: string, email: string } if logged in
  const [user, setUser] = useState(null);
  // authLoading: true while checking initial authentication status
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Memoized function to check and update authentication status
  const handleAuthUpdate = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) setAuthLoading(true);

    const token = localStorage.getItem('jwt-token');
    const storedUserId = localStorage.getItem('user-id');
    const storedUserEmail = localStorage.getItem('user-email'); // Email stored by Login.js

    if (token && storedUserId) {
      if (!user || isInitialLoad) {
        try {
          const verifyResponse = await verifyCurrentUser();
          if (verifyResponse.data && verifyResponse.data.userId.toString() === storedUserId) {
            setUser({ id: storedUserId, email: storedUserEmail || getLoggedInUserEmailFromToken() || 'User' });
            console.log('App.js: User authenticated. User details:', { id: storedUserId, email: storedUserEmail });

            const from = location.state?.from?.pathname || "/problems";
            if (location.pathname === '/login' || location.pathname === '/') {
              navigate(from, { replace: true });
            }
          } else {
            throw new Error("Token verification returned inconsistent user ID or data.");
          }
        } catch (err) {
          console.error('App.js: Token verification failed:', err.response?.data || err.message);
          localStorage.removeItem('jwt-token');
          localStorage.removeItem('user-id');
          localStorage.removeItem('user-email');
          setUser(null);
          if (location.pathname !== '/login') {
             navigate('/login', { replace: true });
          }
        }
      }
    } else {
      setUser(null);
    }
    if (isInitialLoad) setAuthLoading(false);
  }, [navigate, location.pathname, location.state, user]);

  useEffect(() => {
    console.log("App.js: Component mounted, performing initial auth check.");
    handleAuthUpdate(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const syncAuth = (event) => {
      if (event.key === 'jwt-token' || event.key === 'user-id' || event.key === 'user-email') {
        console.log("App.js: Auth-related localStorage item changed, re-checking auth status.");
        handleAuthUpdate();
      }
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, [handleAuthUpdate]);

  const handleLoginSuccess = useCallback(() => {
    console.log("App.js: Login successful (callback from Login.js). Triggering auth update.");
    handleAuthUpdate();
  }, [handleAuthUpdate]);

  const handleLogout = useCallback(() => {
    console.log("App.js: Logout initiated (callback from Header.js).");
    setUser(null);
    // Header.js also clears localStorage and handles navigation to /login
  }, []);

  if (authLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  return (
    // Using React.Fragment to avoid an unnecessary extra div wrapping the whole app
    <>
      <Header user={user} onLogout={handleLogout} />

      {/* Main content area */}
      <div style={{
        paddingTop: '20px',
        paddingBottom: '20px',
        minHeight: 'calc(100vh - 100px)', // Adjust 100px based on your actual header height + padding
        // This ensures content pushes potential footers down even on short pages.
      }}>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route
            path="/problems"
            element={
              <PrivateRoute>
                <ProblemList />
              </PrivateRoute>
            }
          />
          {/* Default route: if authenticated, go to problems, else to login */}
          <Route
            path="*"
            element={user ? <Navigate to="/problems" replace /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>

      {/* Ensure there are NO other renderings of <Header />, <Login />,
        or similar components after this main content div.
        The duplication seen in your screenshot was likely caused by
        an unintentional rendering of such a component here.
      */}
    </>
  );
}

export default AppWrapper;
