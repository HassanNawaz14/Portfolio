import { motion } from 'framer-motion';

const Profiles = () => {
  const profiles = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: '@hafiz-m-hassan',
      icon: 'fa-brands fa-linkedin-in',
      link: 'https://www.linkedin.com/in/hafiz-m-hassan-322331256',
      stats: [
        { label: 'Connections', value: '500+' },
        { label: 'Posts', value: '20' }
      ],
      visual: <div className="network-visual"><div className="central-node" /><div className="connection-node" /><div className="connection-node" /><div className="connection-node" /><div className="connection-line" /><div className="connection-line" /><div className="connection-line" /></div>
    },
    {
      id: 'github',
      name: 'GitHub',
      handle: '@HassanNawaz14',
      icon: 'fa-brands fa-github',
      link: 'https://github.com/HassanNawaz14',
      stats: [
        { label: 'Repositories', value: '15+' },
        { label: 'Contributions', value: '20+' }
      ],
      visual: <div className="code-activity"><div className="code-line" /><div className="code-line" /><div className="code-line" /><div className="commit-timeline"><div className="commit-dot" /><div className="commit-dot" /><div className="commit-dot" /><div className="commit-dot" /></div></div>
    },
    {
      id: 'leetcode',
      name: 'LeetCode',
      handle: 'hassan_nawaz',
      icon: 'fa-solid fa-code',
      link: 'https://leetcode.com/u/34v9kWsOHX/',
      stats: [
        { label: 'Solved', value: '50+' },
        { label: 'Rank', value: 'Global (M+)' }
      ],
      visual: <div className="problem-stats"><div className="difficulty-dots"><div className="dot easy" /><div className="dot medium" /><div className="dot hard" /></div><div className="progress-ring-mini"><svg width="80" height="80"><circle className="progress-ring-bg" cx="40" cy="40" r="32" /><circle className="progress-ring-fill" cx="40" cy="40" r="32" /></svg><div className="progress-text">25%</div></div></div>
    },
    {
      id: 'kaggle',
      name: 'Kaggle',
      handle: 'hassannawaz',
      icon: 'fa-solid fa-database',
      link: 'https://www.kaggle.com/hassannawaz1423',
      stats: [
        { label: 'Notebooks', value: '5' },
        { label: 'Tier', value: 'Novice' }
      ],
      visual: <div className="data-visual"><div className="chart-bar" style={{height: '40%'}} /><div className="chart-bar" style={{height: '70%'}} /><div className="chart-bar" style={{height: '50%'}} /><div className="chart-bar" style={{height: '90%'}} /><div className="chart-bar" style={{height: '60%'}} /></div>
    },
    {
      id: 'fiverr',
      name: 'Fiverr',
      handle: 'hassandev',
      icon: 'fa-solid fa-briefcase',
      link: 'https://www.fiverr.com/users/hassannawaz14/',
      stats: [
        { label: 'Rating', value: '5.0' },
        { label: 'Projects', value: '0' }
      ],
      visual: <div className="gig-visual"><div className="gig-card" /><div className="gig-card" /><div className="gig-card" /><div className="gig-card" /></div>
    }
  ];

  return (
    <section id="profiles" className="profiles-section">
      <div className="container">
        <h2 className="section-title">Digital <span>Presence</span></h2>
        <div className="profiles-bento-grid">
          {profiles.map((profile, i) => (
            <motion.div 
              key={profile.id}
              className={`profile-bento-card card-${profile.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="profile-header">
                <div className="platform-icon">
                  <i className={profile.icon}></i>
                </div>
                <div className="profile-meta">
                  <h3>{profile.name}</h3>
                  <span className="handle">{profile.handle}</span>
                </div>
              </div>
              
              <div className="profile-visual-container">
                {profile.visual}
              </div>

              <div className="profile-stats-row">
                {profile.stats.map((stat, idx) => (
                  <div key={idx} className="mini-stat">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>

              <a href={profile.link} target="_blank" rel="noreferrer" className="profile-visit-btn">
                Visit Profile <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Profiles;
