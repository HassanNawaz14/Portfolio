import { useRef } from 'react';
import { motion } from 'framer-motion';
import { experience } from '../content/experience';
import ExperienceCard from './ExperienceCard';

const Experience = () => {
  const sectionRef = useRef(null);

  return (
    <section id="experience" className="experience-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Professional <span>Experience</span></h2>
          <p className="section-subtitle">Places I've worked and the impact I've made.</p>
        </div>

        <div className="experience-zigzag">
          {experience.map((item, i) => {
            const isLeft = i % 2 === 0;
            const showArrow = i < experience.length - 1;
            return (
              <motion.div
                key={item.id}
                className={`experience-zigzag-item ${isLeft ? 'left' : 'right'}`}
                initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <ExperienceCard
                  title={item.role}
                  subtitle={item.company}
                  companyName={item.company}
                  year={item.duration}
                  color={item.color}
                  highlights={item.highlights || []}
                />
                {showArrow && (
                  <svg
                    className={`exp-arrow ${isLeft ? 'arrow-left' : 'arrow-right'}`}
                    viewBox="0 0 320 250"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMin meet"
                    style={{ width: 'min(440px, 48vw)', height: '200px', maxWidth: '100%', display: 'block' }}
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
                  </svg>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
