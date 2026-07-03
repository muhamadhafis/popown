import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface VideoPlayerRef {
  seekTo: (seconds: number) => void;
}

interface VideoPlayerProps {
  activeVideoId: string | null;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({ activeVideoId }, ref) => {
  // Using 'any' since window.YT types are load-on-demand and not standard npm types
  const ytPlayerRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    seekTo(seconds: number) {
      if (ytPlayerRef.current && ytPlayerRef.current.seekTo) {
        ytPlayerRef.current.seekTo(seconds, true);
        const state = ytPlayerRef.current.getPlayerState();
        if (state !== 1) { // 1 means Playing
          ytPlayerRef.current.playVideo();
        }
      }
    }
  }));

  useEffect(() => {
    if (!activeVideoId) return;

    const initPlayer = () => {
      const win = window as any;
      if (win.YT && win.YT.Player) {
        if (ytPlayerRef.current) {
          ytPlayerRef.current.loadVideoById(activeVideoId);
        } else {
          ytPlayerRef.current = new win.YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: activeVideoId,
            playerVars: {
              playsinline: 1,
              rel: 0
            },
            events: {
              onReady: () => console.log('Iframe player mounted.')
            }
          });
        }
      } else {
        setTimeout(initPlayer, 200);
      }
    };

    initPlayer();
  }, [activeVideoId]);

  if (!activeVideoId) {
    return (
      <div className="video-placeholder-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
        <p>Masukkan URL YouTube di atas untuk memutar video dan mengaktifkan AI</p>
      </div>
    );
  }

  return (
    <div className="video-iframe-container">
      <div id="youtube-player"></div>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
