import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  {
    id: 'programming',
    label: 'Programming',
    icon: 'fa-code',
    description: 'Foundational languages and algorithm-driven problem solving.',
    skills: [
      { title: 'Python', percent: 90 },
      { title: 'C++', percent: 95 },
      { title: 'JavaScript', percent: 80 },
      { title: 'C#', percent: 75 }
    ]
  },
  {
    id: 'web-dev',
    label: 'Web Development',
    icon: 'fa-laptop-code',
    description: 'Modern front-end and full-stack experience with React, Node, and responsive UI.',
    skills: [
      { title: 'React', percent: 85 },
      { title: 'Node.js', percent: 80 },
      { title: 'HTML/CSS', percent: 95 },
      { title: 'MERN Stack', percent: 80 }
    ]
  },
  {
    id: 'data-science',
    label: 'Data Science',
    icon: 'fa-chart-bar',
    description: 'Analytics, machine learning, and data visualization for real-world insights.',
    skills: [
      { title: 'Machine Learning', percent: 85 },
      { title: 'Pandas & NumPy', percent: 90 },
      { title: 'TensorFlow', percent: 75 },
      { title: 'Data Visualization', percent: 80 }
    ]
  },
  {
    id: 'tools',
    label: 'Tools & Others',
    icon: 'fa-tools',
    description: 'Build, deploy, and collaborate with professional tooling and game development.',
    skills: [
      { title: 'Git & GitHub', percent: 90 },
      { title: 'Unity', percent: 70 },
      { title: 'MS Office', percent: 95 },
      { title: 'Game Development', percent: 85 }
    ]
  }
];

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('programming');
  const activeData = categories.find((cat) => cat.id === activeCategory);

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Technical <span>Arsenal</span></h2>
          <p className="section-subtitle">A comprehensive breakdown of my development and data science capabilities.</p>
        </div>

        <div className="skills-interactive-container">
          <aside className="skill-category-nav">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
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
              </button>
            ))}
          </aside>

          <div className="skills-display-area">
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
                    <div className="meta-text">
                      <h3>{activeData.label}</h3>
                      <div className="status-badge">
                        <span className="status-dot-pulse" />
                        System Active
                      </div>
                    </div>
                  </div>
                  <p>{activeData.description}</p>
                </div>
                
                <div className="skills-grid-interactive">
                  {activeData.skills.map((skill, index) => (
                    <SkillItem 
                      key={skill.title} 
                      title={skill.title} 
                      percent={skill.percent} 
                      index={index}
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

const SkillItem = ({ title, percent, index }) => {
  const circumference = 2 * Math.PI * 32;

  return (
    <motion.div 
      className="interactive-skill-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, borderColor: 'rgba(55, 216, 255, 0.4)' }}
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
    </motion.div>
  );
};

export default Skills;
