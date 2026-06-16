"use client";

import { useEffect, useRef } from "react";
import { useMusicStore } from "../store/useMusicStore";

export function useSoundtrack() {
  const { isPlaying, isMuted, volume, musicUrl, isSynthEnabled } = useMusicStore();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Play standard audio file if available
  useEffect(() => {
    if (!audioElRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audioElRef.current = audio;
    }

    const audio = audioElRef.current;
    audio.src = musicUrl;
    
    // Attempt playback if already playing
    if (isPlaying) {
      audio.play().catch(() => {
        // Fallback to synth if file fails to load or play
        console.log("Audio file playback blocked or failed, synth will play.");
      });
    } else {
      audio.pause();
    }
  }, [musicUrl, isPlaying]);

  // Adjust volume & mute for audio element
  useEffect(() => {
    if (audioElRef.current) {
      audioElRef.current.volume = isMuted ? 0 : volume;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle synth playback
  useEffect(() => {
    if (isPlaying && isSynthEnabled) {
      // Start Web Audio Synth
      startSynth();
    } else {
      stopSynth();
    }

    return () => {
      stopSynth();
    };
  }, [isPlaying, isSynthEnabled]);

  const startSynth = () => {
    if (synthIntervalRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.value = isMuted ? 0 : volume;
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Add a simple delay effect for spacey, dreamy sound
      const delay = ctx.createDelay(1.0);
      delay.delayTime.value = 0.4;
      const delayFeedback = ctx.createGain();
      delayFeedback.gain.value = 0.35;

      delay.connect(delayFeedback);
      delayFeedback.connect(delay);
      delay.connect(masterGain);

      // Chords definitions: [root, third, fifth, seventh/extension] in Hz
      const progressions = [
        [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
        [110.00, 130.81, 164.81, 196.00], // Am7 (A2, C3, E3, G3)
        [87.31, 110.00, 130.81, 164.81],  // Fmaj7 (F2, A2, C3, E3)
        [98.00, 123.47, 146.83, 196.00],  // G6 (G2, B2, D3, G3)
      ];

      let step = 0;

      const playPianoTone = (freq: number, start: number, duration: number, isTreble = false) => {
        if (!audioContextRef.current || audioContextRef.current.state === "suspended") return;
        const c = audioContextRef.current;
        
        // Triangle wave for smooth, flute/wood-like sound mixed with sine wave for roundness
        const osc1 = c.createOscillator();
        const osc2 = c.createOscillator();
        const toneGain = c.createGain();

        osc1.type = "sine";
        osc1.frequency.value = freq;

        osc2.type = "triangle";
        osc2.frequency.value = freq * 2; // Octave harmonic for richness

        // ADSR Envelope
        const now = start;
        toneGain.gain.setValueAtTime(0, now);
        toneGain.gain.linearRampToValueAtTime(isTreble ? 0.08 : 0.15, now + 0.05); // quick attack
        toneGain.gain.exponentialRampToValueAtTime(0.001, now + duration); // slow decay

        // Add filter to cut high harsh frequencies
        const filter = c.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = isTreble ? 1200 : 600;

        osc1.connect(toneGain);
        osc2.connect(toneGain);
        
        // Split output to direct master gain and delay
        toneGain.connect(filter);
        filter.connect(masterGain);
        filter.connect(delay);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
      };

      const triggerChord = () => {
        if (!ctx) return;
        const now = ctx.currentTime;
        const chord = progressions[step % progressions.length];
        
        // Play bass/mid notes
        chord.forEach((freq, idx) => {
          playPianoTone(freq, now + idx * 0.08, 3.5, false);
        });

        // Add 1 or 2 high sparkling notes
        if (Math.random() > 0.3) {
          const highNotes = [392.00, 440.00, 523.25, 587.33, 659.25, 783.99]; // G4, A4, C5, D5, E5, G5
          const randomFreq = highNotes[Math.floor(Math.random() * highNotes.length)];
          playPianoTone(randomFreq * 2, now + 1.5, 2.0, true);
        }

        step++;
      };

      // Play first chord immediately
      triggerChord();

      // Schedule chord every 4 seconds
      synthIntervalRef.current = setInterval(triggerChord, 4000);

    } catch (e) {
      console.error("Web Audio API failed", e);
    }
  };

  const stopSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  // Web Audio synth birthday celebration melody (when candle is blown)
  const playBirthdaySong = () => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(ctx.destination);

    // Happy Birthday notes and durations
    // C4, C4, D4, C4, F4, E4
    const notes = [
      261.63, 261.63, 293.66, 261.63, 349.23, 329.63, // Happy birthday to you
      261.63, 261.63, 293.66, 261.63, 392.00, 349.23, // Happy birthday to you
      261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66, // Happy birthday dear friend
      466.16, 466.16, 440.00, 349.23, 392.00, 349.23  // Happy birthday to you
    ];

    const durations = [
      0.37, 0.12, 0.5, 0.5, 0.5, 1.0,
      0.37, 0.12, 0.5, 0.5, 0.5, 1.0,
      0.37, 0.12, 0.5, 0.5, 0.5, 0.5, 0.5,
      0.37, 0.12, 0.5, 0.5, 0.5, 1.0
    ];

    let time = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.value = freq;
      
      const dur = durations[idx];
      noteGain.gain.setValueAtTime(0, time);
      noteGain.gain.linearRampToValueAtTime(0.2, time + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, time + dur - 0.02);
      
      osc.connect(noteGain);
      noteGain.connect(gain);
      
      osc.start(time);
      osc.stop(time + dur);
      
      time += dur + 0.05;
    });
  };

  return { playBirthdaySong };
}
