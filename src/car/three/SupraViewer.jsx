import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls, useGLTF, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

const DECODER_PATH = '/vendor/draco/';
const SUPRA_URL = '/assets/cars/mk4_opt.glb';
export const GTR_URL = '/assets/cars/gtr_opt.glb';

// Local Draco decoder so runtime decoding never depends on a CDN.
useGLTF.setDecoderPath(DECODER_PATH);
useGLTF.preload(SUPRA_URL, true);
useGLTF.preload(GTR_URL, true);

// The car's length axis (Z) occupies this many world units after auto-fit.
const TARGET_LENGTH = 7.0;

// The camera aim point (matches OrbitControls target). The scaled model's
// bounding-box center is pinned here, so growing the car keeps the exact
// same camera framing — the car just gets bigger around the aim point.
const AIM = new THREE.Vector3(0, 1.4, 0);

// Camera position (mirrors the Canvas camera prop — same values). The
// distance from AIM stays ~5.28 in every change so the car's size and
// position never move — only the viewing angle pitches.
const CAMERA_POS = new THREE.Vector3(3.71, 2.0, 3.71);

// How far the car is pushed to the viewer's right inside the canvas
// (world units along the camera's right vector). The camera and orbit
// target are NOT moved — only the car rig is offset, so angle and size
// stay identical.
const RIGHT_SHIFT = 1.2;

function computeStats(scene) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  return { center, halfLen: size.z / 2 };
}

// Loads the GLB once, scales it to TARGET_LENGTH and pins its center on the
// camera aim point. Scaling around the GLB origin would shift the car away
// from the aim (the "distortion"), so the group position is re-anchored to
// the model's bounding-box center after every scale.
function SupraModel({ modelUrl }) {
  const { scene } = useGLTF(modelUrl, true);
  const rigRef = useRef();
  const scaleRef = useRef();
  // Each viewer gets its own clone of the cached GLB, so two mounted
  // sections can render simultaneously — geometry/materials are shared by
  // reference (the GLB is decoded only once).
  const model = useMemo(() => clone(scene), [scene]);
  const stats = useMemo(() => computeStats(model), [model]);

  useLayoutEffect(() => {
    if (!rigRef.current || !scaleRef.current) return;
    const s = TARGET_LENGTH / (stats.halfLen * 2);
    scaleRef.current.scale.setScalar(s);
    // Viewer-right direction at the aim point: cross(cameraForward, up).
    const forward = new THREE.Vector3().subVectors(AIM, CAMERA_POS).normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    rigRef.current.position.set(
      AIM.x - stats.center.x * s + right.x * RIGHT_SHIFT,
      AIM.y - stats.center.y * s,
      AIM.z - stats.center.z * s + right.z * RIGHT_SHIFT,
    );
  }, [stats]);

  return (
    <group ref={rigRef}>
      <group ref={scaleRef}>
        <primitive object={model} />
      </group>
    </group>
  );
}

function ViewerLoader() {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <div className="car-viewer-loader" aria-hidden="true">
      <span className="car-viewer-loader__label">loading the garage</span>
      <div className="car-viewer-loader__track">
        <div className="car-viewer-loader__bar" style={{ width: `${Math.round(progress)}%` }} />
      </div>
    </div>
  );
}

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} />
      <directionalLight position={[-4, 3, -3]} intensity={0.5} color="#ffd8a8" />
      <directionalLight position={[0, -1, -5]} intensity={0.28} color="#e03131" />
      <pointLight position={[0, -2, 2]} intensity={0.3} color="#e03131" />
      {/* Procedural studio IBL — no network, no HDRI files. Lightformers
          build a small cubemap that gives the metallic clearcoat paint
          something to reflect, which direct lights alone can't do. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 4, -6]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={1.7} color="#fffbef" position={[0, 6, 2]} rotation-x={-Math.PI / 2} scale={[12, 12, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#ffffff" position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[10, 6, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#ffffff" position={[6, 2, 0]} rotation-y={-Math.PI / 2} scale={[10, 6, 1]} />
        <Lightformer form="ring" intensity={0.9} color="#ffe9d6" position={[0, 2.5, 4]} scale={4} />
      </Environment>
    </>
  );
}

export default function SupraViewer({ flip = false, url = SUPRA_URL }) {
  const wrapperRef = useRef();
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={'car-viewer' + (flip ? ' car-viewer--flip' : '')} ref={wrapperRef}>
      <Canvas
        camera={{ position: [3.71, 2.0, 3.71], fov: 40 }}
        dpr={[1, 1.5]}
        frameloop={inView ? 'demand' : 'never'}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Suspense fallback={null}>
          <StudioLighting />
          <SupraModel modelUrl={url} />
          <OrbitControls
            enablePan={false}
            minDistance={2.4}
            maxDistance={12}
            minPolarAngle={0.25}
            maxPolarAngle={Math.PI / 2.05}
            target={[0, 1.4, 0]}
          />
        </Suspense>
      </Canvas>
      <ViewerLoader />
    </div>
  );
}