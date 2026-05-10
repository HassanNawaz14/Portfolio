import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const projectsData = [
  {
    id: 'f1',
    title: 'Travel Buddy+',
    category: 'Travel Tech',
    icon: 'fa-solid fa-plane-departure',
    desc: 'A next-generation Travel Planner with AI-powered recommendations, planning tools, and real-time updates.',
    tags: ['React', 'Node.js', 'AI'],
    link: 'https://github.com/HassanNawaz14/Travel-Buddy-',
    featured: true
  },
  {
    id: 'f2',
    title: 'CADS-Bridge',
    category: 'Business Tech',
    icon: 'fa-solid fa-building-columns',
    desc: 'A Bridge between Chartered Accountants and Data Science teams working at a firm in isolation.',
    tags: ['React', 'Node.js', 'Business Domain'],
    link: 'https://github.com/HassanNawaz14/CADS-Bridge',
    featured: true
  },
  {
    id: 1,
    title: 'CPU-Storm',
    category: 'Opeating Systems',
    icon: 'fas fa-theater-masks',
    desc: 'A simulation of DoS attack on a CPU scheduler to analyze performance under stress.',
    tags: ['OS', 'C', 'Simulation'],
    link: 'https://github.com/HassanNawaz14/CPU-Storm',
    featured: false
  },
  {
    id: 1,
    title: 'Sentiment Predictor',
    category: 'Data Science',
    icon: 'fa-solid fa-brain',
    desc: 'Complete sentiment analysis pipeline with ML models trained on textual reviews.',
    tags: ['ML', 'Python', 'Data Science'],
    link: 'https://github.com/HassanNawaz14/Sentiment-Predictor',
    featured: false
  },
  {
    id: 2,
    title: 'RecommendationX',
    category: 'Web Dev',
    icon: 'fa-solid fa-film',
    desc: 'Smart movie recommender system with personalized suggestions.',
    tags: ['JS', 'Node.js', 'CSV'],
    link: 'https://github.com/HassanNawaz14/RecommendationX',
    featured: false
  },
  {
    id: 3,
    title: 'GearPro',
    category: 'Web Dev',
    icon: 'fa-solid fa-car',
    desc: 'Car specification database with detailed trim information.',
    tags: ['APIs', 'Frontend', 'JS'],
    link: 'https://github.com/HassanNawaz14/GearPro',
    featured: false
  },
  {
    id: 4,
    title: 'Brick Breaker',
    category: 'Game Dev',
    icon: 'fa-solid fa-baseball-ball',
    desc: '8086 Assembly Language game using video memory and interrupts.',
    tags: ['Assembly', 'x86', 'Game Dev'],
    link: 'https://github.com/HassanNawaz14/Brick-Breaker',
    featured: false
  },
  {
    id: 5,
    title: 'Lib Management Sys',
    category: 'C++',
    icon: 'fa-solid fa-book-open',
    desc: 'High-performance system using complex data structures.',
    tags: ['C++', 'DSA', 'Efficiency'],
    link: 'https://github.com/HassanNawaz14/Library-Management-System',
    featured: false
  },
  {
    id: 6,
    title: 'Space Shooter',
    category: 'Game Dev',
    icon: 'fa-solid fa-shuttle-space',
    desc: 'Classic Space Shooter demo in vanilla Assembly x86.',
    tags: ['Assembly', 'x86', 'Game Dev'],
    link: 'https://github.com/HassanNawaz14/Space-Shooter-Assembly-Language',
    featured: false
  },
  {
    id: 7,
    title: 'LudoWeb',
    category: 'Game Dev',
    icon: 'fas fa-dice',
    desc: 'Web-based Ludo game with 4-player support and responsive design.',
    tags: ['Logic', 'JS', 'UI/UX'],
    link: 'https://github.com/HassanNawaz14/LudoWeb',
    featured: false
  },
  {
    id: 8,
    title: 'Relive App',
    category: 'C++',
    icon: 'fa-solid fa-users',
    desc: 'C++ social network simulation with OOP principles.',
    tags: ['C++', 'OOP', 'CLI'],
    link: 'https://github.com/HassanNawaz14/ReLive-CLI-App',
    featured: false
  },
  {
    id: 9,
    title: 'Solar App',
    category: 'C++',
    icon: 'fa-solid fa-solar-panel',
    desc: 'Solar plan recommendation system based on budget and location.',
    tags: ['C++', 'Physics', 'CLI'],
    link: 'https://github.com/HassanNawaz14/Solar-Project',
    featured: false
  }
];

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

const FeaturedCard = ({ project, index, onClick }) => {
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
      className="featured-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <div className="featured-card-content">
        <div className="featured-icon">
          <i className={project.icon}></i>
        </div>
        <div className="featured-info">
          <span className="featured-tag">{project.category}</span>
          <h4>{project.title}</h4>
          <p>{project.desc}</p>
          <div className="featured-footer">
            <div className="featured-tags">
              {project.tags.slice(0, 2).map(tag => <span key={tag}>{tag}</span>)}
            </div>
            <div className="view-link">
              View Project <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="featured-glow"></div>
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
