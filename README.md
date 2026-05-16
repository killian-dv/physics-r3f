# Physics with R3F — Three.js Journey

Quick recap of what I learned in the **Physics** lesson from [Three.js Journey](https://threejsjourney.com/) by Bruno Simon, implemented with **React Three Fiber** and **Rapier** via [`@react-three/rapier`](https://github.com/pmndrs/react-three-rapier).

## What this project covers

This project is a small physics playground: falling objects, user interaction, kinematic movers, custom colliders on a loaded model, invisible walls, and many instanced bodies for performance.

- **`@react-three/rapier`** and the **`<Physics>`** provider to run the simulation.
- **`RigidBody`** for dynamic, fixed, and kinematic objects.
- **Automatic vs manual colliders** (`colliders="ball"`, `colliders={false}` + `CuboidCollider` / `CylinderCollider`).
- **Forces and impulses** (`applyImpulse`, `applyTorqueImpulse`) triggered from React events.
- **Kinematic bodies** moved each frame with `setNextKinematicTranslation` / `setNextKinematicRotation`.
- **Collision callbacks** (`onCollisionEnter`) and simple audio feedback.
- **`useGLTF`** with a custom collider on a complex mesh.
- **`InstancedRigidBodies`** to simulate many cubes efficiently.
- **`r3f-perf`** to monitor frame cost while stress-testing instances.

## What I built

- A full-screen **R3F `Canvas`** with shadows and a perspective camera.
- A **`<Physics debug>`** world containing:
  - An **orange sphere** with an auto-generated ball collider (`colliders="ball"`).
  - A **purple cube** with a manual cuboid collider; **click** to jump (impulse + random torque).
  - A **green floor** (`type="fixed"`) that does not move.
  - A **red twister** (`type="kinematicPosition"`, `friction={0}`) that orbits and spins via `useFrame`.
  - A **hamburger GLTF** with a **cylinder collider** instead of mesh-based collision.
  - **Invisible walls** (fixed `RigidBody` + cuboid colliders only, no visible mesh).
  - **100 instanced cubes** spawned above the scene via `InstancedRigidBodies`.
- **Collision sound** on the interactive cube (`hit.mp3`, random volume).
- **`Perf`** overlay to watch performance with many rigid bodies.

## What I learned

### 1) Why physics in Three.js

- Realistic motion (gravity, collisions, stacking, bouncing) is hard to fake by hand.
- A **physics engine** integrates forces over time and resolves contacts between shapes.
- In R3F, **Rapier** (via `@react-three/rapier`) wraps the simulation in React components so bodies stay in sync with the render loop.

### 2) The Physics provider

- Wrap interactive content in **`<Physics>`** (optionally `debug` to visualize colliders).
- Rapier uses a **fixed timestep**; the library steps the world and updates `RigidBody` transforms for you.
- Enable **`shadows`** on the Canvas so `castShadow` / `receiveShadow` on meshes look correct.

### 3) RigidBody types

| Type | Role in this scene |
|------|-------------------|
| **Dynamic** (default) | Sphere, cube, hamburger, instanced cubes — affected by gravity and collisions. |
| **`fixed`** | Floor and walls — infinite mass, never moves. |
| **`kinematicPosition`** | Red twister — position/rotation driven by code each frame, still pushes dynamic objects. |

Kinematic bodies are useful for moving platforms, doors, or scripted obstacles without fighting the solver.

### 4) Colliders

- **`colliders="ball"`** (and similar shortcuts) auto-fit a primitive collider to the child mesh.
- **`colliders={false}`** disables auto colliders so you can place precise shapes:
  - **`CuboidCollider`** — boxes (half-extents in `args`).
  - **`CylinderCollider`** — capsules/cylinders (useful for burger-like shapes).
- Colliders can exist **without a visible mesh** (the arena walls).
- **`mass`** on a collider overrides default mass distribution when needed.

### 5) Forces, impulses, and interaction

- **`applyImpulse({ x, y, z }, wakeUp)`** gives an instant change in linear velocity (good for jumps).
- **`applyTorqueImpulse`** spins the body; combined with random values it feels unpredictable.
- **`onClick`** on a mesh inside a `RigidBody` is a simple way to tie UI input to physics.
- Keep a **`ref`** to `RapierRigidBody` to call these methods from event handlers or `useFrame`.

### 6) Kinematic animation in `useFrame`

- For `kinematicPosition`, set the **next** pose before the physics step:
  - **`setNextKinematicTranslation({ x, y, z })`**
  - **`setNextKinematicRotation(quaternion)`** (convert from `Euler` with `Quaternion.setFromEuler`).
- Animate with time (`state.clock.getElapsedTime()`) for circular paths and continuous rotation.
- **`friction={0}`** on the twister reduces sticking when objects slide across it.

### 7) Collisions and feedback

- **`onCollisionEnter`** fires when contact starts — useful for sounds, particles, or game logic.
- Reuse one **`Audio`** element, reset `currentTime`, vary **`volume`** for variety.
- Physics events are a bridge between the simulation and gameplay feel.

### 8) Models and complex shapes

- **`useGLTF`** loads `hamburger.glb`; the visual is a `<primitive object={scene} />`.
- Mesh-accurate collision is expensive; a **simple collider** (cylinder) approximates the model well enough.
- Scale the model in JSX; tune collider `args` to match the scaled bounds.

### 9) Performance: instanced rigid bodies

- Many duplicate objects (100 cubes) should not mean 100 separate draw-call-heavy setups without care.
- **`InstancedRigidBodies`** + **`instancedMesh`** share one mesh while each instance has its own rigid body.
- Pre-build an array of **`InstancedRigidBodyProps`** (`key`, `position`, `rotation`) for initial poses.
- Use **`Perf`** (or similar) to confirm the scene stays interactive under load.

### 10) Mental model

- **Mesh** = what you see; **Collider** = what the engine touches; they are related but not the same.
- **Dynamic** bodies “live” in the simulation; **fixed** bodies define the world; **kinematic** bodies follow your script but still affect others.
- Start with debug colliders, tune sizes, then turn debug off for the final look.

## Run the project

```bash
npm install
npm run dev
```

Click the **purple cube** to make it jump. Watch the red **twister** push objects around the arena.

## Credits

Part of the **Three.js Journey** course by Bruno Simon.
