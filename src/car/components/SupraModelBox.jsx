import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

// Lazy chunk: loading the 3D module also loads the GLB, Draco and WebGL
// context. Mounted only once the section scrolls near the viewport.
const SupraViewer = lazy(() => import('../three/SupraViewer'));

// Scroll-scrubbed model box shared by all sections. Right-anchored boxes
// (sections 1, 3) arrive from off-screen right (110% -> 0) and leave to the
// right (0 -> 130%). Left-anchored boxes (section 2) mirror both: arrive
// from off-screen left (-110% -> 0) and leave to the left (0 -> -130%).
const SupraModelBox = ({ sectionRef, flip = false, pos, url, viewer }) => {
  const modelRef = useRef();
  const [loaded, setLoaded] = useState(false);
  const isLeft = pos === 'left';
  const Viewer = viewer || SupraViewer;

  useEffect(() => {
    const el = modelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLoaded(true);
        observer.disconnect();
      },
      { rootMargin: '400px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start'],
  });
  const modelX = useTransform(scrollYProgress, [0, 1], isLeft ? ['-110%', '0%'] : ['110%', '0%']);
  const smoothX = useSpring(modelX, { stiffness: 120, damping: 26, mass: 0.6 });

  const { scrollYProgress: exitProgress } = useScroll({
    target: sectionRef,
    offset: ['end end', 'end start'],
  });
  const exitX = useTransform(exitProgress, [0, 1], isLeft ? ['0%', '-130%'] : ['0%', '130%']);
  const smoothExitX = useSpring(exitX, { stiffness: 120, damping: 26, mass: 0.6 });

  return (
    <motion.div
      className={`car-home-section__model${isLeft ? ' car-home-section__model--left' : ''}`}
      ref={modelRef}
      style={{ x: smoothExitX }}
    >
      <motion.div className="car-home-section__model-inner" style={{ x: smoothX }}>
        {loaded ? (
          <Suspense fallback={null}>
            <Viewer flip={flip} url={url} />
          </Suspense>
        ) : null}
      </motion.div>
    </motion.div>
  );
};

export default SupraModelBox;