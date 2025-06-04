// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', marginTop: 40 }}>
    <div className='spinner' />
    <style>
      {`
        .spinner {
          margin: auto;
          width: 40px;
          height: 40px;
          border: 4px solid #ccc;
          border-top: 4px solid #333;
          border-radius: 50%;
          animation: spin 1s linear infinite;
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
