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
                    style={{ width: 'min(280px, 32vw)', height: '140px', maxWidth: '100%', display: 'block' }}
                  >
                    <defs>
                      <linearGradient id={`ag-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                      <filter id={`af-${i}`}>
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <path
                      d={isLeft ? 'M 30,0 L 30,193 A 15 15 0 0 1 45,208 L 310,208' : 'M 290,0 L 290,193 A 15 15 0 0 1 275,208 L 10,208'}
                      stroke={`url(#ag-${i})`}
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={`url(#af-${i})`}
                    />
                    <path
                      d={isLeft ? 'M 297,195 L 310,208 L 297,221' : 'M 23,195 L 10,208 L 23,221'}
                      stroke={`url(#ag-${i})`}
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={`url(#af-${i})`}
                    />
                    <circle cx={isLeft ? 30 : 290} cy="0" r="4" fill="#c084fc" opacity="0.8" />
                    <circle cx={isLeft ? 300 : 20} cy="208" r="3" fill="#6366f1" opacity="0.5" />
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
