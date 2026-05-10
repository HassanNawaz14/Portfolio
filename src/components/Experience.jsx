import { motion } from 'framer-motion';

const educationData = [
  {
    date: '2024 - Present',
    degree: 'BS Data Science',
    institution: 'FAST NUCES, Lahore',
    icon: 'fa-solid fa-microchip',
    desc: 'Currently pursuing BS Data Science at FAST NUCES, one of Pakistan’s most prestigious institutions in Computer Science and Technology, known for its highest academic standards and excellence.'
  },
  {
    date: '2022 - 2024',
    degree: 'Intermediate in CS',
    institution: 'GCU, Lahore',
    icon: 'fa-solid fa-code',
    desc: 'Completed Intermediate in Computer Science (ICS) from GCU, Lahore — an institute with unmatched legacy and the highest merit in its field, nurturing critical thinking and academic rigor.'
  },
  {
    date: '2020 - 2022',
    degree: 'Matriculation',
    institution: 'UGI, Lahore',
    icon: 'fa-solid fa-book',
    desc: 'Achieved my Matriculation from UGI, a respected institution known for discipline, academic strength, and shaping strong foundations for future success.'
  }
];

const Experience = () => {
  return (
    <section id="experience" className="education-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Academic <span>Journey</span></h2>
          <p className="section-subtitle">My educational background and academic milestones.</p>
        </div>
        
        <div className="futuristic-timeline">
          <div className="timeline-rail" />
          
          {educationData.map((item, i) => (
            <motion.div 
              key={i} 
              className="timeline-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            >
              <div className="timeline-node">
                <div className="node-inner" />
                <div className="node-glow" />
              </div>
              
              <div className="timeline-content-card">
                <div className="card-header">
                  <div className="edu-icon">
                    <i className={item.icon}></i>
                  </div>
                  <div className="edu-meta">
                    <span className="edu-date">{item.date}</span>
                    <h3 className="edu-degree">{item.degree}</h3>
                    <span className="edu-inst">{item.institution}</span>
                  </div>
                </div>
                <div className="card-body">
                  <p>{item.desc}</p>
                </div>
                <div className="card-footer-glow" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
