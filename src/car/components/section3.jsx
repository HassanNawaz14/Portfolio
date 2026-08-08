import { lazy, useRef } from 'react';
import SupraModelBox from './SupraModelBox';

const GTRViewer = lazy(() => import('../three/GTRViewer'));

const RoadArt = () => (
  <svg className="car-home-art__svg" viewBox="0 0 220 180" aria-hidden="true">
    <path className="car-home-art__line" d="M12 160 L104 38" />
    <path className="car-home-art__line" d="M208 160 L116 38" />
    <path className="car-home-art__dash" d="M110 42 L110 160" />
    <line className="car-home-art__line" x1="104" y1="38" x2="116" y2="38" />
    <circle className="car-home-art__stripe" cx="110" cy="46" r="4" />
  </svg>
);

const Section3 = () => {
  const sectionRef = useRef();

  return (
    <section className="car-home-section car-home-section--center" ref={sectionRef}>
      <span className="car-home-section__tex car-home-section__tex--diag" aria-hidden="true" />
      <div className="car-home-section__inner">
        <p className="car-home-section__no">03</p>
        <p className="car-home-section__kicker">the drive</p>
        <h2 className="car-home-section__title">Two edges, one mind lane.</h2>
        <p className="car-home-section__text">A placeholder line for the third section — the long straight stretch of a build.</p>
        <div className="car-home-section__art car-home-section__art--center" aria-hidden="true">
          <RoadArt />
        </div>
      </div>
      <SupraModelBox sectionRef={sectionRef} />
      <SupraModelBox sectionRef={sectionRef} flip pos="left" viewer={GTRViewer} />
    </section>
  );
};

export default Section3;