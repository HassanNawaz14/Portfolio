import Hero from '../components/Hero';
import CarShowcase from '../three/CarShowcase';

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

const RoadArt = () => (
  <svg className="car-home-art__svg" viewBox="0 0 220 180" aria-hidden="true">
    <path className="car-home-art__line" d="M12 160 L104 38" />
    <path className="car-home-art__line" d="M208 160 L116 38" />
    <path className="car-home-art__dash" d="M110 42 L110 160" />
    <line className="car-home-art__line" x1="104" y1="38" x2="116" y2="38" />
    <circle className="car-home-art__stripe" cx="110" cy="46" r="4" />
  </svg>
);

const GearArt = () => (
  <svg className="car-home-art__svg" viewBox="0 0 220 180" aria-hidden="true">
    <circle className="car-home-art__line" cx="110" cy="92" r="40" />
    <circle className="car-home-art__line" cx="110" cy="92" r="16" />
    <path className="car-home-art__line" d="M110 52 L110 52" />
    <line className="car-home-art__line" x1="110" y1="52" x2="110" y2="38" />
    <line className="car-home-art__line" x1="110" y1="132" x2="110" y2="146" />
    <line className="car-home-art__line" x1="70" y1="92" x2="56" y2="92" />
    <line className="car-home-art__line" x1="150" y1="92" x2="164" y2="92" />
    <circle className="car-home-art__stripe" cx="110" cy="92" r="4" />
  </svg>
);

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

const SECTIONS = [
  {
    no: '01',
    align: 'left',
    kicker: 'the ignition',
    title: 'Cooling down, then revving up.',
    text: 'A placeholder line for the first section — short, calm, and vaguely mechanical in tone.',
    Art: DialArt,
    tex: 'dots',
  },
  {
    no: '02',
    align: 'right',
    kicker: 'the chassis',
    title: 'A round wheel, a square deal.',
    text: 'A placeholder line for the second section — keeps score, keeps shape, keeps going.',
    Art: RimArt,
    tex: 'grid',
  },
  {
    no: '03',
    align: 'center',
    kicker: 'the drive',
    title: 'Two edges, one mind lane.',
    text: 'A placeholder line for the third section — the long straight stretch of a build.',
    Art: RoadArt,
    tex: 'diag',
  },
  {
    no: '04',
    align: 'right',
    kicker: 'the engine',
    title: 'Locomotives of logic.',
    text: 'A placeholder line for the fourth section — cog, cog, wheel, crankshaft of code.',
    Art: GearArt,
    tex: 'lines',
  },
  {
    no: '05',
    align: 'left',
    kicker: 'the finish',
    title: 'Lap done, next grid spot.',
    text: 'A placeholder line for the fifth section — the calm after the chequered flag.',
    Art: FlagArt,
    tex: 'halo',
  },
];

const Home = () => {
  return (
    <div className="car-app-page">
      <Hero />
      <CarShowcase />
      <div className="car-show">
        <div className="car-home">
          {SECTIONS.map((s) => (
            <section
              key={s.no}
              className={`car-home-section car-home-section--${s.align}`}
              {...(s.no === '02' ? { id: 'car-work' } : {})}
            >
              <span className={`car-home-section__tex car-home-section__tex--${s.tex}`} aria-hidden="true" />
              <div className="car-home-section__inner">
                <p className="car-home-section__no">{s.no}</p>
                <p className="car-home-section__kicker">{s.kicker}</p>
                <h2 className="car-home-section__title">{s.title}</h2>
                <p className="car-home-section__text">{s.text}</p>
              </div>
              <div className="car-home-section__art" aria-hidden="true">
                <s.Art />
              </div>
            </section>
          ))}
          <div className="car-home-trailer" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default Home;