import React from 'react';

export const InstallGuide: React.FC = () => {
  return (
    <section id="install" className="install-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Cara Pemasangan Ekstensi (Google Chrome)</h2>
          <p className="section-desc">Ikuti 4 langkah mudah berikut untuk mengunduh dan memasang Popown Extension langsung ke browser Chrome Anda.</p>
        </div>
        
        <div className="install-steps">
          <div className="step-card">
            <div className="step-num">01</div>
            <h3>Unduh Arsip ZIP</h3>
            <p>Klik tombol di bawah ini untuk langsung mengunduh file ZIP ekstensi ke komputer Anda:<br />
              <a href="/popown-extension.zip" download className="btn btn-sm btn-primary" style={{ marginTop: '10px', display: 'inline-flex' }}>
                📥 Unduh ZIP Ekstensi
              </a>
            </p>
          </div>
          
          <div className="step-card">
            <div className="step-num">02</div>
            <h3>Ekstrak File ZIP</h3>
            <p>Ekstrak file <code>popown-extension.zip</code> yang telah diunduh ke dalam sebuah folder baru di komputer Anda (misalnya di folder Documents atau Desktop).</p>
          </div>
          
          <div className="step-card">
            <div className="step-num">03</div>
            <h3>Aktifkan Developer Mode</h3>
            <p>Buka browser Google Chrome Anda, lalu akses halaman ekstensi di: <br />
              <a href="chrome://extensions" target="_blank" rel="noreferrer" className="install-link">chrome://extensions</a>. Aktifkan toggle <strong>"Developer mode"</strong> di pojok kanan atas.
            </p>
          </div>
          
          <div className="step-card">
            <div className="step-num">04</div>
            <h3>Muat Folder Ekstrak</h3>
            <p>Klik tombol <strong>"Load unpacked"</strong> di pojok kiri atas halaman ekstensi Chrome, lalu pilih folder hasil ekstrak ZIP tadi (pastikan folder tersebut berisi file <code>manifest.json</code>).</p>
          </div>
        </div>

        <div className="install-success-card" style={{ marginTop: '30px', borderLeft: '4px solid #3b82f6', backgroundColor: '#f0f7ff', padding: '20px', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>
            💡 Tips Penggunaan Instan:
          </h4>
          <p style={{ fontSize: '13.5px', color: '#1e3a8a', textAlign: 'left', lineHeight: '1.6', margin: '0' }}>
            Setelah ekstensi berhasil terpasang, pastikan Anda menyematkan (Pin) ekstensi agar mudah digunakan:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', textAlign: 'left', fontSize: '13px', color: '#374151' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ backgroundColor: '#ffffff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>🧩</span>
              <span>Klik ikon <strong>Puzzle (Extensions)</strong> di pojok kanan atas browser Google Chrome Anda.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ backgroundColor: '#ffffff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>📌</span>
              <span>Klik ikon <strong>Pin</strong> di sebelah <strong>Popown - YouTube AI Companion</strong>.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ backgroundColor: '#ffffff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>✨</span>
              <span>Ekstensi akan selalu muncul di toolbar browser dan siap digunakan setiap kali Anda membuka YouTube!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
