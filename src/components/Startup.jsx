import { motion } from 'framer-motion';

const Startup = () => {
  const stats = [
    { label: 'Sites Delivered', value: 15, icon: 'fa-globe-americas' },
    { label: 'Avg. Uptime', value: 99.9, icon: 'fa-microchip', suffix: '%' },
    { label: 'Happy Clients', value: 10, icon: 'fa-smile-beam' },
    { label: 'Months Active', value: 12, icon: 'fa-calendar-check' }
  ];

  const features = [
    { icon: 'fa-rocket', title: 'One‑Click Launch', desc: 'Prototype to production with automated builds and free hosting.' },
    { icon: 'fa-bolt', title: 'Blazing Performance', desc: 'Lightweight pages engineered for speed and SEO.' },
    { icon: 'fa-hand-holding-heart', title: 'Founder‑First', desc: 'One‑time pricing, personalized designs, and ongoing support.' }
  ];

  const milestones = [
    { label: 'Platform Stability', percent: '90%', status: 'Nominal' },
    { label: 'Feature Completion', percent: '75%', status: 'Active' },
    { label: 'Automation & Deploy', percent: '100%', status: 'Optimized' }
  ];

  return (
    <section id="startup" className="startup-section no-kicker">
      <div className="container">
        <div className="section-header startup-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            QuickSite — Pioneering <span>Digital Speed</span>
          </motion.h2>
          <motion.p 
            className="startup-tagline"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <strong>Co‑founder</strong> — Redefining how founders deploy their vision to the world.
          </motion.p>
        </div>

        <div className="startup-main-grid">
          <div className="startup-primary-col">
            <motion.div 
              className="startup-vision-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="card-glare" />
              <h3>The Vision</h3>
              <p>
                QuickSite was born from a simple observation: most founders waste months on complexity. 
                We stripped away the friction, building a platform that delivers production-grade websites 
                in record time. No monthly lock‑ins, no overhead, just <strong>pure performance</strong>.
              </p>
              
              <div className="startup-actions">
                <motion.a 
                  href="https://quick-site-00.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-glow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Visit QuickSite <i className="fa-solid fa-arrow-up-right-from-square" />
                </motion.a>
                <motion.a 
                  href="https://quick-site-00.vercel.app/#contact" 
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Collaborate With Us
                </motion.a>
              </div>
            </motion.div>

            <div className="startup-stats-row">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="stat-box"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="stat-icon"><i className={`fas ${stat.icon}`} /></div>
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}{stat.suffix}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="startup-secondary-col">
            <div className="features-stack">
              {features.map((feature, i) => (
                <motion.div 
                  key={i} 
                  className="feature-card-compact"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                >
                  <div className="feature-icon"><i className={`fas ${feature.icon}`} /></div>
                  <div className="feature-info">
                    <h4>{feature.title}</h4>
                    <p>{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="milestones-dashboard-v2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <div className="dashboard-header">
                <h4>System Integrity</h4>
                <div className="status-indicator">
                  <span className="pulse-dot" /> Live Monitoring
                </div>
              </div>
              
              <div className="milestones-list">
                {milestones.map((ms, i) => (
                  <div key={i} className="milestone-v2">
                    <div className="ms-meta-v2">
                      <span className="ms-label-v2">{ms.label}</span>
                      <span className="ms-status-tag">{ms.status}</span>
                      <span className="ms-percent-v2">{ms.percent}</span>
                    </div>
                    <div className="ms-track-v2">
                      <motion.div 
                        className="ms-fill-v2"
                        initial={{ width: 0 }}
                        whileInView={{ width: ms.percent }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 1 + i * 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Startup;
