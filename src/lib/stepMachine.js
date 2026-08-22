import React, { createContext, useContext, useReducer } from 'react';

const StepContext = createContext(null);

const initialState = {
  currentStep: 0,
};

function stepReducer(state, action) {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(6, state.currentStep + 1) };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case 'GO_TO_STEP':
      return { ...state, currentStep: Math.max(0, Math.min(6, action.payload)) };
    case 'RESET':
      return { ...state, currentStep: 0 };
    default:
      return state;
  }
}

export function StepProvider({ children }) {
  const [state, dispatch] = useReducer(stepReducer, initialState);

  const nextStep = () => dispatch({ type: 'NEXT_STEP' });
  const prevStep = () => dispatch({ type: 'PREV_STEP' });
  const goToStep = (step) => dispatch({ type: 'GO_TO_STEP', payload: step });
  const reset = () => dispatch({ type: 'RESET' });

  return React.createElement(
    StepContext.Provider,
    { value: { currentStep: state.currentStep, dispatch, nextStep, prevStep, goToStep, reset } },
    children
  );
}

export function useStepMachine() {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useStepMachine must be used within a StepProvider');
  }
  return context;
}
