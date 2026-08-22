import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import experienceData from './data/experienceData';
import { StepProvider, useStepMachine } from './lib/stepMachine';
import { actTransitionVariant } from './lib/motion';

import AmbientBackground from './components/AmbientBackground';
import ProgressRail from './components/ProgressRail';

import Landing from './steps/Landing';
import OTP from './steps/OTP';
import Investigation from './steps/Investigation';
import MemoryVault from './steps/MemoryVault';
import LoveTest from './steps/LoveTest';
import FinalMission from './steps/FinalMission';
import Reveal from './steps/Reveal';

function StepRouter() {
  const { currentStep } = useStepMachine();

  const renderStepComponent = () => {
    switch (currentStep) {
      case 0:
        return <Landing data={experienceData} />;
      case 1:
        return <OTP data={experienceData} />;
      case 2:
        return <Investigation data={experienceData} />;
      case 3:
        return <MemoryVault data={experienceData} />;
      case 4:
        return <LoveTest data={experienceData} />;
      case 5:
        return <FinalMission data={experienceData} />;
      case 6:
        return <Reveal data={experienceData} />;
      default:
        return <Landing data={experienceData} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-base-deep text-text-primary overflow-x-hidden selection:bg-accent-primary selection:text-white">
      {/* Global Ambient Background Layer (shifts colors per step + desktop cursor glow) */}
      <AmbientBackground currentStep={currentStep} />

      {/* Global Progress Rail */}
      <ProgressRail />

      {/* Main Step Transition Shell */}
      <main className="relative z-10 w-full min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${currentStep}`}
            variants={actTransitionVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full min-h-screen"
          >
            {renderStepComponent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <StepProvider>
      <StepRouter />
    </StepProvider>
  );
}
