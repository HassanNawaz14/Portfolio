import { certifications } from '../content/certifications';

const certImages = {
  cs50: '/assets/certificates/CS50x26%20Certificate.png',
  claude101: '/assets/certificates/cert_cluade_101.png',
  'agent-skills': '/assets/certificates/agent_skills.png',
  'claude-code-101': '/assets/certificates/claude_code_101.png',
  'claude-code-in-action': '/assets/certificates/claude_code_in_action.png',
  genai: '/assets/certificates/Gen_AI_Badge.png',
  llm: '/assets/certificates/LLM_Badge.png',
  pandas: '/assets/certificates/hassan.nawaz1423%20-%20Pandas.png',
  datacleaning: '/assets/certificates/hassan.nawaz1423%20-%20Data%20Cleaning.png',
};

const issuerColors = {
  harvard: '#B3453A',
  anthropic: '#D97757',
  google: '#4285F4',
  kaggle: '#20BEFF',
};

const issuerBadge = (tag, colors) => {
  const maps = {
    harvard: (
      <svg viewBox="0 0 40 40" className="certifications-card-badge-svg">
        <path fill={colors.harvard} d="M20 2C11 2 4 7 4 14v4c0 8 6 16 16 18 10-2 16-10 16-18v-4c0-7-7-12-16-12z"/>
        <text x="20" y="23" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="serif">H</text>
      </svg>
    ),
    anthropic: (
      <svg viewBox="0 0 40 40" className="certifications-card-badge-svg">
        <rect x="2" y="2" width="36" height="36" rx="8" fill={colors.anthropic}/>
        <text x="20" y="28" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="bold" fontFamily="sans-serif">A</text>
      </svg>
    ),
    google: (
      <svg viewBox="0 0 40 40" className="certifications-card-badge-svg">
        <circle cx="20" cy="20" r="18" fill={colors.google}/>
        <text x="20" y="27" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold" fontFamily="sans-serif">G</text>
      </svg>
    ),
    kaggle: (
      <svg viewBox="0 0 40 40" className="certifications-card-badge-svg">
        <rect x="2" y="2" width="36" height="36" rx="6" fill={colors.kaggle}/>
        <path fill="#fff" d="M28 32h-6l-6-8-2 2v6h-6V8h6v14l7-7h6l-7 7 8 10z"/>
      </svg>
    ),
  };
  return maps[tag] || null;
};

const Certifications = () => {
  return (
    <section id="certifications" className="certifications-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Professional <span>Certifications</span></h2>
          <p className="section-subtitle">Industry-recognized credentials and ongoing learning achievements.</p>
        </div>

        <div className="certifications-comic-panel">
          <div className="certifications-cards-row">
            {certifications.map((cert) => (
              <div key={cert.id} className="certifications-card">
                <div className="certifications-card-top" style={{ backgroundImage: `url(${certImages[cert.id]})` }}>
                  <div className="certifications-card-border" />
                  {issuerBadge(cert.tag, issuerColors)}
                  <span className="certifications-card-category">{cert.category}</span>
                </div>
                <div className="certifications-card-bottom">
                  <span className="certifications-card-title">{cert.title}</span>
                  <div className="certifications-card-row">
                    <div className="certifications-card-item">
                      <span className="certifications-card-big">{cert.date}</span>
                      <span className="certifications-card-regular">Completed</span>
                    </div>
                    <div className="certifications-card-item">
                      <span className="certifications-card-big">{cert.issuer}</span>
                      <span className="certifications-card-regular">Issuer</span>
                    </div>
                    <div className="certifications-card-item">
                      <a href={cert.url || '#'} target="_blank" rel="noopener noreferrer" className="certifications-card-link">
                        <i className="fa-solid fa-arrow-up-right-from-square" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
