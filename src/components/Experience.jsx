import { useRef, useEffect } from 'react';
import { animated, useScroll, useSpring } from '@react-spring/web';
import { experience } from '../content/experience';
import ExperienceCard from './ExperienceCard';

const useItemParallax = () => {
  const ref = useRef(null);
  const topRef = useRef(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    const update = () => {
      if (ref.current) topRef.current = ref.current.getBoundingClientRect().top + window.scrollY;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const raw = scrollY.to(y => {
    const top = topRef.current;
    return top ? y - top + window.innerHeight * 0.5 : 0;
  });
  const { offset } = useSpring({ offset: raw, config: { mass: 1, tension: 280, friction: 60 } });
  const p = (speed) => offset.to(v => Math.max(-350, Math.min(350, -v * speed)));

  return { ref, p };
};

function ZigzagItem({ item, isLeft, showArrow, i }) {
  const { ref, p } = useItemParallax();

  return (
    <animated.div
      ref={ref}
      className={`experience-zigzag-item ${isLeft ? 'left' : 'right'}`}
      style={{ transform: p(0.14 + i * 0.05).to(v => `translateY(${v}px)`) }}
    >
      <ExperienceCard
        title={item.role}
        subtitle={item.company}
        companyName={item.company}
        year={item.duration}
        color={item.color}
        highlights={item.highlights || []}
        bgParallax={p(0.20 + i * 0.06).to(v => `translateY(${v}px)`)}
        contentParallax={p(0.10 + i * 0.04).to(v => `translateY(${v}px)`)}
      />
      {showArrow && (
        <animated.svg
          className={`exp-arrow ${isLeft ? 'arrow-left' : 'arrow-right'}`}
          viewBox="0 0 320 250"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMin meet"
          style={{ width: 'min(440px, 48vw)', height: '200px', maxWidth: '100%', display: 'block', transform: p(0.08 + i * 0.025).to(v => `translateY(${v}px)`) }}
        >
          <defs>
            <linearGradient id={`ag-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <filter id={`af-${i}`}>
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#a78bfa" floodOpacity="0.6" />
            </filter>
          </defs>
          <path
            d={isLeft ? 'M 30,10 C 30,80 220,195 315,195' : 'M 290,10 C 290,80 100,195 5,195'}
            stroke={`url(#ag-${i})`}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#af-${i})`}
          />
          <path
            d={isLeft ? 'M 288,172 L 315,195 L 288,218 Z' : 'M 32,172 L 5,195 L 32,218 Z'}
            fill={`url(#ag-${i})`}
            stroke="none"
            filter={`url(#af-${i})`}
          />
          <circle cx={isLeft ? 30 : 290} cy="10" r="6" fill="#c084fc" opacity="0.9" />
          <circle cx={isLeft ? 305 : 15} cy="195" r="6" fill="#6366f1" opacity="0.8" />
        </animated.svg>
      )}
    </animated.div>
  );
}

const Experience = () => {
  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Professional <span>Experience</span></h2>
          <p className="section-subtitle">Places I've worked and the impact I've made.</p>
        </div>

        <div className="experience-zigzag">
          {experience.map((item, i) => (
            <ZigzagItem
              key={item.id}
              item={item}
              isLeft={i % 2 === 0}
              showArrow={i < experience.length - 1}
              i={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
