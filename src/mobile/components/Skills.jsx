import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillCategories as categories } from '../../content/skills';

function level(percent) {
  if (percent >= 90) return 'Expert';
  if (percent >= 80) return 'Advanced';
  return 'Proficient';
}

function Skills() {
  const [active, setActive] = useState('programming');
  const data = categories.find((c) => c.id === active);

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Technical <span>Arsenal</span></h2>
          <p className="section-subtitle">A comprehensive breakdown of my development and data science capabilities.</p>
        </div>

        <div className="mskill-grid">
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
        </div>

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
                <div key={s.title} className="mskill-card">
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
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Skills;