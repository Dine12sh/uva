import { create } from "zustand";

interface MusicStore {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  musicUrl: string;
  isSynthEnabled: boolean;
  setPlaying: (playing: boolean) => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setMusicUrl: (url: string) => void;
  setSynthEnabled: (enabled: boolean) => void;
}

export const useMusicStore = create<MusicStore>((set) => ({
  isPlaying: false,
  isMuted: false,
  volume: 0.4,
  musicUrl: "/media/default_music.mp3",
  isSynthEnabled: true,
  setPlaying: (playing) => set({ isPlaying: playing }),
  setMuted: (muted) => set({ isMuted: muted }),
  setVolume: (volume) => set({ volume }),
  setMusicUrl: (musicUrl) => set({ musicUrl }),
  setSynthEnabled: (isSynthEnabled) => set({ isSynthEnabled }),
}));
