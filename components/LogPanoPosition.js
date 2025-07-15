import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useState } from 'react';
import * as THREE from 'three';

const LogPanoPosition = () => {
  const { camera } = useThree();
  const [position, setPosition] = useState({ 
    x: 0, 
    y: 0, 
    z: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0
  });

  useFrame(() => {
    const euler = new THREE.Euler();
    euler.setFromQuaternion(camera.quaternion);
    
    setPosition({
      x: camera.position.x.toFixed(3),
      y: camera.position.y.toFixed(3),
      z: camera.position.z.toFixed(3),
      rotationX: THREE.MathUtils.radToDeg(euler.x).toFixed(1),
      rotationY: THREE.MathUtils.radToDeg(euler.y).toFixed(1),
      rotationZ: THREE.MathUtils.radToDeg(euler.z).toFixed(1)
    });
  });

  return (
    <Html>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        zIndex: 1000,
        minWidth: '300px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Camera Position</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div><span style={{ color: '#FF5252' }}>X:</span> {position.x}</div>
          <div><span style={{ color: '#FF5252' }}>Rot X:</span> {position.rotationX}°</div>
          <div><span style={{ color: '#4CAF50' }}>Y:</span> {position.y}</div>
          <div><span style={{ color: '#4CAF50' }}>Rot Y:</span> {position.rotationY}°</div>
          <div><span style={{ color: '#2196F3' }}>Z:</span> {position.z}</div>
          <div><span style={{ color: '#2196F3' }}>Rot Z:</span> {position.rotationZ}°</div>
        </div>
      </div>
    </Html>
  );
};

export default LogPanoPosition;