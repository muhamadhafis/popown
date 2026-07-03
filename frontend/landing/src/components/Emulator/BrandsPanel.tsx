import React from 'react';
import { BrandItem } from '../../types';

interface BrandsPanelProps {
  activeVideoId: string | null;
  brands: BrandItem[];
  onTrackBrands: () => void;
  isBrandsLoading: boolean;
  brandsFetched: boolean;
  seekTo: (seconds: number) => void;
}

export const BrandsPanel: React.FC<BrandsPanelProps> = ({
  activeVideoId,
  brands,
  onTrackBrands,
  isBrandsLoading,
  brandsFetched,
  seekTo
}) => {
  const formatSeconds = (seconds: number) => {
    const s = Math.floor(seconds);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s - hrs * 3600) / 60);
    const secs = s - hrs * 3600 - mins * 60;
    
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');
    
    if (hrs > 0) {
      return `${hrs}:${formattedMins}:${formattedSecs}`;
    }
    return `${mins}:${formattedSecs}`;
  };

  return (
    <div className="emulator-panel active">
      <div className="tab-desc-bar">
        <span>Merek/brand yang terdeteksi dalam video:</span>
        <button
          onClick={onTrackBrands}
          className="btn btn-secondary btn-sm"
          disabled={!activeVideoId || isBrandsLoading}
        >
          {isBrandsLoading ? 'Sedang Melacak...' : 'Lacak Brand'}
        </button>
      </div>
      <div className={`demo-brands-list ${!brandsFetched || brands.length === 0 ? 'empty' : ''}`}>
        {isBrandsLoading ? (
          <div className="skeleton-container" style={{ width: '100%' }}>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : !brandsFetched ? (
          'Silakan analisis video dan tekan "Lacak Brand" untuk melacak.'
        ) : brands.length === 0 ? (
          'Tidak ditemukan brand/merek yang dibahas di video ini.'
        ) : (
          brands.map((item, idx) => (
            <div key={idx} className="demo-brand-card">
              <div>
                <div className="demo-brand-title">{item.brand}</div>
                <div className="demo-brand-context">{item.context || 'Disebutkan dalam video'}</div>
              </div>
              <button
                className="timestamp-jump-btn"
                onClick={() => seekTo(item.timestamp_seconds)}
              >
                ⏱️ {formatSeconds(item.timestamp_seconds)}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
