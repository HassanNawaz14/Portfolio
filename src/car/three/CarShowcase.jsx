import { Suspense, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, useGLTF, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DECODER_PATH = '/vendor/draco/';
const SUPRA_URL = '/assets/cars/mk4_opt.glb';
const SKYLINE_URL = '/assets/cars/gtr_opt.glb';

// Local Draco decoder so runtime decoding never depends on a CDN.
useGLTF.setDecoderPath(DECODER_PATH);
useGLTF.preload(SUPRA_URL, true);
useGLTF.preload(SKYLINE_URL, true);

// Set to false if the models were authored with the nose toward -Z.
const FACES_PLUS_Z = true;

// The car's length axis (Z) occupies this many world units after auto-fit.
const TARGET_LENGTH = 4.4;
// How far a section-3 car's silhouette pokes into the viewport (world units).
const BUCK_POKE = 1.5;
// Fraction of the camera half-width used for the in-view section poses.
const POSE_X_FRONT = 0.62;
const POSE_X_REAR = 0.58;
// Distance beyond the frustum where idle cars are parked (frustum-culled).
const PARK_MARGIN = 30;

// Per-car pose rotations (radians around Y). With FACES_PLUS_Z the nose is +Z,
// so a positive rotation turns the nose toward +X (the viewer's right).
const POSES = {
  supra: {
    aRot: 0.55, // S1: front 3/4, parked right of frame
    bRot: -2.52, // S2: rear 3/4, parked left of frame
    s3Rot: 0.45, // S3: off-screen left, nose pointing in toward center
  },
  skyline: {
    aRot: -0.55, // S4: front 3/4, parked left of frame
    bRot: 2.52, // S5: rear 3/4, parked right of frame
    s3Rot: -0.45, // S3: off-screen right, nose pointing in toward center
  },
};

// Yaw helper so a single constant can flip which end of the car is the nose.
const yaw = (r) => (FACES_PLUS_Z ? r : r + Math.PI);

function computeStats(scene) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  return { minY: box.min.y, halfW: size.x / 2, halfLen: size.z / 2 };
}

