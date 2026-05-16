import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import { Euler, Quaternion } from "three";

export function Experience() {
  const cube = useRef<RapierRigidBody>(null);
  const twister = useRef<RapierRigidBody>(null);

  const cubeJump = () => {
    if (cube.current) {
      cube.current.applyImpulse({ x: 0, y: 5, z: 0 }, true);
      cube.current.applyTorqueImpulse(
        {
          x: Math.random() - 0.5,
          y: Math.random() - 0.5,
          z: Math.random() - 0.5,
        },
        true,
      );
    }
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const eulerRotation = new Euler(0, time * 3, 0);
    const quaternionRotation = new Quaternion().setFromEuler(eulerRotation);
    if (twister.current) {
      twister.current.setNextKinematicRotation(quaternionRotation);
    }

    const angle = time * 0.5;
    const x = Math.cos(angle) * 2;
    const z = Math.sin(angle) * 2;
    if (twister.current) {
      twister.current.setNextKinematicTranslation({ x, y: -0.8, z });
    }
  });

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <Physics debug>
        <RigidBody colliders="ball">
          <mesh castShadow position={[-1.5, 4, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        <RigidBody ref={cube} colliders={false} position={[2, 2, 0]}>
          <mesh castShadow onClick={cubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
          <CuboidCollider mass={2} args={[0.5, 0.5, 0.5]} />
        </RigidBody>

        <RigidBody type="fixed">
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={twister}
          position={[0, -0.8, 0]}
          friction={0}
          type="kinematicPosition"
        >
          <mesh castShadow scale={[0.4, 0.4, 3]}>
            <boxGeometry />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  );
}
