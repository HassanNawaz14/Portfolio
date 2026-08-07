/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';

const ModeContext = createContext(null);

const STORAGE_KEY = 'portfolio-mode';

const VALID_MODES = ['desktop', 'mobile', 'car'];

function detectDevice() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (VALID_MODES.includes(saved)) return saved;
  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return isMobile ? 'mobile' : 'desktop';
}

export function ModeProvider({ children }) {
  const [mode, setModeState] = useState(detectDevice);

  const setMode = (next) => {
    if (!VALID_MODES.includes(next)) return;
    setModeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  useEffect(() => {
    document.body.classList.remove('mode-desktop', 'mode-mobile', 'mode-car');
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
