import { OrbitControls } from "@react-three/drei";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { useRef } from "react";

export function Experience() {
  const cubeRef = useRef<RapierRigidBody>(null);

  const cubeJump = () => {
    if (cubeRef.current) {
      cubeRef.current.applyImpulse({ x: 0, y: 5, z: 0 }, true);
      cubeRef.current.applyTorqueImpulse(
        {
          x: Math.random() - 0.5,
          y: Math.random() - 0.5,
          z: Math.random() - 0.5,
        },
        true,
      );
    }
  };

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <Physics debug>
        <RigidBody colliders="ball">
          <mesh castShadow position={[0, 4, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        <RigidBody ref={cubeRef}>
          <mesh castShadow position={[2, 2, 0]} onClick={cubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed">
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  );
}
