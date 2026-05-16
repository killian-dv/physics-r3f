# Fun and Simple Portfolio with R3F — Three.js Journey

Quick recap of what I learned in the **Fun and Simple Portfolio with R3F** lesson from [Three.js Journey](https://threejsjourney.com/) by Bruno Simon, implemented with **React Three Fiber**.

## What this project covers

This project is a small 3D portfolio scene built with R3F and **Drei** helpers: loading a GLTF model, embedding real web content on the screen, and polishing the presentation with lighting, shadows, and controls.

- **`useGLTF`** to load the MacBook model from the course resources.
- **`Environment`** for image-based lighting (`preset="city"`).
- **`PresentationControls`** for drag-to-rotate interaction with damping and snap.
- **`Float`** for subtle idle motion on the laptop group.
- **`rectAreaLight`** to simulate light coming from the screen.
- **`Html`** with `transform` to map an `<iframe>` onto the laptop display.
- **`Text`** with a custom `.woff` font for a 3D name label.
- **`ContactShadows`** for a grounded contact shadow under the model.
- **Canvas `className` + CSS** (`touch-action: none`) so touch gestures work correctly on mobile.

## What I built

- A full-screen **R3F `Canvas`** with a perspective camera (`fov: 45`, positioned to frame the laptop).
- A dark **background color** (`#241a1a`) to keep focus on the model.
- A **MacBook GLTF** loaded via `useGLTF`, slightly lowered on the Y axis.
- **`PresentationControls`** wrapping the laptop:
  - `global` rotation limits (`rotation`, `polar`, `azimuth`).
  - `damping={0.1}` and `snap` for smooth, satisfying interaction.
- A **`Float`** group with `rotationIntensity={0.4}` for gentle movement.
- A **`rectAreaLight`** above the screen area to brighten the display realistically.
- An **`Html`** overlay on the laptop screen:
  - `transform` + `distanceFactor` so the DOM scales with the 3D view.
  - `wrapperClass="html-content"` for iframe styling in CSS.
  - An **`<iframe>`** pointing to my portfolio site.
- **`Text`** (“Killian David”) using the Bangers font, positioned beside the laptop.
- **`ContactShadows`** under the model (`opacity`, `scale`, `blur` tuned for a soft ground shadow).

## What I learned

### 1) Why a 3D portfolio wrapper

- A portfolio is often your most important project—it should show what you can build.
- If you already have an HTML/CSS portfolio, you can **reuse it** inside a 3D scene instead of rebuilding everything in WebGL.
- A laptop model + embedded page is a memorable way to present projects without abandoning familiar web tech.

### 2) Finding and loading a model

- Free models ready for R3F are listed on [PMNDRS Market](https://market.pmnd.rs/) (e.g. the MacBook model).
- **`useGLTF(url)`** loads the file and gives a scene you can render with `<primitive object={computer.scene} />`.
- If the market is unavailable, the course provides a fallback URL:  
  `https://threejs-journey.com/resources/models/macbook_model.gltf`

### 3) Scene mood and lighting

- A **`color`** attached to `"background"` sets the canvas clear color and sets the tone of the experience.
- **`Environment`** adds realistic reflections and ambient light from an HDR preset without hand-placing many lights.
- A **`rectAreaLight`** near the screen mimics emissive light from the display and sells the “lit screen” look.

### 4) Presentation controls

- **`PresentationControls`** (Drei) lets users rotate the model with pointer or touch—more engaging than static `OrbitControls` for a product-style showcase.
- **`polar`** and **`azimuth`** clamp how far the user can orbit.
- **`damping`** controls how snappy the motion feels (lower = slower settle).
- **`snap`** returns the model to a rest pose when interaction ends.

### 5) Embedding HTML in the 3D world

- Drei’s **`Html`** component can render DOM (including **`<iframe>`**) inside the scene.
- With **`transform`**, the HTML plane follows the laptop screen’s position and rotation in 3D.
- **`distanceFactor`** scales the DOM so it stays readable as the camera moves.
- **`wrapperClass`** links to regular CSS (iframe size, border-radius, etc.) in `index.css`.

### 6) Typography and polish

- **`Text`** renders 3D type with a loaded font file (`font`, `fontSize`, `maxWidth`, `textAlign`).
- **`ContactShadows`** adds a cheap, convincing shadow on an invisible ground plane—no custom shadow setup required.
- **`Float`** adds light procedural motion so the scene feels alive without complex animation code.

### 7) Mobile and touch

- On recent Drei versions, set **`className`** on `<Canvas>` and use **`touch-action: none`** in CSS on that class so drag gestures on the model are not swallowed by the browser’s default touch behavior.

### 8) Tweaking values

- Placement of lights, iframe, text, and controls is mostly **trial and error**.
- The lesson recommends a debug UI like **Leva** when building your own variant; this repo uses fixed values from the course.

## Run the project

```bash
npm install
npm run dev
```

## Credits

Part of the **Three.js Journey** course by Bruno Simon.
