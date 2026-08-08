import { useRef } from 'react';
import SupraModelBox from './SupraModelBox';

const DialArt = () => (
  <svg className="car-home-art__svg" viewBox="0 0 220 180" aria-hidden="true">
    <path className="car-home-art__line" d="M20 150 A90 90 0 0 1 200 150" />
    <line className="car-home-art__ink" x1="110" y1="140" x2="110" y2="62" />
    <path className="car-home-art__line" d="M110 140 A0 0 0 0 1 110 140" />
    <line className="car-home-art__line" x1="62" y1="150" x2="48" y2="150" />
    <line className="car-home-art__line" x1="86" y1="150" x2="78" y2="150" />
    <line className="car-home-art__line" x1="134" y1="150" x2="142" y2="150" />
    <line className="car-home-art__line" x1="158" y1="150" x2="172" y2="150" />
    <circle className="car-home-art__line" cx="110" cy="140" r="5" />
    <line className="car-home-art__stripe" x1="110" y1="80" x2="110" y2="62" />
  </svg>
);

const Section1 = () => {
  const sectionRef = useRef();

  return (
    <section className="car-home-section car-home-section--left" ref={sectionRef}>
      <span className="car-home-section__tex car-home-section__tex--dots" aria-hidden="true" />
      <div className="car-home-section__inner">
        <p className="car-home-section__no">01</p>
        <p className="car-home-section__kicker">the ignition</p>
        <h2 className="car-home-section__title">Cooling down, then revving up.</h2>
        <p className="car-home-section__text">A placeholder line for the first section — short, calm, and vaguely mechanical in tone.</p>
      </div>
      <div className="car-home-section__art" aria-hidden="true">
        <DialArt />
      </div>
      <SupraModelBox sectionRef={sectionRef} />
    </section>
  );
};

export default Section1;