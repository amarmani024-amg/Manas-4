/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArenaProvider, useArena } from './context/ArenaContext';
import { Header } from './components/Header';
import { IntroHero } from './components/IntroHero';
import { StrengthRunner } from './components/StrengthRunner';
import { GymRush } from './components/GymRush';
import { BossBattle } from './components/BossBattle';
import { SecretBonusLevel } from './components/SecretBonusLevel';
import { VictoryFinale } from './components/VictoryFinale';
import { TrophyRoomModal } from './components/TrophyRoomModal';
import { AchievementBanner } from './components/AchievementBanner';
import { EasterEggs } from './components/EasterEggs';

const ArenaContent: React.FC = () => {
  const { activeGame } = useArena();

  return (
    <div className="min-h-screen bg-[#050B1F] text-[#F0F6FC] flex flex-col relative selection:bg-[#00F0FF]/30 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Floating Achievement Toast */}
      <AchievementBanner />

      {/* Easter Eggs Listeners & Interactive Corner Trigger */}
      <EasterEggs />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 pb-16">
        {activeGame === 'hub' && <IntroHero />}
        {activeGame === 'runner' && <StrengthRunner />}
        {activeGame === 'gym' && <GymRush />}
        {activeGame === 'boss' && <BossBattle />}
        {activeGame === 'bonus' && <SecretBonusLevel />}
        {activeGame === 'victory' && <VictoryFinale />}
        {activeGame === 'trophy' && <TrophyRoomModal />}
      </main>

      {/* Minimal Arcade Footer */}
      <footer className="py-4 px-6 border-t border-white/5 text-center text-xs text-white/40 font-mono">
        <p className="max-w-md mx-auto">
          ADVENTURE ARENA · CRAFTED FOR DISCIPLINE, CODE &amp; HEAVY REPS
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ArenaProvider>
      <ArenaContent />
    </ArenaProvider>
  );
}
