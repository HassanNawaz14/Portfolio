import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useMode } from './context/ModeContext';
import ModeSwitch from './components/ModeSwitch';
import ContactLinks from './components/ContactLinks';

const DesktopLayout = lazy(() => import('./components/Layout'));
const DesktopHome = lazy(() => import('./pages/Home'));
const DesktopQuickSitePage = lazy(() => import('./pages/QuickSitePage'));
const DesktopBuildingPage = lazy(() => import('./pages/BuildingPage'));
const DesktopProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const DesktopProfilesPage = lazy(() => import('./pages/ProfilesPage'));
const APIDebugger = lazy(() => import('./pages/APIDebugger'));

const MobileLayout = lazy(() => import('./mobile/components/Layout'));
const MobileHome = lazy(() => import('./mobile/pages/Home'));
const MobileQuickSitePage = lazy(() => import('./mobile/pages/QuickSitePage'));
const MobileBuildingPage = lazy(() => import('./mobile/pages/BuildingPage'));
const MobileProjectsPage = lazy(() => import('./mobile/pages/ProjectsPage'));
const MobileProfilesPage = lazy(() => import('./mobile/pages/ProfilesPage'));

function DesktopApp() {
  return (
    <DesktopLayout>
      <Routes>
        <Route path="/" element={<DesktopHome />} />
        <Route path="/quicksite" element={<DesktopQuickSitePage />} />
        <Route path="/building" element={<DesktopBuildingPage />} />
        <Route path="/projects" element={<DesktopProjectsPage />} />
        <Route path="/profiles" element={<DesktopProfilesPage />} />
        <Route path="/debug" element={<APIDebugger />} />
      </Routes>
    </DesktopLayout>
  );
}

function MobileApp() {
  return (
    <MobileLayout>
      <Routes>
        <Route path="/" element={<MobileHome />} />
        <Route path="/quicksite" element={<MobileQuickSitePage />} />
        <Route path="/building" element={<MobileBuildingPage />} />
        <Route path="/projects" element={<MobileProjectsPage />} />
        <Route path="/profiles" element={<MobileProfilesPage />} />
        <Route path="/debug" element={<APIDebugger />} />
      </Routes>
    </MobileLayout>
  );
}

function App() {
  const { mode } = useMode();
  const isMobile = mode === 'mobile';

  return (
    <Router>
      <Suspense fallback={null}>
        {isMobile ? <MobileApp /> : <DesktopApp />}
      </Suspense>
      <ModeSwitch />
      <ContactLinks />
    </Router>
  );
}

export default App;
