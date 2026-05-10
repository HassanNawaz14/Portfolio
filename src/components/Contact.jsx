import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      
      const response = await fetch('https://formspree.io/f/mdklyznr', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setStatus('success');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage(`Error: ${error.message}. Please try again or email me directly.`);
      setStatus('error');
    }
  };

  const contactDetails = [
    { id: 1, icon: 'fa-location-dot', label: 'Base Ops', value: 'Lahore, Pakistan', sub: 'Ready for global collab' },
    { id: 2, icon: 'fa-envelope', label: 'Secure Channel', value: 'hafizhassan142003@gmail.com', sub: '24/7 Response time' },
    { id: 3, icon: 'fa-phone', label: 'Comms Link', value: '+92 322 4191962', sub: 'Mon - Sat (9am - 6pm)' },
    { id: 4, icon: 'fa-globe', label: 'Digital Hub', value: 'HassanNawaz.com', sub: 'Always online', link: 'https://hassan-nawaz-portfolio00.vercel.app/' }
  ];

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Get In <span>Touch</span></h2>
          <p className="section-subtitle">Establish a secure connection and let&apos;s build the future together.</p>
        </div>
        
        <div className="contact-grid">
          <div className="contact-info-col">
            <div className="contact-details-grid">
              {contactDetails.map((detail) => (
                <motion.div 
                  key={detail.id}
                  className="contact-info-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: detail.id * 0.1 }}
                  whileHover={{ y: -5, borderColor: 'var(--cyan)' }}
                >
                  <div className="info-card-icon">
                    <i className={`fa-solid ${detail.icon}`}></i>
                  </div>
                  <div className="info-card-text">
                    <span className="info-label">{detail.label}</span>
                    {detail.link ? (
                      <a href={detail.link} target="_blank" rel="noreferrer" className="info-value link">{detail.value}</a>
                    ) : (
                      <span className="info-value">{detail.value}</span>
                    )}
                    <span className="info-sub">{detail.sub}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="contact-social-prompt">
              <h3>Social Connectivity</h3>
              <p>Prefer a different frequency? Find me on social platforms.</p>
              <div className="social-quick-links">
                <a href="https://github.com/HassanNawaz14" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i></a>
                <a href="https://www.linkedin.com/in/hafiz-m-hassan-322331256" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>

          <motion.div 
            className="contact-form-container"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="form-glass-panel">
              <div className="form-header">
                <i className="fa-solid fa-paper-plane"></i>
                <h3>Send Encryption</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="futuristic-form">
                <div className="input-group">
                  <input 
                    type="text" name="name" 
                    value={formData.name} onChange={handleChange} required 
                    autoComplete="off"
                    placeholder=" "
                  />
                  <label>Identity / Name</label>
                  <div className="input-line"></div>
                </div>

                <div className="input-group">
                  <input 
                    type="email" name="email" 
                    value={formData.email} onChange={handleChange} required 
                    autoComplete="off"
                    placeholder=" "
                  />
                  <label>Digital Address / Email</label>
                  <div className="input-line"></div>
                </div>

                <div className="input-group">
                  <input 
                    type="text" name="subject" 
                    value={formData.subject} onChange={handleChange} required 
                    autoComplete="off"
                    placeholder=" "
                  />
                  <label>Signal Type / Subject</label>
                  <div className="input-line"></div>
                </div>

                <div className="input-group">
                  <textarea 
                    name="message" 
                    value={formData.message} onChange={handleChange} required
                    placeholder=" "
                  ></textarea>
                  <label>Transmission / Message</label>
                  <div className="input-line"></div>
                </div>
                
                <div className="form-actions">
                  <motion.button 
                    type="submit" 
                    className={`btn-glitch ${status === 'sending' ? 'loading' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === 'sending'}
                  >
                    <span className="btn-text">
                      {status === 'sending' ? 'Transmitting...' : 'Initiate Send'}
                    </span>
                    <i className="fa-solid fa-bolt"></i>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.p 
                      className="form-success-msg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <i className="fa-solid fa-circle-check"></i> Transmission Successful! Signal received.
                    </motion.p>
                  )}
                  {status === 'error' && (
                    <motion.p 
                      className="form-error-msg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <i className="fa-solid fa-circle-exclamation"></i> {errorMessage}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
