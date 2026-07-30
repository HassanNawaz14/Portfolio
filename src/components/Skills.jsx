import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animated, useScroll, useSpring } from '@react-spring/web';
import { skillCategories as categories } from '../content/skills';

const Skills = () => {
  const sectionRef = useRef(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [activeCategory, setActiveCategory] = useState('programming');
  const activeData = categories.find((cat) => cat.id === activeCategory);

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

        <div className="skills-interactive-container">
          <aside className="skill-category-nav">
            {categories.map((category, ci) => (
              <animated.button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                style={{ transform: parallaxSpeed(0.14 + ci * 0.01).to(v => `translateY(${v}px)`) }}
              >
                <div className="cat-icon">
                  <i className={`fas ${category.icon}`} />
                </div>
                <div className="cat-label-group">
                  <span className="cat-name">{category.label}</span>
                  <span className="cat-count">{category.skills.length} Modules</span>
                </div>
                {activeCategory === category.id && (
                  <motion.div layoutId="activeCategory" className="active-pill" />
                )}
              </animated.button>
            ))}
          </aside>

          <div className="skills-display-area">
            <animated.div className="display-area-glow" style={{ transform: parallaxSpeed(0.12).to(v => `translateY(${v}px)`) }} />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="skill-category-content"
              >
                <div className="cat-meta">
                  <div className="cat-meta-header">
                    <animated.i style={{ transform: parallaxSpeed(0.10).to(v => `translateY(${v}px)`), display: 'inline-block' }} className={`fas ${activeData.icon} meta-icon`} />
                    <animated.div style={{ transform: parallaxSpeed(0.09).to(v => `translateY(${v}px)`) }}>
                      <div className="meta-text">
                        <h3>{activeData.label}</h3>
                        <div className="status-badge">
                          <span className="status-dot-pulse" />
                          System Active
                        </div>
                      </div>
                    </animated.div>
                  </div>
                  <animated.p style={{ transform: parallaxSpeed(0.09).to(v => `translateY(${v}px)`) }}>{activeData.description}</animated.p>
                </div>

                <div className="skills-grid-interactive">
                  {activeData.skills.map((skill, index) => (
                    <SkillItem
                      key={skill.title}
                      title={skill.title}
                      percent={skill.percent}
                      index={index}
                      parallaxSpeed={parallaxSpeed}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const SkillItem = ({ title, percent, index, parallaxSpeed }) => {
  const circumference = 2 * Math.PI * 32;
  const speed = 0.03 + index * 0.004;

  return (
    <animated.div
      className="interactive-skill-card"
      style={{ transform: parallaxSpeed(speed).to(v => `translateY(${v}px)`) }}
    >
      <div className="skill-card-inner">
        <div className="skill-visual-aside">
          <div className="skill-ring-wrapper">
            <svg width="70" height="70" viewBox="0 0 80 80">
              <circle className="skill-ring-bg" cx="40" cy="40" r="32" />
              <motion.circle
                className="skill-ring-fill"
                cx="40" cy="40" r="32"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (percent / 100) * circumference }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <span className="skill-percentage">{percent}%</span>
          </div>
        </div>

        <div className="skill-content-main">
          <div className="skill-info-row">
            <h4>{title}</h4>
            <span className="proficiency-level">
              {percent >= 90 ? 'Expert' : percent >= 80 ? 'Advanced' : 'Proficient'}
            </span>
          </div>
          <div className="skill-bar-wrapper">
            <div className="skill-bar-track">
              <motion.div
                className="skill-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
              />
            </div>
            <div className="skill-bar-ghost" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
      <div className="card-scan-line" />
    </animated.div>
  );
};

export default Skills;
