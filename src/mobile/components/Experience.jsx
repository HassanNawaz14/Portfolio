import { useRef, useEffect } from 'react';
import { animated, useScroll, useSpring } from '@react-spring/web';
import { experience } from '../../content/experience';
import ExperienceCard from '../../components/ExperienceCard';

const useItemParallax = () => {
  const ref = useRef(null);
  const topRef = useRef(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    const update = () => {
      if (ref.current) topRef.current = ref.current.getBoundingClientRect().top + window.scrollY;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const raw = scrollY.to(y => {
    const top = topRef.current;
    return top ? y - top + window.innerHeight * 0.5 : 0;
  });
  const { offset } = useSpring({ offset: raw, config: { mass: 1, tension: 280, friction: 60 } });
  const p = (speed) => offset.to(v => Math.max(-350, Math.min(350, -v * speed)));

  return { ref, p };
};

function ZigzagItem({ item, isLeft, i }) {
  const { ref, p } = useItemParallax();

  return (
    <animated.div
      ref={ref}
      className={`experience-zigzag-item ${isLeft ? 'left' : 'right'}`}
      style={{ transform: p(0.14 + i * 0.05).to(v => `translateY(${v}px)`) }}
    >
      <ExperienceCard
        title={item.role}
        subtitle={item.company}
        companyName={item.company}
        year={item.duration}
        color={item.color}
        highlights={item.highlights || []}
        bgParallax={p(0.20 + i * 0.06).to(v => `translateY(${v}px)`)}
        contentParallax={p(0.10 + i * 0.04).to(v => `translateY(${v}px)`)}
      />
    </animated.div>
  );
}

const Experience = () => {
  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Professional <span>Experience</span></h2>
          <p className="section-subtitle">Places I've worked and the impact I've made.</p>
        </div>

        <div className="experience-zigzag">
          {experience.map((item, i) => (
            <ZigzagItem key={item.id} item={item} isLeft={i % 2 === 0} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
