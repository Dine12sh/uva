export type FlowState = "COUNTDOWN" | "INTRO" | "HERO" | "CONTENT";

export interface Memory {
  id: string;
  type: string;
  url: string;
  caption: string | null;
  section: string;
}

export interface MainPageWrapperProps {
  memories: Memory[];
}

export interface HeroSectionProps {
  onRevealComplete: () => void;
}
