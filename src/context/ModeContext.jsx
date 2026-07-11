import { createContext, useContext, useEffect, useState } from 'react';

const ModeContext = createContext(null);

const STORAGE_KEY = 'portfolio-mode';

function detectDevice() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'desktop' || saved === 'mobile') return saved;
  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return isMobile ? 'mobile' : 'desktop';
}

export function ModeProvider({ children }) {
  const [mode, setModeState] = useState(detectDevice);

  const setMode = (next) => {
    setModeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  useEffect(() => {
    document.body.classList.remove('mode-desktop', 'mode-mobile');
    document.body.classList.add(`mode-${mode}`);
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
