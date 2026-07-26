import { useState, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { education } from '../content/education';

function TiltCard({ children, className }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: -(y - 0.5) * 14, y: (x - 0.5) * 14 });
    setGlowPos({ x: x * 100, y: y * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className + ' tilt-card'}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
    >
      <div
        className="tilt-glow"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(138, 92, 255, 0.12), transparent 60%)`
        }}
      />
      {children}
    </motion.div>
  );
}

const sparkleVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: [0, 1, 0],
    x: Math.cos(i * 1.256) * 40,
    y: Math.sin(i * 1.256) * 40,
    transition: { duration: 0.6, delay: i * 0.04, ease: 'easeOut' }
  })
};

const Education = () => {
  const sectionRef = useRef(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [sparkleKey, setSparkleKey] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center']
  });

  const railFill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const toggleExpand = (i) => {
    setExpandedIndex(expandedIndex === i ? null : i);
    setSparkleKey((k) => k + 1);
  };

  return (
    <section id="education" className="education-section-v2" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Academic <span>Journey</span></h2>
          <p className="section-subtitle">My educational background and academic milestones.</p>
        </div>

        <div className="journey-wrapper">
          <div className="journey-rail">
            <motion.div className="journey-rail-fill" style={{ height: railFill }} />
          </div>

          {education.map((item, i) => {
            const isExpanded = expandedIndex === i;
            const isEven = i % 2 === 0;

            return (
              <motion.div
                key={i}
                className={`journey-item ${isEven ? 'journey-left' : 'journey-right'}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="journey-node-wrap">
                  <motion.button
                    className={`journey-node ${isExpanded ? 'journey-node-active' : ''}`}
                    onClick={() => toggleExpand(i)}
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.85 }}
                    aria-label={`Toggle details for ${item.degree}`}
                  >
                    <span className="journey-node-dot" style={{ borderColor: item.color }} />
                    <span className="journey-node-ring" style={{ borderColor: item.color }} />
                    <span className="journey-node-pulse" style={{ background: item.color }} />
                  </motion.button>
                </div>

                <TiltCard className="journey-card">
                  <div className="journey-card-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${item.color}12, transparent 70%)` }} />
                  <div className="journey-card-header">
                    <div className="journey-icon" style={{ borderColor: `${item.color}30`, background: `${item.color}10` }}>
                      <i className={item.icon} style={{ color: item.color }} />
                    </div>
                    <div className="journey-meta">
                      <span className="journey-date" style={{ color: item.color }}>{item.date}</span>
                      <h3 className="journey-degree">{item.degree}</h3>
                      <span className="journey-inst">{item.institution}</span>
                    </div>
                  </div>

                  <div className="journey-card-body">
                    <p>{item.desc}</p>
                  </div>

                  <div className="journey-achievements">
                    {item.achievements.map((ach, j) => (
                      <span key={j} className="journey-badge" style={{ background: `${ach.color}15`, borderColor: `${ach.color}30`, color: ach.color }}>
                        <i className={ach.icon} />
                        {ach.label}
                      </span>
                    ))}
                  </div>

                  <div className="journey-progress">
                    <div className="journey-progress-label">
                      <span>{item.yearRange}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="journey-progress-track">
                      <motion.div
                        className="journey-progress-fill"
                        style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color === '#8a5cff' ? '#37d8ff' : item.color})` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  <motion.div
                    className="journey-expandable"
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <div className="journey-expandable-inner">
                      <div className="journey-expandable-divider" style={{ background: `linear-gradient(90deg, transparent, ${item.color}40, transparent)` }} />
                      <p className="journey-expandable-text">
                        My time at {item.institution} was a defining chapter that shaped my discipline, curiosity, and drive for innovation.
                      </p>
                      <div className="journey-expandable-stats">
                        <div className="journey-stat">
                          <span className="journey-stat-value" style={{ color: item.color }}>{item.yearRange.split(' - ')[0]}</span>
                          <span className="journey-stat-label">Start Year</span>
                        </div>
                        <div className="journey-stat">
                          <span className="journey-stat-value" style={{ color: item.color }}>{item.yearRange.split(' - ')[1]}</span>
                          <span className="journey-stat-label">End Year</span>
                        </div>
                        <div className="journey-stat">
                          <span className="journey-stat-value" style={{ color: item.color }}>{item.progress}%</span>
                          <span className="journey-stat-label">Complete</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {isExpanded && (
                    <div className="journey-sparkles" key={sparkleKey}>
                      {[...Array(8)].map((_, s) => (
                        <motion.span
                          key={s}
                          className="journey-sparkle"
                          custom={s}
                          variants={sparkleVariants}
                          initial="hidden"
                          animate="visible"
                          style={{ background: item.color }}
                        />
                      ))}
                    </div>
                  )}

                  <motion.button
                    className={`journey-expand-btn ${isExpanded ? 'journey-expand-btn-active' : ''}`}
                    onClick={() => toggleExpand(i)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                    style={{ borderColor: `${item.color}50`, background: `${item.color}15` }}
                  >
                    <motion.i
                      className="fa-solid fa-plus"
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ color: item.color }}
                    />
                  </motion.button>

                  <div className="journey-card-corner" style={{ borderColor: item.color }} />
                </TiltCard>
              </motion.div>
            );
          })}

          <motion.div
            className="journey-cap"
            style={{ top: railFill }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <i className="fa-solid fa-graduation-cap" />
          </motion.div>

          <div className="journey-footer-note">
            <i className="fa-solid fa-arrow-up" />
            <span>Click nodes or the + buttons to expand details</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
