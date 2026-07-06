import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { InstallGuide } from './components/InstallGuide';
import { Footer } from './components/Footer';
import { VideoPlayer, VideoPlayerRef } from './components/VideoPlayer';
import { EmulatorBox } from './components/Emulator/EmulatorBox';
import { ChatMessage, BrandItem } from './types';

export const App: React.FC = () => {
  // Config & State
  const [backendUrl, setBackendUrl] = useState<string>(() => {
    const saved = localStorage.getItem('popown_demo_backend_url');
    return saved || import.meta.env.VITE_API_URL || 'https://popown-backend-eight.vercel.app';
  });
  
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'brands' | 'summary'>('chat');
  
  // Emulator Data States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [isBrandsLoading, setIsBrandsLoading] = useState<boolean>(false);
  const [brandsFetched, setBrandsFetched] = useState<boolean>(false);

  const [summary, setSummary] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [summaryFetched, setSummaryFetched] = useState<boolean>(false);

  // Player Ref
  const videoPlayerRef = useRef<VideoPlayerRef | null>(null);

  // Save backend URL to localStorage
  useEffect(() => {
    localStorage.setItem('popown_demo_backend_url', backendUrl);
  }, [backendUrl]);

  // YouTube URL parser
  const extractVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAnalyze = (targetUrl?: string) => {
    const url = targetUrl || videoUrl;
    const id = extractVideoId(url);
    if (!id) {
      showToast('URL YouTube tidak valid. Harap gunakan format link standar.');
      return;
    }

    setActiveVideoId(id);

    // Reset Emulator States
    setChatMessages([
      {
        sender: 'bot',
        text: `Halo! Saya siap menganalisis video dengan ID **${id}**. Silakan ajukan pertanyaan atau minta saya untuk merangkum dan melacak brand.`
      }
    ]);
    setBrands([]);
    setBrandsFetched(false);
    setSummary('');
    setSummaryFetched(false);
    showToast(`Video ${id} berhasil dimuat di emulator!`);
  };

  const seekTo = (seconds: number) => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seekTo(seconds);
    }
  };

  // Helper API Callers
  const callAPI = async (endpoint: string, body: object) => {
    const response = await fetch(`${backendUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP Error ${response.status}`);
    }
    return response.json();
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !activeVideoId) return;

    const currentMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: currentMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await callAPI('/api/chat', {
        video_id: activeVideoId,
        message: currentMsg,
        language: 'id'
      });

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: res.reply,
          jumpToSeconds: res.jump_to_seconds
        }
      ]);
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `Error: Gagal memanggil API backend di ${backendUrl}. Pastikan server menyala dan CORS diizinkan.\nDetail: ${err.message}`
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleTrackBrands = async () => {
    if (!activeVideoId) return;
    setIsBrandsLoading(true);
    setBrands([]);
    
    try {
      const res = await callAPI('/api/brand', {
        video_id: activeVideoId,
        language: 'id'
      });
      setBrands(res.brands || []);
      setBrandsFetched(true);
    } catch (err: any) {
      showToast(`Gagal melacak brand: ${err.message}`);
    } finally {
      setIsBrandsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!activeVideoId) return;
    setIsSummaryLoading(true);
    setSummary('');
    
    try {
      const res = await callAPI('/api/summarize', {
        video_id: activeVideoId,
        language: 'id'
      });
      setSummary(res.summary || '');
      setSummaryFetched(true);
    } catch (err: any) {
      showToast(`Gagal memuat rangkuman: ${err.message}`);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.backgroundColor = '#0f172a';
    toast.style.color = '#ffffff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.fontSize = '13px';
    toast.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
    toast.style.zIndex = '9999';
    toast.style.transition = 'all 0.3s ease';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  return (
    <div>
      <Navbar />
      <Hero />
      <Features />

      {/* Interactive Live Demo Section */}
      <section id="demo" className="demo-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Coba Live Demo Sekarang</h2>
            <p className="section-desc">Gunakan URL video YouTube Anda sendiri (atau gunakan video demo yang disediakan) untuk menguji integrasi API backend Popown secara langsung.</p>
          </div>
          
          <div className="demo-card-wrapper">
            <div className="demo-url-bar">
              <div className="input-group">
                <span className="url-icon">🔗</span>
                <input
                  type="text"
                  placeholder="Masukkan URL YouTube (Contoh: https://www.youtube.com/watch?v=xlWhpXdOlTo)"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAnalyze(); } }}
                />
                <button onClick={() => handleAnalyze()} className="btn btn-primary">Analisis Video</button>
              </div>
              <div className="quick-examples">
                <span>Video Rekomendasi:</span>
                <button
                  className="example-btn"
                  onClick={() => {
                    setVideoUrl('https://www.youtube.com/watch?v=xlWhpXdOlTo');
                    handleAnalyze('https://www.youtube.com/watch?v=xlWhpXdOlTo');
                  }}
                >
                  KFC & McDonald's Review (xlWhpXdOlTo)
                </button>
              </div>
            </div>

            {/* Connection Settings - Hidden */}
            <div className="demo-settings-alert" style={{ display: 'none' }}>
              <span className="info-icon">ℹ️</span>
              <span>Status Sistem: Terhubung ke **AI Engine**. Anda dapat menyesuaikan alamat server AI jika menggunakan server pribadi:</span>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                className="subtle-input"
              />
            </div>

            <div className="demo-layout">
              {/* Video Player Frame Box */}
              <div className="demo-media-box">
                <VideoPlayer ref={videoPlayerRef} activeVideoId={activeVideoId} />
              </div>

              {/* Interactive Extension Emulator */}
              <EmulatorBox
                activeVideoId={activeVideoId}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                chatMessages={chatMessages}
                chatInput={chatInput}
                onChatInputChange={setChatInput}
                onChatSend={handleChatSend}
                isChatLoading={isChatLoading}
                brands={brands}
                onTrackBrands={handleTrackBrands}
                isBrandsLoading={isBrandsLoading}
                brandsFetched={brandsFetched}
                summary={summary}
                onGenerateSummary={handleGenerateSummary}
                isSummaryLoading={isSummaryLoading}
                summaryFetched={summaryFetched}
                seekTo={seekTo}
              />
            </div>
          </div>
        </div>
      </section>

      <InstallGuide />
      <Footer />
    </div>
  );
};
export default App;
