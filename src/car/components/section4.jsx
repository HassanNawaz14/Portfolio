import { lazy, useRef } from 'react';
import SupraModelBox from './SupraModelBox';

const GTRViewer = lazy(() => import('../three/GTRViewer'));

const FlagArt = () => (
  <svg className="car-home-art__svg" viewBox="0 0 220 180" aria-hidden="true">
    <line className="car-home-art__line" x1="52" y1="16" x2="52" y2="158" />
    <rect className="car-home-art__line" x="52" y="20" width="52" height="34" />
    <line className="car-home-art__line" x1="52" y1="37" x2="104" y2="37" />
    <line className="car-home-art__line" x1="78" y1="20" x2="78" y2="54" />
    <line className="car-home-art__line" x1="52" y1="162" x2="94" y2="162" />
    <path className="car-home-art__line" d="M140 150 L196 60" />
    <path className="car-home-art__line" d="M168 156 L208 92" />
    <path className="car-home-art__dash" d="M128 38 L200 128" />
  </svg>
);

const Section4 = () => {
  const sectionRef = useRef();

  return (
    <section className="car-home-section car-home-section--left" ref={sectionRef}>
      <span className="car-home-section__tex car-home-section__tex--halo" aria-hidden="true" />
      <div className="car-home-section__inner">
        <p className="car-home-section__no">04</p>
        <p className="car-home-section__kicker">the finish</p>
        <h2 className="car-home-section__title">Lap done, next grid spot.</h2>
        <p className="car-home-section__text">A placeholder line for the fifth section — the calm after the chequered flag.</p>
      </div>
      <div className="car-home-section__art" aria-hidden="true">
        <FlagArt />
      </div>
      <SupraModelBox sectionRef={sectionRef} viewer={GTRViewer} />
    </section>
  );
};

export default Section4;