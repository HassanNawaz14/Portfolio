import { useState, useRef } from 'react';
import { education } from '../../content/education';

const Education = () => {
  const sectionRef = useRef(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (i) => {
    setExpandedIndex(expandedIndex === i ? null : i);
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
            <div className="journey-rail-fill" />
          </div>

          {education.map((item, i) => {
            const isExpanded = expandedIndex === i;
            const isEven = i % 2 === 0;

            return (
              <div key={i} className={`journey-item ${isEven ? 'journey-left' : 'journey-right'}`}>
                <div className="journey-node-wrap">
                  <button
                    className={`journey-node ${isExpanded ? 'journey-node-active' : ''}`}
                    onClick={() => toggleExpand(i)}
                    aria-label={`Toggle details for ${item.degree}`}
                  >
                    <span className="journey-node-dot" style={{ borderColor: item.color }} />
                    <span className="journey-node-ring" style={{ borderColor: item.color }} />
                    <span className="journey-node-pulse" style={{ background: item.color }} />
                  </button>
                </div>

                <div className="journey-card">
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
                      <div
                        className="journey-progress-fill"
                        style={{ width: `${item.progress}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color === '#8a5cff' ? '#37d8ff' : item.color})` }}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="journey-expandable">
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
                    </div>
                  )}

                  <button
                    className={`journey-expand-btn ${isExpanded ? 'journey-expand-btn-active' : ''}`}
                    onClick={() => toggleExpand(i)}
                    aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                    style={{ borderColor: `${item.color}50`, background: `${item.color}15` }}
                  >
                    <i className={`fa-solid fa-plus ${isExpanded ? 'journey-icon-rotated' : ''}`} style={{ color: item.color }} />
                  </button>

                  <div className="journey-card-corner" style={{ borderColor: item.color }} />
                </div>
              </div>
            );
          })}

          <div className="journey-cap">
            <i className="fa-solid fa-graduation-cap" />
          </div>

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
