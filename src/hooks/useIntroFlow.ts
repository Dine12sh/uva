import React from "react";
import { FlowState } from "../types";

type Action =
  | { type: "COMPLETE_COUNTDOWN" }
  | { type: "COMPLETE_INTRO" }
  | { type: "COMPLETE_HERO" };

interface FlowReducerState {
  state: FlowState;
  showCountdown: boolean;
  showIntro: boolean;
  showMain: boolean;
  showContent: boolean;
}

const initialState: FlowReducerState = {
  state: "COUNTDOWN",
  showCountdown: true,
  showIntro: false,
  showMain: false,
  showContent: false,
};

function flowReducer(state: FlowReducerState, action: Action): FlowReducerState {
  switch (action.type) {
    case "COMPLETE_COUNTDOWN":
      return {
        ...state,
        state: "INTRO",
        showCountdown: false,
        showIntro: true,
      };
    case "COMPLETE_INTRO":
      return {
        ...state,
        state: "HERO",
        showIntro: false,
        showMain: true,
      };
    case "COMPLETE_HERO":
      return {
        ...state,
        state: "CONTENT",
        showContent: true,
      };
    default:
      return state;
  }
}

export function useIntroFlow() {
  const [state, dispatch] = React.useReducer(flowReducer, initialState);

  const handleCountdownComplete = React.useCallback(() => {
    dispatch({ type: "COMPLETE_COUNTDOWN" });
  }, []);

  const handleIntroComplete = React.useCallback(() => {
    dispatch({ type: "COMPLETE_INTRO" });
  }, []);

  const handleHeroComplete = React.useCallback(() => {
    dispatch({ type: "COMPLETE_HERO" });
  }, []);

  return {
    flowState: state.state,
    showCountdown: state.showCountdown,
    showIntro: state.showIntro,
    showMain: state.showMain,
    showContent: state.showContent,
    handleCountdownComplete,
    handleIntroComplete,
    handleHeroComplete,
  };
}
