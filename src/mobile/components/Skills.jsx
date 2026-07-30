import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animated, useScroll, useSpring } from '@react-spring/web';
import { skillCategories as categories } from '../../content/skills';

function level(percent) {
  if (percent >= 90) return 'Expert';
  if (percent >= 80) return 'Advanced';
  return 'Proficient';
}

function Skills() {
  const sectionRef = useRef(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [active, setActive] = useState('programming');
  const data = categories.find((c) => c.id === active);

  useEffect(() => {
    const update = () => {
      if (sectionRef.current) {
        setSectionTop(sectionRef.current.offsetTop);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const { scrollY } = useScroll();

  const raw = useMemo(() => scrollY.to(y => y - sectionTop + window.innerHeight * 0.5), [scrollY, sectionTop]);
  const { offset } = useSpring({ offset: raw, config: { mass: 1, tension: 280, friction: 60 } });

  const parallaxSpeed = (speed) => offset.to(v => Math.max(-120, Math.min(120, -v * speed)));

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      <div className="container">
        <animated.div className="section-header" style={{ transform: parallaxSpeed(0.07).to(v => `translateY(${v}px)`) }}>
          <h2 className="section-title">Technical <span>Arsenal</span></h2>
          <p className="section-subtitle">A comprehensive breakdown of my development and data science capabilities.</p>
        </animated.div>

        <animated.div style={{ transform: parallaxSpeed(0.14).to(v => `translateY(${v}px)`) }} className="mskill-grid">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`mskill-card-btn ${active === cat.id ? 'active' : ''}`}
              onClick={() => setActive(cat.id)}
            >
              <i className={`fas ${cat.icon}`} />
              <span>{cat.label}</span>
              {cat.skills.length}
              {active === cat.id && (
                <motion.div layoutId="mskillActive" className="mskill-card-glow" />
              )}
            </button>
          ))}
        </animated.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="mskill-list">
              {data.skills.map((s, i) => (
                <animated.div key={s.title} className="mskill-card" style={{ transform: parallaxSpeed(0.03 + i * 0.003).to(v => `translateY(${v}px)`) }}>
                  <div className="mskill-card-top">
                    <span className="mskill-name">{s.title}</span>
                    <span className="mskill-badge" data-level={level(s.percent)}>
                      {s.percent}%
                    </span>
                  </div>
                  <div className="mskill-bar-track">
                    <motion.div
                      className="mskill-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${s.percent}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: i * 0.08 }}
                    />
                  </div>
                </animated.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Skills;
