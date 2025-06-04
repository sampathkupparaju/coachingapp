// frontend/src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt-token');
    localStorage.removeItem('user-id');
    navigate('/login', { replace: true });
    // Hard reload to clear any in‐memory state
    window.location.reload();
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f9f9f9',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <h1
        onClick={() => navigate(user ? '/problems' : '/login')}
        style={{
          margin: 0,
          fontSize: '24px',
          color: '#333',
          cursor: 'pointer',
        }}
      >
        MakeCodingEasy
      </h1>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <>
            <FaUserCircle
              size={24}
              style={{ marginRight: '8px', color: '#555' }}
            />
            <span
              style={{
                marginRight: '16px',
                color: '#555',
                fontSize: '16px',
              }}
            >
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '6px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
