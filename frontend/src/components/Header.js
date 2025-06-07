// frontend/src/components/Header.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [hasToken, setHasToken] = useState(!!localStorage.getItem('jwt-token'));

  useEffect(() => {
    const syncTokenState = () => {
      setHasToken(!!localStorage.getItem('jwt-token'));
    };
    window.addEventListener('storage', syncTokenState);
    syncTokenState();
    return () => window.removeEventListener('storage', syncTokenState);
  }, []);

  useEffect(() => {
    setHasToken(!!user);
  }, [user]);

  const handleLoginClick = () => {
    if (location.pathname !== '/login') {
      navigate('/login');
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('jwt-token');
    localStorage.removeItem('user-id');
    localStorage.removeItem('user-email');
    setHasToken(false);
    if (onLogout) {
      onLogout();
    }
    if (location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  };

  return (
    <header
      style={{
        // Key changes for new layout:
        position: 'fixed', // Make header stick to the top
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1050, // Ensure header is above the sidebar
        height: '65px', // Define a fixed height

        // Existing styles
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 25px', // Use horizontal padding only
        borderBottom: '1px solid #e9ecef',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          fontSize: '1.7rem',
          fontWeight: 'bold',
          color: '#1f2937', // CHANGED: from blue to a dark charcoal/gray-800
          cursor: 'pointer',
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
        }}
        // In the new layout, clicking the logo should navigate to the base authenticated route
        // which will display the default 'Problem Tracker' view.
        onClick={() => navigate('/')}
      >
        Coding Made Simple
      </div>
      <div>
        {hasToken && user ? (
          <>
            {user.email && (
              <span style={{
                marginRight: '20px',
                color: '#495057',
                fontSize: '0.9rem',
                fontStyle: 'italic'
              }}>
                {user.email}
              </span>
            )}
            <button
              onClick={handleLogoutClick}
              style={{
                padding: '9px 18px',
                fontSize: '0.9rem',
                fontWeight: 500,
                borderRadius: '6px',
                border: '1px solid #ced4da',
                backgroundColor: '#f8f9fa',
                color: '#343a40',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e9ecef'; e.currentTarget.style.borderColor = '#adb5bd';}}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; e.currentTarget.style.borderColor = '#ced4da';}}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginClick}
            style={{
              padding: '9px 18px',
              fontSize: '0.9rem',
              fontWeight: 500,
              borderRadius: '6px',
              border: '1px solid #0069d9',
              backgroundColor: '#007bff',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0062cc'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    email: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
};

Header.defaultProps = {
  user: null,
};

export default Header;
