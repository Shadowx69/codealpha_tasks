import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerformanceMonitor, Loader } from '@react-three/drei';
import Model3D from '../components/Model3D';
import DotGrid from '../components/DotGrid';
import '../styles/ModelPage.css';

const ModelPage = () => {
  const [dpr, setDpr] = useState(1.5);

  return (
    <>
      <div className="model-page-container">
        <div className="model-background">
          <DotGrid
            dotSize={10}
            gap={15}
            baseColor="#2a2a2a"
            activeColor="#00ffff"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
        <div className="model-header">
          <h1>Interactive 3D Model</h1>
          <p>We know kids love to play!!</p>
        </div>
        <div className="canvas-container">
          <Canvas 
            dpr={dpr}
            camera={{ position: [0, 0, 5], fov: 50 }} 
            shadows={false}
            gl={{ preserveDrawingBuffer: true, powerPreference: "high-performance", antialias: false }}
          >
            <PerformanceMonitor onChange={({ factor }) => setDpr(0.5 + 1.5 * factor)} />
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6} adjustCamera={1.5} shadows={false}>
                <Model3D />
              </Stage>
            </Suspense>
            <OrbitControls autoRotate autoRotateSpeed={1.5} enableDamping={true} dampingFactor={0.05} />
          </Canvas>
        </div>
        <div className="instructions">
          <p>Left Click to Rotate • Right Click to Pan • Scroll to Zoom</p>
        </div>
      </div>
      <Loader />
    </>
  );
};

export default ModelPage;
