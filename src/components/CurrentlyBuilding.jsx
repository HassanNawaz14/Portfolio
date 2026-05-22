import { motion } from 'framer-motion';

const CurrentlyBuilding = () => {
  const steps = [
    { num: '01', title: 'Data Synthesis', text: 'Analyzing high-dimensional datasets to identify patterns and anomalies.' },
    { num: '02', title: 'Model Architecture', text: 'Designing neural networks and algorithmic frameworks for predictive tasks.' },
    { num: '03', title: 'Validation & Scaling', text: 'Rigorous testing against real-world metrics to ensure precision and reliability.' }
  ];

  const phases = [
    { label: 'Data Pre-processing', status: 'done' },
    { label: 'Model Engineering', status: 'active' },
    { label: 'Cloud Integration', status: 'todo' },
    { label: 'Performance Tuning', status: 'todo' }
  ];

  return (
    <section id="building" className="currently-building-section">
      <div className="cb-container">
        <div className="cb-header">
          <span className="cb-label">Neural Laboratory</span>
          <h2 className="cb-title">Current <span>Research</span> Projects</h2>
          <p className="cb-subtitle">
            Exploring the intersection of Data Science and Web Architecture to solve 
            complex analytical challenges.
          </p>
          <div className="cb-status-badge">
            <span className="cb-status-dot" /> High-Intensity Research Active
          </div>
        </div>

        <div className="cb-main-grid">
          <motion.div 
            className="cb-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="cb-card-label">
              <span className="cb-card-dot" /> Primary Objective
            </div>
            <h3 className="cb-card-title">Autonomous Data Insights Engine</h3>
            <p className="cb-card-desc">
              Developing a proprietary framework that automates the extraction of actionable 
              intelligence from raw, unstructured data sources using advanced ML heuristics.
            </p>
            
            <div className="cb-terminal">
              <div className="cb-terminal-header">
                <div className="cb-dot red" />
                <div className="cb-dot yellow" />
                <div className="cb-dot green" />
              </div>
              <div className="cb-terminal-line">
                <span className="cb-terminal-prompt">root@lab:~$</span>
                <span className="cb-terminal-input">npm run initiate-synthesis</span>
              </div>
              <div className="cb-terminal-line">
                <span className="cb-terminal-dim">[INFO]</span>
                <span className="cb-terminal-output"> Neural weights loaded successfully.</span>
              </div>
              <div className="cb-terminal-line">
                <span className="cb-terminal-dim">[WAIT]</span>
                <span className="cb-terminal-warn"> Analyzing data cluster integrity... 82%</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="cb-flow"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h4 className="cb-flow-title">The Scientific Method</h4>
            <div className="cb-steps">
              {steps.map((step, i) => (
                <div key={i} className="cb-flow-step">
                  <div className="cb-step-num">{step.num}</div>
                  <div className="cb-step-content">
                    <b>{step.title}</b>
                    <span>{step.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="cb-bottom-grid">
          <div className="cb-small-card">
            <h4 className="cb-small-card-title">Research Stack</h4>
            <div className="cb-tags">
              <span className="cb-tag cyan">PyTorch</span>
              <span className="cb-tag gray">FastAPI</span>
              <span className="cb-tag cyan">Scikit-Learn</span>
              <span className="cb-tag gray">Docker</span>
              <span className="cb-tag cyan">Pandas</span>
            </div>
          </div>

          <div className="cb-small-card">
            <h4 className="cb-small-card-title">Development Phase</h4>
            <div className="cb-phase-list">
              {phases.map((phase, i) => (
                <div key={i} className={`cb-phase-item ${phase.status}`}>
                  <span className={`cb-phase-dot ${phase.status}`} />
                  {phase.label}
                </div>
              ))}
            </div>
          </div>

          <div className="cb-small-card">
            <h4 className="cb-small-card-title">Lab Metrics</h4>
            <div className="cb-stats">
              <div className="cb-stat-row">
                <span className="cb-stat-label">Model Accuracy</span>
                <span className="cb-stat-value">94.2%</span>
              </div>
              <div className="cb-stat-row">
                <span className="cb-stat-label">Latency</span>
                <span className="cb-stat-value">&lt; 40ms</span>
              </div>
              <div className="cb-stat-row">
                <span className="cb-stat-label">Uptime</span>
                <span className="cb-stat-value">99.9%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cb-footer">
          <button className="cb-btn cb-btn-primary">
            Request Access <i className="fa-solid fa-key" />
          </button>
          <button className="cb-btn cb-btn-secondary">
            View Lab Documentation
          </button>
        </div>
      </div>
    </section>
  );
};

export default CurrentlyBuilding;
