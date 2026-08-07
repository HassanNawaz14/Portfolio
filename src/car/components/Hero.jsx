const Hero = () => {
  return (
    <section className="car-hero" id="car-home">
      <video
        className="car-hero__media"
        src="/assets/cars/comp25_clean.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/assets/cars/comp25_clean.mp4"
        aria-hidden="true"
      />
      <div className="car-hero__veil" aria-hidden="true" />

      <header className="car-hero__top">
        <div className="car-hero__brand">
          <span className="car-hero__brand-dot" aria-hidden="true" />
          HN<span className="car-hero__brand-sep">·</span>PORTFOLIO
        </div>
        <nav className="car-hero__nav" aria-label="Sections">
          <a href="#car-home" className="car-hero__nav-link">Home</a>
          <a href="#car-work" className="car-hero__nav-link">Work</a>
          <span className="car-hero__nav-link is-static">Contact</span>
        </nav>
      </header>

      <div className="car-hero__content">
        <p className="car-hero__eyebrow">Frontend · Automotive</p>
        <h1 className="car-hero__title">
          Fast on the Road.
          <span> Fast on the Web.</span>
        </h1>
        <p className="car-hero__tagline">
          I write interfaces the way I drive — clean, focused, and just fast enough.
        </p>
        <div className="car-hero__rule" aria-hidden="true"><i /></div>
        <a href="#car-work" className="car-hero__link">
          view the work <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className="car-hero__art" aria-hidden="true">
        <svg viewBox="0 0 220 120" className="car-hero__car">
          <line className="car-hero__car-speed" x1="12" y1="42" x2="34" y2="42" />
          <line className="car-hero__car-speed" x1="16" y1="54" x2="42" y2="54" />
          <path
            className="car-hero__car-body"
            d="M24 74
               L60 74
               C78 74 84 68 86 60
               L96 38
               C100 28 108 24 120 24
               L142 24
               C152 24 156 30 158 38
               L164 54
               C172 66 182 74 196 74
               L210 74
               C216 74 216 62 200 60
               L164 54"
            fill="none"
          />
          <circle className="car-hero__car-wheel" cx="56" cy="78" r="13" />
          <circle className="car-hero__car-wheel" cx="196" cy="78" r="13" />
          <path
            className="car-hero__car-roof"
            d="M118 28
               C134 30 148 32 152 40
               C152 46 132 48 118 46"
            fill="none"
          />
          <line className="car-hero__car-stripe" x1="88" y1="64" x2="150" y2="64" />
          <line className="car-hero__car-line" x1="176" y1="80" x2="204" y2="80" />
        </svg>
        <code className="car-hero__code">$ ./start --mode=fast</code>
      </div>

      <div className="car-hero__foot">
        <span className="car-hero__meta">pk-based · built for speed</span>
        <span className="car-hero__scroll">
          scroll <i aria-hidden="true" />
        </span>
      </div>
    </section>
  );
};

export default Hero;