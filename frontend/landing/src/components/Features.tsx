import React from 'react';

export const Features: React.FC = () => {
  return (
    <section id="features" className="features-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Fitur-Fitur Premium Popown</h2>
          <p className="section-desc">Desain minimalis dan fitur berkinerja tinggi yang terintegrasi secara seamless.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon chat">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3>Chat & Smart Time Jumps</h3>
            <p>Tanyakan hal spesifik tentang video dan biarkan AI menjawab sekaligus melompat ke menit (timestamp) yang sesuai secara otomatis.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon brand">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
            </div>
            <h3>Detektor & Pelacak Brand</h3>
            <p>Lacak penyebutan nama merek atau brand di sepanjang video secara real-time. Klik ikon jam untuk melompat langsung ke adegan penyebutan brand.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon summary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="12" x2="9" y2="12"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
            </div>
            <h3>Rangkuman Eksekutif</h3>
            <p>Buat rangkuman terstruktur dengan poin-poin Markdown dalam hitungan detik. Menghemat waktu Anda dalam mencerna video panjang.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
