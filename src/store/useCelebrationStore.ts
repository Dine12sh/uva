import { create } from "zustand";

interface CelebrationStore {
  fireworkTriggerCount: number;
  balloonTriggerCount: number;
  heartTriggerCount: number;
  confettiTriggerCount: number;
  
  triggerFireworks: () => void;
  triggerBalloons: () => void;
  triggerHearts: () => void;
  triggerConfetti: () => void;
}

export const useCelebrationStore = create<CelebrationStore>((set) => ({
  fireworkTriggerCount: 0,
  balloonTriggerCount: 0,
  heartTriggerCount: 0,
  confettiTriggerCount: 0,
  
  triggerFireworks: () => set((state) => ({ fireworkTriggerCount: state.fireworkTriggerCount + 1 })),
  triggerBalloons: () => set((state) => ({ balloonTriggerCount: state.balloonTriggerCount + 1 })),
  triggerHearts: () => set((state) => ({ heartTriggerCount: state.heartTriggerCount + 1 })),
  triggerConfetti: () => set((state) => ({ confettiTriggerCount: state.confettiTriggerCount + 1 })),
}));
