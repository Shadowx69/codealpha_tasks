import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function Model3D(props) {
  const { scene } = useGLTF('/models/model.glb');
  return <primitive object={scene} {...props} />;
}

useGLTF.preload('/models/model.glb');
