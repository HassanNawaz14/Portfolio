import { lazy, useRef } from 'react';
import SupraModelBox from './SupraModelBox';

const GTRViewer = lazy(() => import('../three/GTRViewer'));

const GearArt = () => (
  <svg className="car-home-art__svg" viewBox="0 0 220 180" aria-hidden="true">
    <line className="car-home-art__line" x1="110" y1="24" x2="110" y2="56" />
    <line className="car-home-art__line" x1="46" y1="58" x2="68" y2="82" />
    <line className="car-home-art__line" x1="31" y1="126" x2="52" y2="104" />
    <line className="car-home-art__line" x1="110" y1="156" x2="110" y2="124" />
    <line className="car-home-art__line" x1="174" y1="122" x2="153" y2="98" />
    <line className="car-home-art__line" x1="190" y1="54" x2="168" y2="78" />
    <line className="car-home-art__line" x1="31" y1="54" x2="72" y2="54" />
    <line className="car-home-art__line" x1="110" y1="126" x2="110" y2="94" />
    <line className="car-home-art__line" x1="190" y1="126" x2="149" y2="126" />
    <circle className="car-home-art__circle" cx="110" cy="90" r="34" />
  </svg>
);

const Section5 = () => {
  const sectionRef = useRef();

  return (
    <section className="car-home-section car-home-section--right" ref={sectionRef}>
      <span className="car-home-section__tex car-home-section__tex--halo" aria-hidden="true" />
      <div className="car-home-section__inner">
        <p className="car-home-section__no">05</p>
        <p className="car-home-section__kicker">the engine</p>
        <h2 className="car-home-section__title">13 Custom Builds. Zero Idle Time.</h2>
        <p className="car-home-section__text">
          My garage is stacked. Stellar DNA (astrophysics sim pushing Python to its limits).
          GearPro (a dedicated spec database for the real gearheads). Sentiment Predictor,
          CPU-Storm, and raw Assembly x86 builds like Space Shooter. 13 unique engines,
          different displacements, all tuned to smoke the competition off the line.
        </p>
      </div>
      <div className="car-home-section__art car-home-section__art--right" aria-hidden="true">
        <GearArt />
      </div>
      <SupraModelBox sectionRef={sectionRef} flip pos="left" viewer={GTRViewer} />
    </section>
  );
};

export default Section5;