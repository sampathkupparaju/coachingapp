// frontend/src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ message = "Loading, please wait..." }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    padding: '20px',
    textAlign: 'center',
    color: '#495057', // Slightly darker text
    fontSize: '16px'
  }}>
    <div className='spinner' />
    {message && <p style={{ marginTop: '15px', fontWeight: '500' }}>{message}</p>}
    <style>
      {`
        .spinner {
          box-sizing: border-box;
          width: 44px; /* Slightly larger */
          height: 44px;
          border: 5px solid rgba(0, 0, 0, 0.1);
          border-top-color: #007bff; /* Primary theme color */
          border-radius: 50%;
          animation: spin 0.75s linear infinite; /* Slightly faster */
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export default LoadingSpinner;
