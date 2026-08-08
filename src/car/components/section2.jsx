import { useRef } from 'react';
import SupraModelBox from './SupraModelBox';

const RimArt = () => (
  <svg className="car-home-art__svg" viewBox="0 0 220 180" aria-hidden="true">
    <circle className="car-home-art__line" cx="110" cy="90" r="58" />
    <circle className="car-home-art__line" cx="110" cy="90" r="44" />
    <circle className="car-home-art__line" cx="110" cy="90" r="16" />
    <line className="car-home-art__line" x1="110" y1="90" x2="110" y2="34" />
    <line className="car-home-art__line" x1="110" y1="90" x2="110" y2="146" />
    <line className="car-home-art__line" x1="110" y1="90" x2="54" y2="90" />
    <line className="car-home-art__line" x1="110" y1="90" x2="166" y2="90" />
    <circle className="car-home-art__stripe" cx="110" cy="90" r="5" />
  </svg>
);

const Section2 = () => {
  const sectionRef = useRef();

  return (
    <section id="car-work" className="car-home-section car-home-section--right" ref={sectionRef}>
      <span className="car-home-section__tex car-home-section__tex--grid" aria-hidden="true" />
      <div className="car-home-section__inner">
        <p className="car-home-section__no">02</p>
        <p className="car-home-section__kicker">the chassis</p>
        <h2 className="car-home-section__title">A round wheel, a square deal.</h2>
        <p className="car-home-section__text">A placeholder line for the second section — keeps score, keeps shape, keeps going.</p>
      </div>
      <div className="car-home-section__art car-home-section__art--right" aria-hidden="true">
        <RimArt />
      </div>
      <SupraModelBox sectionRef={sectionRef} flip pos="left" />
    </section>
  );
};

export default Section2;