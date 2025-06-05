// frontend/src/components/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * A wrapper for routes that require authentication.
 * If the user is not authenticated (i.e., no 'jwt-token' in localStorage),
 * it redirects to the /login page, preserving the intended destination.
 *
 * For a more robust check, this could also consult a global auth state
 * managed by App.js or a React Context, which might involve token verification.
 * However, for this setup, checking localStorage is a common first step.
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('jwt-token');
  const location = useLocation(); // Gets the current location object

  if (!token) {
    // User not authenticated, redirect to login
    console.log('PrivateRoute: No token. Redirecting to /login. Intended path:', location.pathname);
    // Pass the current location as state, so after login,
    // the user can be redirected back to the page they were trying to access.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected component
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired, // Expecting a single React element as child
};

export default PrivateRoute;
