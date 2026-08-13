const Footer = () => {
  return (
    <footer 
      className="car-footer" 
      style={{ 
        padding: '48px 24px', 
        backgroundColor: '#050505', 
        color: '#6a6a75', 
        fontSize: '0.85rem', 
        borderTop: '1px solid rgba(255,255,255,0.05)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '20px' 
      }}
    >
      <div style={{ display: 'flex', gap: '40px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span>Engine: React 19</span>
        <span>Aero: Plain CSS</span>
        <span>Tuning: Vercel</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ height: '1px', width: '40px', backgroundColor: '#6a6a75' }} />
        <span style={{ fontWeight: 'bold', color: '#fff', letterSpacing: '4px' }}>HASSAN NAWAZ</span>
        <span style={{ height: '1px', width: '40px', backgroundColor: '#6a6a75' }} />
      </div>
      
      <div style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px', textAlign: 'center' }}>
        © {new Date().getFullYear()} // Built for the track. Stay in the fast lane.
      </div>
    </footer>
  );
};

export default Footer;