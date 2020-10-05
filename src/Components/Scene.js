import React, { useContext } from "react";
import { Canvas } from "react-three-fiber";
import CameraControls from "./CameraControls";
import Ecg from "./Ecg";
import { useModeStore } from "../Store";

const Scene = () => {
  const markMode = useModeStore((state) => state.markMode);

  return (
    <Canvas
      camera={{ position: [40, 80, -40], fov: 55 }}
      style={{ background: "#324444" }}
    >
      {!markMode && <CameraControls />}
      <ambientLight />
      <pointLight position={[-10, 10, -10]} castShadow />
      <Ecg />
      <axesHelper position={[0, 40, 0]} scale={[40, 40, 40]}></axesHelper>
    </Canvas>
  );
};

export default Scene;
