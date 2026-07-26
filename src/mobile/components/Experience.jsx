import { useRef } from 'react';
import { motion } from 'framer-motion';
import { experience } from '../../content/experience';
import ExperienceCard from '../../components/ExperienceCard';

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
            return (
              <motion.div
                key={item.id}
                className={`experience-zigzag-item ${isLeft ? 'left' : 'right'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              >
                <ExperienceCard
                  title={item.role}
                  subtitle={item.company}
                  companyName={item.company}
                  year={item.duration}
                  color={item.color}
                  highlights={item.highlights || []}
                />

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
