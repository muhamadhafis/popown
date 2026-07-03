import React from 'react';
import { ChatMessage, BrandItem } from '../../types';
import { ChatPanel } from './ChatPanel';
import { BrandsPanel } from './BrandsPanel';
import { SummaryPanel } from './SummaryPanel';

interface EmulatorBoxProps {
  activeVideoId: string | null;
  activeTab: string;
  onTabChange: (tab: 'chat' | 'brands' | 'summary') => void;
  
  // Chat Props
  chatMessages: ChatMessage[];
  chatInput: string;
  onChatInputChange: (val: string) => void;
  onChatSend: () => void;
  isChatLoading: boolean;

  // Brand Props
  brands: BrandItem[];
  onTrackBrands: () => void;
  isBrandsLoading: boolean;
  brandsFetched: boolean;

  // Summary Props
  summary: string;
  onGenerateSummary: () => void;
  isSummaryLoading: boolean;
  summaryFetched: boolean;

  // Player trigger
  seekTo: (seconds: number) => void;
}

export const EmulatorBox: React.FC<EmulatorBoxProps> = ({
  activeVideoId,
  activeTab,
  onTabChange,
  chatMessages,
  chatInput,
  onChatInputChange,
  onChatSend,
  isChatLoading,
  brands,
  onTrackBrands,
  isBrandsLoading,
  brandsFetched,
  summary,
  onGenerateSummary,
  isSummaryLoading,
  summaryFetched,
  seekTo
}) => {
  return (
    <div className="demo-emulator-box">
      <div className="emulator-tabs">
        <button
          className={`emulator-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => onTabChange('chat')}
        >
          Chat
        </button>
        <button
          className={`emulator-tab ${activeTab === 'brands' ? 'active' : ''}`}
          onClick={() => onTabChange('brands')}
        >
          Brands
        </button>
        <button
          className={`emulator-tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => onTabChange('summary')}
        >
          Rangkuman
        </button>
      </div>
      
      <div className="emulator-panels">
        {activeTab === 'chat' && (
          <ChatPanel
            activeVideoId={activeVideoId}
            chatMessages={chatMessages}
            chatInput={chatInput}
            onChatInputChange={onChatInputChange}
            onSend={onChatSend}
            isChatLoading={isChatLoading}
            seekTo={seekTo}
          />
        )}

        {activeTab === 'brands' && (
          <BrandsPanel
            activeVideoId={activeVideoId}
            brands={brands}
            onTrackBrands={onTrackBrands}
            isBrandsLoading={isBrandsLoading}
            brandsFetched={brandsFetched}
            seekTo={seekTo}
          />
        )}

        {activeTab === 'summary' && (
          <SummaryPanel
            activeVideoId={activeVideoId}
            summary={summary}
            onGenerateSummary={onGenerateSummary}
            isSummaryLoading={isSummaryLoading}
            summaryFetched={summaryFetched}
            seekTo={seekTo}
          />
        )}
      </div>
    </div>
  );
};
