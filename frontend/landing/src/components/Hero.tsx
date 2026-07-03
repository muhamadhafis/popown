import React, { useState } from 'react';

type MockTab = 'chat' | 'brands' | 'summary';

export const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MockTab>('chat');

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="badge">🌟 EKSTENSI CHROME POPULER</div>
          <h1 className="hero-title">Tonton YouTube Lebih Cerdas dengan <span>Asisten AI Popown</span></h1>
          <p className="hero-subtitle">Asisten AI pintar langsung di browser Anda. Lakukan tanya jawab instan tentang isi video, temukan adegan penting secara otomatis, dan dapatkan rangkuman eksekutif dalam hitungan detik tanpa membuang waktu.</p>
          
          <div className="hero-actions">
            <a href="/popown-extension.zip" download className="btn btn-primary btn-lg">📥 Instal Ekstensi</a>
            <a href="#demo" className="btn btn-secondary btn-lg">Coba Live Demo</a>
          </div>

          {/* Stat Badges below CTA */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-icon">⚡</span>
              <div>
                <strong>Rangkuman Instan</strong>
                <small>Hemat waktu menonton</small>
              </div>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-icon">🎯</span>
              <div>
                <strong>Deteksi Otomatis</strong>
                <small>Lacak adegan penting</small>
              </div>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-icon">🧠</span>
              <div>
                <strong>Berbasis AI</strong>
                <small>Jawaban cerdas & akurat</small>
              </div>
            </div>
          </div>
        </div>
        
        {/* Visual Extension Mockup */}
        <div className="hero-mockup-wrapper">
          <div className="extension-mockup-card">
            {/* Chrome Extension Header Bar */}
            <div className="mockup-header">
              <div className="mockup-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="mockup-title">Popown - YouTube Companion</div>
            </div>

            {/* Connected Video Bar */}
            <div className="mockup-youtube-bar">
              <span className="mock-dot"></span>
              <span className="mock-url-text">Connected: Membongkar Rahasia KFC...</span>
            </div>

            {/* Interactive Tabs */}
            <div className="mockup-tabs">
              {(['chat', 'brands', 'summary'] as MockTab[]).map((tab) => (
                <button
                  key={tab}
                  className={`mock-tab${activeTab === tab ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'chat' ? 'Chat' : tab === 'brands' ? 'Brands' : 'Rangkuman'}
                </button>
              ))}
            </div>

            {/* Tab Panel Body */}
            <div className="mockup-panel-body">
              {activeTab === 'chat' && (
                <>
                  <div className="mockup-chat-list">
                    <div className="mock-msg system">Hai! Saya siap menjawab pertanyaan tentang video KFC ini.</div>
                    <div className="mock-msg user">Kapan mereka membahas rahasia resep bumbu?</div>
                    <div className="mock-msg companion">
                      Rahasia resep 11 bumbu dibahas pada menit <strong>05:24</strong> ketika presenter mengunjungi laboratorium pusat.
                      <div className="mock-timestamp-pill">⏱️ Jump to 05:24</div>
                    </div>
                  </div>
                  <div className="mockup-input">
                    <div className="mock-input-field">Tanya sesuatu...</div>
                    <div className="mock-send-circle">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'brands' && (
                <div className="mockup-brands-list">
                  <div className="mock-brand-header">Brand Terdeteksi (3)</div>
                  <div className="mock-brand-item">
                    <span className="mock-brand-icon">🍗</span>
                    <div className="mock-brand-info">
                      <strong>KFC</strong>
                      <small>Disebutkan 12x · Pertama di 01:05</small>
                    </div>
                    <span className="mock-brand-pill">01:05</span>
                  </div>
                  <div className="mock-brand-item">
                    <span className="mock-brand-icon">🍔</span>
                    <div className="mock-brand-info">
                      <strong>McDonald's</strong>
                      <small>Disebutkan 7x · Pertama di 08:12</small>
                    </div>
                    <span className="mock-brand-pill">08:12</span>
                  </div>
                  <div className="mock-brand-item">
                    <span className="mock-brand-icon">🔥</span>
                    <div className="mock-brand-info">
                      <strong>Burger King</strong>
                      <small>Disebutkan 3x · Pertama di 15:44</small>
                    </div>
                    <span className="mock-brand-pill">15:44</span>
                  </div>
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="mockup-summary-panel">
                  <div className="mock-sum-heading">
                    Executive Summary – "Kalori Terbesar": Menyelami Menu Paling Tidak Sehat di Lima Restoran Cepat Saji
                  </div>
                  <div className="mock-sum-meta">Oleh [Penulis] – 3 Juli 2026</div>
                  <hr className="mock-sum-divider" />
                  <div className="mock-sum-section-title">1. Tujuan &amp; Metodologi Eksperimen</div>
                  <div className="mock-sum-table">
                    <div className="mock-sum-thead">
                      <span>Aspek</span>
                      <span>Detail</span>
                    </div>
                    <div className="mock-sum-trow">
                      <span>Goal</span>
                      <span>Mengidentifikasi menu dengan <strong>total kalori tertinggi</strong> di masing-masing restoran cepat saji.</span>
                    </div>
                    <div className="mock-sum-trow">
                      <span>Aturan</span>
                      <span>Tidak menolak satupun bahan (mayones, saus, topping).</span>
                    </div>
                  </div>
                  <div className="mock-sum-section-title">2. Temuan Utama</div>
                  <ul className="mock-sum-list">
                    <li><strong>KFC:</strong> Ayam goreng gule ~450 kcal — "Enak, nagih, tapi kalori tinggi".</li>
                    <li><strong>McDonald's:</strong> Double Beef + saus spesial ~820 kcal — terfavorit.</li>
                    <li><strong>Starbucks:</strong> Frappe cokelat grande ~610 kcal — minuman terpadat kalori.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
