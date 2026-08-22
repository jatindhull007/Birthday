import React from 'react';
import { useStepMachine } from '../lib/stepMachine';

const ACT_NAMES = [
  "LOBBY",
  "SECURITY",
  "DOSSIER",
  "VAULT",
  "LOVE TEST",
  "MISSION",
  "FINALE"
];

export default function ProgressRail() {
  const { currentStep } = useStepMachine();

  // Hide on final reveal step 6 to preserve pristine minimal aesthetics
  if (currentStep === 6) return null;

  return (
    <div className="fixed top-4 left-4 z-40">
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel text-xs font-body shadow-lg">
        <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
        <span className="font-display font-bold text-text-primary uppercase tracking-wider text-[11px]">
          ACT {currentStep}: {ACT_NAMES[currentStep]}
        </span>
        <div className="flex items-center gap-1.5 ml-2">
          {[0, 1, 2, 3, 4, 5, 6].map((stepIdx) => {
            const isCurrent = stepIdx === currentStep;
            const isCompleted = stepIdx < currentStep;

            return (
              <div
                key={stepIdx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'w-4 bg-accent-glow glow-primary'
                    : isCompleted
                    ? 'w-2 bg-success'
                    : 'w-2 bg-text-muted/30'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
