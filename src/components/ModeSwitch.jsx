import { Fragment, useEffect, useState } from 'react';
import { useMode } from '../context/ModeContext';

const cyberStyles = `
.mode-switch-fixed {
  position: fixed;
  top: 16px;
  right: 20px;
  z-index: 9999;
  transition: top 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.cyber-signboard {
  --primary-glow: #00f0ff;
  --secondary-glow: #7000ff;
  --inactive-color: #5c6b7f;
  --bg-dark: #0f1016;
  --switch-width: 210px;
  --switch-height: 54px;
  --padding: 5px;

  --item-width: calc((var(--switch-width) - (var(--padding) * 2)) / 3);

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  font-family: sans-serif;
}

.cyber-switch {
  position: relative;
  width: var(--switch-width);
  height: var(--switch-height);
  background: var(--bg-dark);
  border-radius: 20px;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.8),
    inset 0 -1px 2px rgba(255, 255, 255, 0.05),
    0 20px 40px -10px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  padding: var(--padding);
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid #1f222e;
}

.cyber-switch input[type="radio"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.cyber-label {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  position: relative;
  border-radius: 14px;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}

.cyber-label .cyber-icon {
  font-size: 20px;
  color: var(--inactive-color);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.cyber-highlight {
  position: absolute;
  top: var(--padding);
  left: var(--padding);
  width: var(--item-width);
  height: calc(var(--switch-height) - (var(--padding) * 2));
  background: transparent;
  z-index: 1;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.highlight-inner {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    0 0 20px var(--primary-glow),
    inset 0 0 15px rgba(0, 240, 255, 0.2);
  backdrop-filter: blur(4px);
  position: relative;
  animation: cyberswitch-neon-pulse 3s infinite ease-in-out;
}

.highlight-inner::after {
  content: "";
  position: absolute;
  top: 0;
  left: 10%;
  width: 80%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
  opacity: 0.8;
}

#cyber-opt-0:checked ~ .cyber-highlight {
  transform: translateX(0%);
}
#cyber-opt-0:checked ~ [for="cyber-opt-0"] .cyber-icon {
  color: #fff;
  filter: drop-shadow(0 0 8px var(--primary-glow));
  transform: scale(1.1);
}

#cyber-opt-1:checked ~ .cyber-highlight {
  transform: translateX(100%);
}
#cyber-opt-1:checked ~ [for="cyber-opt-1"] .cyber-icon {
  color: #fff;
  filter: drop-shadow(0 0 8px var(--primary-glow));
  transform: scale(1.1);
}

#cyber-opt-2:checked ~ .cyber-highlight {
  transform: translateX(200%);
}
#cyber-opt-2:checked ~ [for="cyber-opt-2"] .cyber-icon {
  color: #fff;
  filter: drop-shadow(0 0 8px var(--primary-glow));
  transform: scale(1.1);
}

.cyber-switch input:focus-visible ~ .cyber-highlight .highlight-inner {
  border: 1px solid #fff;
  box-shadow: 0 0 30px var(--primary-glow);
}

.cyber-label:hover .cyber-icon {
  color: #aeb9cc;
}

.cyber-label:active .cyber-icon {
  transform: scale(0.95);
}

.glare {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  background: radial-gradient(
    circle at 50% -20%,
    rgba(255, 255, 255, 0.1),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s;
}
.cyber-label:hover .glare {
  opacity: 1;
}

@keyframes cyberswitch-neon-pulse {
  0%, 100% {
    box-shadow:
      0 0 20px var(--primary-glow),
      inset 0 0 15px rgba(0, 240, 255, 0.2);
  }
  50% {
    box-shadow:
      0 0 25px var(--primary-glow),
      inset 0 0 20px rgba(0, 240, 255, 0.3);
  }
}

@media (max-width: 480px) {
  .cyber-signboard {
    padding: 4px;
  }
  .cyber-switch {
    --switch-width: 154px;
    --switch-height: 38px;
    --padding: 4px;
  }
  .cyber-label .cyber-icon {
    font-size: 15px;
  }
}
`;

const OPTIONS = [
  { index: 0, id: 'cyber-opt-0', fa: 'fa-house', label: 'Home (Desktop mode)', mode: 'desktop' },
  { index: 1, id: 'cyber-opt-1', fa: 'fa-mobile-screen-button', label: 'Mobile mode', mode: 'mobile' },
  { index: 2, id: 'cyber-opt-2', fa: 'fa-car', label: 'Third mode - coming soon', mode: null },
];

function ModeSwitch() {
  const { mode, setMode } = useMode();
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = document.querySelector('.sector-header');
      if (!el) {
        setHeaderVisible(false);
        return;
      }
      const opacity = parseFloat(el.style.opacity);
      setHeaderVisible(!isNaN(opacity) && opacity > 0.1);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  const activeIdx = mode === 'mobile' ? 1 : 0;

  const handlePick = (option) => {
    if (option.mode) setMode(option.mode);
  };

  return (
    <>
      <style>{cyberStyles}</style>
      <div className="mode-switch-fixed" style={{ top: headerVisible ? '76px' : '16px' }}>
        <div className="cyber-signboard">
          <div className="cyber-switch">
            {OPTIONS.map((option) => (
              <Fragment key={option.id}>
                <input
                  type="radio"
                  id={option.id}
                  name="cyber-mode"
                  checked={activeIdx === option.index}
                  onChange={() => handlePick(option)}
                />
                <label htmlFor={option.id} className="cyber-label" title={option.label}>
                  <i className={`fa-solid ${option.fa} cyber-icon`} />
                  <span className="glare" />
                </label>
              </Fragment>
            ))}
            <div className="cyber-highlight">
              <div className="highlight-inner" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModeSwitch;
