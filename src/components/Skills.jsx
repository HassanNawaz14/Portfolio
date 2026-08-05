import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillCategories as categories } from '../content/skills';

const EASE = [0.22, 1, 0.36, 1];

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('programming');
  const activeData = categories.find((cat) => cat.id === activeCategory);

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h2 className="section-title">Technical <span>Arsenal</span></h2>
          <p className="section-subtitle">A comprehensive breakdown of my development and data science capabilities.</p>
        </motion.div>

        <div className="skills-interactive-container">
          <aside className="skill-category-nav">
            {categories.map((category, ci) => (
              <motion.button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: ci * 0.08, ease: EASE }}
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
              </motion.button>
            ))}
          </aside>

          <motion.div
            className="skills-display-area"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          >
            <div className="display-area-glow" />
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
                    <i className={`fas ${activeData.icon} meta-icon`} />
                    <div>
                      <div className="meta-text">
                        <h3>{activeData.label}</h3>
                        <div className="status-badge">
                          <span className="status-dot-pulse" />
                          System Active
                        </div>
                      </div>
                    </div>
                  </div>
                  <p>{activeData.description}</p>
                </div>

                <div className="skills-grid-interactive">
                  {activeData.skills.map((skill) => (
                    <SkillItem
                      key={skill.title}
                      title={skill.title}
                      percent={skill.percent}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const SkillItem = ({ title, percent }) => {
  const circumference = 2 * Math.PI * 32;

  return (
    <div className="interactive-skill-card">
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
    </div>
  );
};

export default Skills;
