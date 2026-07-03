export interface ChatMessage {
  sender: 'bot' | 'user' | 'system' | 'loading';
  text: string;
  jumpToSeconds?: number;
}

export interface BrandItem {
  brand: string;
  context: string;
  timestamp_seconds: number;
}
