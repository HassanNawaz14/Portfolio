import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects as projectsData } from '../content/projects';

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);
  
  const featuredProjects = projectsData.filter(p => p.featured);
  const regularProjects = projectsData.filter(p => !p.featured);

  return (
    <div id="projects-wrapper">
      <section id="featured-projects" className="projects-featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured <span>Work</span></h2>
            <p className="section-subtitle">A collection of my most impactful and innovative projects.</p>
          </div>

          <div className="featured-grid">
            {featuredProjects.map((project, index) => (
              <FeaturedCard 
                key={project.id} 
                project={project} 
                index={index}
                onClick={() => setActiveProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="projects-regular-section">
        <div className="container">
          <div className="section-header">
            <h3 className="sub-section-title">Other Notable <span>Creations</span></h3>
          </div>
        </div>

        <div className="regular-marquee-viewport">
          <div className="regular-marquee-track">
            {/* First set of projects */}
            {regularProjects.map((project, index) => (
              <ProjectCard 
                key={`${project.id}-1`} 
                project={project} 
                index={index}
                onClick={() => setActiveProject(project)}
              />
            ))}
            {/* Duplicated set for seamless loop */}
            {regularProjects.map((project, index) => (
              <ProjectCard 
                key={`${project.id}-2`} 
                project={project} 
                index={index}
                onClick={() => setActiveProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeProject && (
          <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const accentColors = ['#37d8ff', '#8a5cff', '#f59e0b'];

const FeaturedCard = ({ project, index, onClick }) => {
  const accent = accentColors[index % accentColors.length];
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <motion.div 
      className="featured-strip"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      whileHover={{ y: -6 }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <div className="strip-accent" style={{ background: accent }}></div>
      <div className="strip-glow" style={{ '--glow-color': accent }}></div>
      <div className="strip-content">
        <div className="strip-icon-wrap" style={{ borderColor: `${accent}33`, background: `${accent}0d` }}>
          <i className={project.icon} style={{ color: accent }}></i>
        </div>
        <div className="strip-body">
          <span className="strip-cat" style={{ color: accent }}>{project.category}</span>
          <h3 className="strip-title">{project.title}</h3>
          <p className="strip-desc">{project.desc}</p>
          <div className="strip-bottom">
            <div className="strip-tags">
              {project.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{ borderColor: `${accent}1a`, color: accent }}>{tag}</span>
              ))}
            </div>
            <span className="strip-link" style={{ color: accent }}>
              View Project <i className="fa-solid fa-arrow-right"></i>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectCard = ({ project, index, onClick }) => {
  return (
    <motion.div 
      className="regular-card-container"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <motion.div 
        className="regular-card-flipper"
        whileHover={{ rotateY: 180 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        {/* Front Face */}
        <div className="regular-card-front">
          <div className="regular-icon">
            <i className={project.icon}></i>
          </div>
          <div className="regular-info">
            <h4>{project.title}</h4>
            <span className="regular-cat">{project.category}</span>
          </div>
        </div>

        {/* Back Face */}
        <div className="regular-card-back">
          <p>{project.desc}</p>
          <div className="back-actions">
            <a 
              href={project.link} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-mini" 
              onClick={(e) => e.stopPropagation()}
            >
              Code <i className="fa-brands fa-github"></i>
            </a>
            <button className="btn-mini-secondary" onClick={onClick}>
              Details <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }) => {
  return (
    <motion.div 
      className="project-detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="project-detail-modal"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="modal-content">
          <div className="modal-icon"><i className={project.icon}></i></div>
          <h3>{project.title}</h3>
          <span className="modal-category">{project.category}</span>
          <p>{project.desc}</p>
          <div className="modal-tags">
            {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
          <a href={project.link} target="_blank" rel="noreferrer" className="btn modal-btn">
            View Source Code <i className="fa-brands fa-github"></i>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Projects;
