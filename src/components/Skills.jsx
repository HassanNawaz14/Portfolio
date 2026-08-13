import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillCategories as categories } from '../content/skills';

const EASE = [0.22, 1, 0.36, 1];

const skillMeta = {
  Python: { icon: 'fab fa-python', color: '#4d9fff' },
  'C++': { icon: 'fas fa-plus', color: '#37d8ff' },
  JavaScript: { icon: 'fab fa-js', color: '#ffd166' },
  'ASM x86': { icon: 'fas fa-microchip', color: '#59c2ff' },
  React: { icon: 'fab fa-react', color: '#37d8ff' },
  Flask: { icon: 'fas fa-flask', color: '#4ade80' },
  'HTML/CSS': { icon: 'fas fa-code', color: '#ff8f6b' },
  'MERN Stack': { icon: 'fas fa-layer-group', color: '#8a5cff' },
  'Machine Learning': { icon: 'fas fa-brain', color: '#f056c4' },
  'Deep Learning': { icon: 'fas fa-circle-nodes', color: '#b388ff' },
  'Natural Language Processing': { icon: 'fas fa-language', color: '#2dd4bf' },
  'Data Analysis': { icon: 'fas fa-magnifying-glass-chart', color: '#ffb84d' },
  'Git & GitHub': { icon: 'fab fa-git-alt', color: '#ff6b6b' },
  Unity: { icon: 'fas fa-gamepad', color: '#c0c0d8' },
  'MS Office': { icon: 'fas fa-file-word', color: '#4d9fff' },
  Ubuntu: { icon: 'fab fa-ubuntu', color: '#e95420' },
};

const skillMetaFallback = { icon: 'fas fa-code', color: '#8a5cff' };

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
  const meta = skillMeta[title] || skillMetaFallback;
  const { icon, color } = meta;

  return (
    <div className="interactive-skill-card">
      <div className="skill-card-inner">
        <div
          className="skill-icon-badge"
          style={{
            color,
            background: `${color}14`,
            borderColor: `${color}55`,
            boxShadow: `0 0 18px ${color}30, inset 0 0 12px ${color}14`,
          }}
        >
          <i className={icon} />
        </div>

        <div className="skill-content-main">
          <div className="skill-info-row">
            <h4>{title}</h4>
            <span
              className="skill-percent-badge"
              style={{ color, background: `${color}14`, border: `1px solid ${color}44` }}
            >
              {percent}%
            </span>
          </div>
          <div className="skill-bar-wrapper">
            <div className="skill-bar-track">
              <motion.div
                className="skill-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                style={{ background: `linear-gradient(90deg, ${color}, ${color}77)`, boxShadow: `0 0 15px ${color}55` }}
              />
            </div>
            <div className="skill-bar-ghost" style={{ width: `${percent}%`, background: color }} />
          </div>
        </div>
      </div>
      <div className="card-scan-line" />
    </div>
  );
};

export default Skills;
