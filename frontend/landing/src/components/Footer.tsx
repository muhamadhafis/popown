import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; 2026 Popown Project — YouTube AI Companion. Dibuat dengan cinta menggunakan arsitektur modern & minimalis.</p>
        <div className="footer-links">
          <a href="https://github.com/muhamadhafis/popown" target="_blank" rel="noreferrer">Repositori GitHub</a>
          <span>&bull;</span>
          <a href="#demo">Live Demo</a>
        </div>
      </div>
    </footer>
  );
};
