import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DemoScenarioModal } from './components/common/DemoScenarioBar';

import { OverviewPage } from './pages/OverviewPage';
import { MachineDetailPage } from './pages/MachineDetailPage';
import { AlertsPage } from './pages/AlertsPage';
import { CorrosionGuidePage } from './pages/CorrosionGuidePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#070b12] dark:bg-[#070b12] light:bg-[#f8fafc] text-slate-100 light:text-slate-900 transition-colors duration-200">
            {/* Top Navigation with Demo button */}
            <Navbar onOpenDemo={() => setDemoModalOpen(true)} />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/machine/:id" element={<MachineDetailPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/guide" element={<CorrosionGuidePage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Demo Presentation Modal (Opens only when clicked, leaves bottom 100% clean) */}
            <DemoScenarioModal
              isOpen={demoModalOpen}
              onClose={() => setDemoModalOpen(false)}
            />

            {/* Footer with Unobstructed Important Advisory Note at the bottom */}
            <Footer />
          </div>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;
