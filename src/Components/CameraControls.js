import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame, extend, useUpdate } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls } from '../utils/OrbitControls';
import { useZoomStore, useModeStore, useInspectStore } from '../Store';
import { useSpring, useSprings } from 'react-spring-three';

extend({ OrbitControls });
const MAX_DISTANCE = 500;
const MIN_DISTANCE = 10;

const CameraControls = (props) => {
  const [initialDistance, setInitialDistance] = useState(0);
  const markMode = useModeStore((state) => state.markMode);
  const ortoMode = useModeStore((state) => state.ortoMode);
  const zoom = useZoomStore((state) => state.zoom);
  const setZoom = useZoomStore((state) => state.setZoom);
  const orbitRef = useRef();
  const { camera, gl } = useThree();

  const [camTarget, setCamTarget] = useState(new THREE.Vector3(100, 0, 0));

  // Variables for zooming
  let vec = new THREE.Vector3();
  let lastZoom = 1;
  let camPos = new THREE.Vector3();

  // Variables for limiting camera rotation and movement
  let minPan = new THREE.Vector3(-1000, -1000, -55);
  let maxPan = new THREE.Vector3(1000, 1000, 1000);

  useEffect(() => {
    computeVec();
    setInitialDistance(vec.length());
    camera.position.set(100, 80, 150);
  }, []);

  useEffect(() => {
    console.log(initialDistance);
  }, [initialDistance]);

  /* Incase bug appears again */
  // useEffect(() => {
  //   /* Updating camera target before rerender */
  //   setCamTarget(orbitRef.current.target.clone());
  // }, [markMode]);

  useFrame(() => {
    // console.log("inspect mode", inspectMode);

    computeVec();
    if (lastZoom != zoom) {
      if (!ortoMode) {
        camPos.set(
          orbitRef.current.target.x,
          orbitRef.current.target.y,
          orbitRef.current.target.z
        );
        vec.normalize();
        vec.multiplyScalar(initialDistance);
        vec.negate();
        // vec.multiplyScalar(1 / zoom);
        vec.multiplyScalar(0.1 * Math.exp((Math.log(5 / 0.1) / 80) * zoom));
        camPos.add(vec);

        orbitRef.current.object.position.set(camPos.x, camPos.y, camPos.z);
      }
      if (ortoMode) {
        orbitRef.current.object.zoom = zoom;
        orbitRef.current.object.updateProjectionMatrix();
      }
      lastZoom = zoom;
    }
    if (
      Math.abs(orbitRef.current.object.position.length() - camPos.length()) >
      0.01
    ) {
      console.log('Zoom changed without zoombar');
      camPos.set(
        orbitRef.current.object.position.x,
        orbitRef.current.object.position.y,
        orbitRef.current.object.position.z
      );
      computeVec();
      console.log('Length', vec.length());
      console.log(40 + (80 * Math.log(10 * vec.length())) / Math.log(5 / 0.1));
    }
    orbitRef.current.target.clamp(minPan, maxPan);
    orbitRef.current.update();
  });

  const computeVec = () => {
    vec.set(
      orbitRef.current.target.x - orbitRef.current.object.position.x,
      orbitRef.current.target.y - orbitRef.current.object.position.y,
      orbitRef.current.target.z - orbitRef.current.object.position.z
    );
  };
  // useSpring({
  //   from: inspectMode && inspected != -1 && { y: camera.position.y },
  //   to: inspectMode && inspected != 0 ? { y: 100 } : { y: 80 },
  //   onFrame: ({ y }) => {
  //     camera.position.y = y;
  //   },
  //   // Turn off camera controls while animation is running
  //   onStart: () => {
  //     if (orbitRef.current) orbitRef.current.enabled = false;
  //   },
  //   // Turn on camera controls after animation is finished
  //   onRest: () => {
  //     if (orbitRef.current) orbitRef.current.enabled = true;
  //   },
  //   config: { mass: 10, tension: 1500, friction: 300, precision: 0.00001 },
  // });

  // useSpring({
  //   spring: !inspectMode,
  //   to: { y: camera.position.y },
  //   from: { y: 0 },
  //   onFrame: ({ y }) => {
  //     orbitRef.current.target.y = y;
  //     console.log(inspectMode);
  //     console.log(orbitRef.current.target.y);
  //   },
  //   config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 },
  // });

  return (
    <orbitControls
      zoomSpeed={1}
      panSpeed={1.6}
      target={camTarget}
      rotateSpeed={1}
      args={[camera, gl.domElement]}
      ref={orbitRef}
      minDistance={MIN_DISTANCE}
      maxDistance={MAX_DISTANCE}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      minAzimuthAngle={-Math.PI / 2}
      maxAzimuthAngle={Math.PI / 2}
      enabled={!markMode}
      enableDamping={true}
      dampingFactor={0.2}
    />
  );
};

export default CameraControls;
