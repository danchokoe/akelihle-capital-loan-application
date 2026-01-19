import React from 'react';
import './Preloader.css';

interface PreloaderProps {
  isLoading: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="preloader-overlay">
      <div className="preloader-content">
        <div className="logo-container">
          <img 
            src="/logo.png" 
            alt="Akelihle Capital" 
            className="preloader-logo"
          />
        </div>
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading Akelihle Capital...</p>
      </div>
    </div>
  );
};

export default Preloader;