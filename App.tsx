import React, { useState } from 'react';
import { SimulatedPad } from './components/SimulatedPad';
import { SimulatedPhone } from './components/SimulatedPhone';
import { MarketerHome } from './components/MarketerHome';
import { CustomerPhoneHome } from './components/CustomerPhoneHome';

const App: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('1');

  return (
    <div className="h-screen w-full bg-[#f0f2f5] overflow-hidden">
      {/* Device Interaction Playground */}
      <main className="h-full flex items-center justify-center p-8 gap-12 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex items-center justify-center text-[20vw] font-black text-slate-900">
          {activeScenarioId}
        </div>

        {/* iPad Simulator (Left) - Marketer View */}
        <div className="flex flex-col items-center">
          <SimulatedPad>
            <MarketerHome />
          </SimulatedPad>
        </div>

        {/* iPhone Simulator (Right) - Mobile View */}
        <div className="flex flex-col items-center">
          <SimulatedPhone>
            <CustomerPhoneHome />
          </SimulatedPhone>
        </div>
      </main>
    </div>
  );
};

export default App;