// Loads one GLB once, normalizes its ground to y=0 and fits its length to
// TARGET_LENGTH. The outer group is the GSAP target (position/rotation only —
// idle cars are parked far outside the frustum instead of toggling visibility).
function CarRig({ url, rigRef, onReady, position = [0, 0, 0] }) {
  const { scene } = useGLTF(url, true);
  const scaleRef = useRef();
  const stats = useMemo(() => computeStats(scene), [scene]);

  useLayoutEffect(() => {
    if (!scaleRef.current) return;
    const s = TARGET_LENGTH / (stats.halfLen * 2);
    scaleRef.current.scale.setScalar(s);
    scaleRef.current.position.y = -stats.minY * s;
  }, [stats]);

  useLayoutEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <group ref={rigRef} position={position}>
      <group ref={scaleRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

function SceneRig() {
  const supraRef = useRef();
  const skyRef = useRef();
  const [supraReady, setSupraReady] = useState(false);
  const [skyReady, setSkyReady] = useState(false);
  const camera = useThree((s) => s.camera);

  const onSupraReady = useMemo(() => () => setSupraReady(true), []);
  const onSkyReady = useMemo(() => () => setSkyReady(true), []);

  // Live frustum half-width at the model plane (z=0). Read inside the GSAP
  // function-based values so an aspect change is picked up on every refresh.
  const halfW = useMemo(
    () => () => {
      const dist = Math.abs(camera.position.z);
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
      return halfH * camera.aspect;
    },
    [camera],
  );

  useLayoutEffect(() => {
    if (!supraReady || !skyReady) return;

    const wrap = document.querySelector('.car-show');
    const canvas = document.querySelector('.car-home-3d');
    if (!wrap || !supraRef.current || !skyRef.current) return;

    const supra = supraRef.current;
    const sky = skyRef.current;

    // --- Canvas visibility gate -----------------------------------------
    // The canvas is position:fixed so it spans the full viewport at all times.
    // We hide it while the Hero is on screen and show it only when .car-show
    // enters the viewport — this prevents models from leaking into the Hero
    // and lets the video render unobstructed.
    let visST;
    if (canvas) {
      canvas.style.opacity = '0';
      canvas.style.visibility = 'hidden';
      visST = ScrollTrigger.create({
        trigger: wrap,
        start: 'top bottom',   // canvas appears as .car-show bottom edge hits viewport bottom
        end: 'bottom top',     // canvas disappears when .car-show top edge leaves viewport top
        onEnter: () => {
          canvas.style.visibility = 'visible';
          gsap.to(canvas, { opacity: 1, duration: 0.35, ease: 'none' });
        },
        onLeave: () => {
          gsap.to(canvas, {
            opacity: 0, duration: 0.25, ease: 'none',
            onComplete: () => { canvas.style.visibility = 'hidden'; },
          });
        },
        onEnterBack: () => {
          canvas.style.visibility = 'visible';
          gsap.to(canvas, { opacity: 1, duration: 0.2, ease: 'none' });
        },
        onLeaveBack: () => {
          gsap.to(canvas, {
            opacity: 0, duration: 0.25, ease: 'none',
            onComplete: () => { canvas.style.visibility = 'hidden'; },
          });
        },
      });
    }

    // World-space half extent of a rotated car along the X axis, measured live
    // from the scaled geometry so it stays correct at any viewport size.
    const extentX = (rootRef, rotY) => {
      const size = new THREE.Vector3();
      new THREE.Box3().setFromObject(rootRef.current).getSize(size);
      const halfLen = size.z / 2;
      const halfW = size.x / 2;
      return halfLen * Math.abs(Math.sin(rotY)) + halfW * Math.abs(Math.cos(rotY));
    };

    // Section-3 slots: cars sit mostly off-screen with their nose + a chunk of
    // the hood poking in, computed from the actual camera frustum width.
    const s3X = (rootRef, rotY, side) =>
      side * (halfW() + extentX(rootRef, rotY) - BUCK_POKE);

    // Keyframes at 0/0.2/0.4/0.6/0.8 = the five section boundaries of the
    // .car-show scroll range (5 x 100vh sections + 100vh trailing spacer).
    const tl = gsap.timeline({
      defaults: { ease: 'power1.inOut' },
      scrollTrigger: {
        trigger: wrap,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // ---- Supra: S1 front 3/4 (right) -> S2 rear 3/4 (left) -> S3 slot -----
    // FIX: fromTo gives the Supra an explicit start pose at progress=0 so
    // it is already in the S1 position when the section first enters the
    // viewport. A bare tl.to() at position 0 uses the Three.js mount value
    // (origin) as the from-state, so the car starts at center-screen and
    // drifts rightward through section 1 — visually wrong and not reversible.
    tl.fromTo(
        supra.position,
        { x: () => halfW() * POSE_X_FRONT, y: 0, z: 0.15 },
        { x: () => -halfW() * POSE_X_FRONT, y: 0, z: -0.15 },
        0,
      )
      .fromTo(
        supra.rotation,
        { y: yaw(POSES.supra.aRot) },
        { y: yaw(POSES.supra.bRot) },
        0,
      )
      // S2 -> S3: Supra slides to off-screen-left slot (section 3 dual view)
      .to(
        supra.position,
        { x: () => s3X(supraRef, yaw(POSES.supra.s3Rot), -1), y: 0, z: 0 },
        0.2,
      )
      .to(supra.rotation, { y: yaw(POSES.supra.s3Rot) }, 0.2)
      // S3 -> park: Supra exits left, fully off-screen before section 4
      .to(supra.position, { x: () => -(halfW() + PARK_MARGIN), y: 0, z: 0 }, 0.385)
      .to(supra.rotation, { y: yaw(POSES.supra.aRot) }, 0.4);

    // ---- Skyline: parked underground -> S3 slot (right) -> S4 -> S5 ---
    // FIX: tl.set()+tl.to() was broken on scroll-up: the set snaps on
    // reverse and the to() tween only specified y, leaving x un-reversed.
    // Replaced with:
    //   1) A zero-duration fromTo that holds the underground park from 0→0.335
    //      (gives GSAP a recorded from-value so reverse works cleanly)
    //   2) A fromTo that spans 0.335→0.4 for the rise, including x so the
    //      car rises and falls in-place without drifting sideways on reverse.
    tl.fromTo(
        sky.position,
        { x: () => halfW() + PARK_MARGIN, y: -40, z: 0 },
        { x: () => halfW() + PARK_MARGIN, y: -40, z: 0 },
        0,
      )
      // Rise from underground into S3 right-slot at the section-3 boundary
      .fromTo(
        sky.position,
        { x: () => s3X(skyRef, yaw(POSES.skyline.s3Rot), 1), y: -40, z: 0 },
        { x: () => s3X(skyRef, yaw(POSES.skyline.s3Rot), 1), y: 0,   z: 0 },
        0.335,
      )
      .fromTo(
        sky.rotation,
        { y: 0 },
        { y: yaw(POSES.skyline.s3Rot) },
        0.335,
      )
      // S3 -> S4: Skyline moves to left-of-frame front 3/4
      .to(sky.position, { x: () => -halfW() * POSE_X_FRONT, y: 0, z: -0.1 }, 0.4)
      .to(sky.rotation, { y: yaw(POSES.skyline.aRot) }, 0.4)
      // S4 -> S5: Skyline moves to right-of-frame rear 3/4
      .to(sky.position, { x: () => halfW() * POSE_X_REAR, y: 0, z: 0.15 }, 0.6)
      .to(sky.rotation, { y: yaw(POSES.skyline.bRot) }, 0.6)
      // S5 -> trailer: park off-screen right
      .to(sky.position, { x: () => halfW() + PARK_MARGIN, y: 0, z: 0 }, 0.82);

    const st = tl.scrollTrigger;
    return () => {
      if (visST) visST.kill();
      if (st) st.kill();
      tl.kill();
    };
  }, [supraReady, skyReady, halfW]);

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 3]} intensity={1.15} />
      <directionalLight position={[-4, 3, -3]} intensity={0.45} color="#ffd8a8" />
      <pointLight position={[0, -2, 2]} intensity={0.4} color="#e03131" />
      <ContactShadows position={[0, -0.03, 0]} opacity={0.45} scale={16} blur={2.4} far={3.2} color="#1a1410" frames={Infinity} />
      {/* Supra: parked far off-screen left at mount; GSAP fromTo takes over on scroll */}
      <CarRig url={SUPRA_URL} rigRef={supraRef} onReady={onSupraReady} position={[-200, 0, 0]} />
      {/* Skyline: parked far off-screen right AND underground at mount */}
      <CarRig
        url={SKYLINE_URL}
        rigRef={skyRef}
        onReady={onSkyReady}
        position={[200, -40, 0]}
      />
    </>
  );
}

function CarLoader() {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <div className="car-3d-loader" aria-hidden="true">
      <span className="car-3d-loader__label">loading the garage</span>
      <div className="car-3d-loader__track">
        <div className="car-3d-loader__bar" style={{ width: `${Math.round(progress)}%` }} />
      </div>
    </div>
  );
}

export default function CarShowcase() {
  return (
    <div className="car-home-3d" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.55, 5.6], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <SceneRig />
        </Suspense>
      </Canvas>
      <CarLoader />
    </div>
  );
}
