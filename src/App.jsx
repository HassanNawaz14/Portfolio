import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useMode } from './context/ModeContext';

const DesktopLayout = lazy(() => import('./components/Layout'));
const DesktopHome = lazy(() => import('./pages/Home'));
const DesktopQuickSitePage = lazy(() => import('./pages/QuickSitePage'));
const DesktopBuildingPage = lazy(() => import('./pages/BuildingPage'));
const DesktopProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const DesktopProfilesPage = lazy(() => import('./pages/ProfilesPage'));

const MobileLayout = lazy(() => import('./mobile/components/Layout'));
const MobileHome = lazy(() => import('./mobile/pages/Home'));
const MobileQuickSitePage = lazy(() => import('./mobile/pages/QuickSitePage'));
const MobileBuildingPage = lazy(() => import('./mobile/pages/BuildingPage'));
const MobileProjectsPage = lazy(() => import('./mobile/pages/ProjectsPage'));
const MobileProfilesPage = lazy(() => import('./mobile/pages/ProfilesPage'));

const toggleKeyframes = `
@keyframes toggle-glow {
  0%, 100% { box-shadow: 0 0 12px rgba(138, 92, 255, 0.3), 0 0 25px rgba(55, 216, 255, 0.1); }
  50% { box-shadow: 0 0 20px rgba(138, 92, 255, 0.6), 0 0 40px rgba(55, 216, 255, 0.25); }
}
@keyframes toggle-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes toggle-icon-in {
  0% { transform: scale(0) rotate(-90deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
`;

function ModeToggle() {
  const { mode, setMode } = useMode();
  const isMobile = mode === 'mobile';
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = document.querySelector('.sector-header');
      if (!el) { setHeaderVisible(false); return; }
      const opacity = parseFloat(el.style.opacity);
      setHeaderVisible(!isNaN(opacity) && opacity > 0.1);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  return (
    <>
      <style>{toggleKeyframes}</style>
      <button
        onClick={() => setMode(isMobile ? 'desktop' : 'mobile')}
        title={`Switch to ${isMobile ? 'Desktop' : 'Mobile'} view`}
        aria-label={`Switch to ${isMobile ? 'Desktop' : 'Mobile'} view`}
        style={{
          position: 'fixed',
          top: headerVisible ? '76px' : '20px',
          right: '20px',
          zIndex: 9999,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '1.5px solid rgba(138, 92, 255, 0.4)',
          background: 'rgba(13, 11, 33, 0.75)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          color: isMobile ? '#37d8ff' : '#f5f5ff',
          fontSize: '1.3rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 12px rgba(138, 92, 255, 0.3)',
          transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
          animation: 'toggle-glow 3s ease-in-out infinite',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.12)';
          e.currentTarget.style.borderColor = isMobile ? 'rgba(55, 216, 255, 0.7)' : 'rgba(138, 92, 255, 0.7)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4), 0 0 25px rgba(138, 92, 255, 0.5), 0 0 50px rgba(55, 216, 255, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderColor = 'rgba(138, 92, 255, 0.4)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3), 0 0 12px rgba(138, 92, 255, 0.3)';
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `conic-gradient(from 0deg, transparent, ${isMobile ? 'rgba(55, 216, 255, 0.15)' : 'rgba(138, 92, 255, 0.15)'}, transparent 60%)`,
            animation: 'toggle-rotate 4s linear infinite',
            pointerEvents: 'none',
          }}
        />
        <i
          key={mode}
          className={`fa-solid ${isMobile ? 'fa-desktop' : 'fa-mobile-screen-button'}`}
          style={{
            position: 'relative',
            zIndex: 1,
            animation: 'toggle-icon-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            filter: `drop-shadow(0 0 6px ${isMobile ? 'rgba(55, 216, 255, 0.5)' : 'rgba(138, 92, 255, 0.5)'})`,
          }}
        />
      </button>
    </>
  );
}

function DesktopApp() {
  return (
    <DesktopLayout>
      <Routes>
        <Route path="/" element={<DesktopHome />} />
        <Route path="/quicksite" element={<DesktopQuickSitePage />} />
        <Route path="/building" element={<DesktopBuildingPage />} />
        <Route path="/projects" element={<DesktopProjectsPage />} />
        <Route path="/profiles" element={<DesktopProfilesPage />} />
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
      <ModeToggle />
    </Router>
  );
}

export default App;
