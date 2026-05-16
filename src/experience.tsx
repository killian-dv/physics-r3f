import { OrbitControls, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  CylinderCollider,
  InstancedRigidBodies,
  Physics,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import type { InstancedRigidBodyProps } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import { Euler, Quaternion, Vector3 } from "three";

const CUBES_COUNT = 100;

function createCubeInstances(count: number): InstancedRigidBodyProps[] {
  const instances: InstancedRigidBodyProps[] = [];
  for (let i = 0; i < count; i++) {
    instances.push({
      key: "instance_" + i,
      position: new Vector3(
        (Math.random() - 0.5) * 8,
        6 + i * 0.2,
        (Math.random() - 0.5) * 8,
      ),
      rotation: new Euler(Math.random(), Math.random(), Math.random()),
    });
  }
  return instances;
}

const cubeInstances = createCubeInstances(CUBES_COUNT);

export function Experience() {
  const cube = useRef<RapierRigidBody>(null);
  const twister = useRef<RapierRigidBody>(null);
  const hitSound = useRef<HTMLAudioElement | null>(null);

  const hamburger = useGLTF("./hamburger.glb");

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

  const collisionEnter = () => {
    hitSound.current ??= new Audio("./hit.mp3");
    const sound = hitSound.current;

    sound.currentTime = 0;
    sound.volume = Math.random();
    void sound.play();
  };

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

        <RigidBody
          ref={cube}
          colliders={false}
          position={[2, 2, 0]}
          onCollisionEnter={collisionEnter}
        >
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

        <RigidBody position={[0, 4, 0]} colliders={false}>
          <primitive object={hamburger.scene} scale={0.25} />
          <CylinderCollider args={[0.5, 1.25]} />
        </RigidBody>

        <RigidBody type="fixed">
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
        </RigidBody>

        <InstancedRigidBodies instances={cubeInstances}>
          <instancedMesh
            args={[undefined, undefined, CUBES_COUNT]}
            castShadow
            receiveShadow
          >
            <boxGeometry />
            <meshStandardMaterial color="tomato" />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  );
}
