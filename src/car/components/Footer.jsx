const Footer = () => {
  return (
    <footer className="car-footer" style={{ textAlign: 'center', padding: '24px', color: '#9a9aa5', fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      © {new Date().getFullYear()} Hassan Nawaz — Car Mode
    </footer>
  );
};

export default Footer;