const ExperienceCard = ({ title, subtitle, year, color = '#a78bfa', companyName, highlights = [], bgParallax, contentParallax }) => {
  return (
    <div
      style={{
        width: '420px',
        maxWidth: '100%',
        height: '320px',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '16px',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          padding: '4px',
          position: 'absolute',
          inset: 0,
          background: color,
          transform: bgParallax || 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '12px 100px 40px 12px',
            background: '#222',
          }}
        />
      </div>

      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '16px',
          transform: bgParallax || 'none',
        }}
      >
        <div
          className="exp-card-spinner"
          style={{
            width: '128px',
            height: '128px',
            borderRadius: '50%',
            background: `linear-gradient(to top right, ${color}, #fb923c)`,
          }}
        />
      </div>

      <div
        style={{
          width: '100%',
          height: '100%',
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          position: 'absolute',
          inset: 0,
          transform: contentParallax || 'none',
        }}
      >
        <div
          style={{
            width: '60%',
            padding: '14px 8px 8px 14px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            background: 'rgba(249, 250, 251, 0.1)',
            color: '#e5e7eb',
            fontWeight: 500,
            fontFamily: 'monospace',
          }}
        >
          <span style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.2 }}>{title}</span>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '7px',
            }}
          >
            {highlights.slice(0, 3).map((highlight, index) => (
              <span
                key={`${highlight}-${index}`}
                style={{
                  fontSize: '0.78rem',
                  lineHeight: 1.35,
                  color: '#f3f4f6',
                  fontFamily: '"Iowan Old Style", "Palatino Linotype", serif',
                  letterSpacing: '0.04em',
                  paddingLeft: '8px',
                  borderLeft: '1px solid rgba(255,255,255,0.35)',
                }}
              >
                {highlight}
              </span>
            ))}
          </div>
          <div
            style={{
              width: '100%',
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{year}</span>
          </div>
        </div>

        <div
          style={{
            height: '100%',
            paddingTop: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            textAlign: 'right',
            color: 'rgba(255,255,255,0.78)',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              lineHeight: '14px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              fontWeight: 700,
              maxWidth: '140px',
            }}
          >
            {companyName || subtitle}
          </span>
          <div
            className="exp-card-btn"
            style={{
              width: '32px',
              height: '32px',
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              background: 'rgba(249, 250, 251, 0.2)',
              cursor: 'pointer',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" style={{ width: 16, height: 16 }}>
              <g fill="none">
                <path d="M4.646 2.146a.5.5 0 0 0 0 .708L7.793 6L4.646 9.146a.5.5 0 1 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" fill="currentColor" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
