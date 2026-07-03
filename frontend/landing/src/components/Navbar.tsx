import React from 'react';
import iconLogo from '../assets/icon.svg';

export const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="logo">
          <img src={iconLogo} alt="Logo" width="32" height="32" className="logo-svg" />
          <span className="logo-text">Popown</span>
        </div>
        <nav className="nav-links">
          <a href="#features" className="nav-link">Fitur Utama</a>
          <a href="#demo" className="nav-link">Uji Coba Langsung</a>
          <a href="#install" className="nav-link">Panduan Install</a>
        </nav>
        <div className="nav-actions">
          <a href="/popown-extension.zip" download className="btn btn-primary btn-nav">Download Extension</a>
        </div>
      </div>
    </header>
  );
};
