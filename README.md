# SKETCH2SHAPE AI
### From 2D Sketches to 3D Models

## About Our Project

SKETCH2SHAPE AI is a project we are developing as part of TechZephyr 4.0 at IIT Bhubaneswar.

Our main idea is to make basic 3D model creation easier for beginners. Instead of learning complicated 3D modelling software, users can provide a sketch, upload an image, or describe an object using text.

We are exploring how AI and 3D technologies can help convert these inputs into 3D models.

## Features

Our application is designed with the following features:

- **Sketch to 3D:** Draw an object using the drawing canvas.
- **Image to 3D:** Upload an existing image.
- **Text to 3D:** Enter a description of the object.
- **3D Preview:** View the generated model and rotate or zoom it.
- **Customisation:** Adjust model height, width and colour.
- **GLB Download:** Download the 3D model in GLB format.
- **History:** View previously generated models.
- **About Us:** Learn about our project and team.

Some features are still under development and are being tested.

## How It Works

Our planned workflow is:

1. The user selects an input method.
2. The user draws a sketch, uploads an image or enters a description.
3. The application processes the input.
4. An image-to-3D model is used for sketch and image reconstruction.
5. The generated 3D model is displayed in the application.
6. The user can customise and download the model.

## Technologies We Use

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| TypeScript | Application development |
| Vite | Running and building the frontend |
| Three.js | Displaying 3D models |
| Python | Backend development |
| PyTorch | Running deep learning models |
| TripoSR | Image-to-3D reconstruction |
| Trimesh | 3D mesh processing and validation |

## AI Tools and Models

- **TripoSR:** Selected for image-to-3D reconstruction.
- **Gemini:** Used as an AI-assisted tool during project planning and development.

Gemini is not our 3D reconstruction model.

## Datasets

We have not currently added a separate dataset collected by our team. The project uses the selected pretrained model for its reconstruction workflow.

## Current Development Status

We are working on connecting the website with the Python-based 3D reconstruction pipeline.

Our current challenges include:

- Improving the quality of generated 3D models.
- Making the generated model closer to the input sketch.
- Connecting the frontend and Python backend correctly.
- Testing the GLB export and download process.
- Improving the overall user experience.

## Running the Frontend Locally

### Requirements
- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/shaiksamrin123-ops/Shape-2-3D.git
cd Shape-2-3D
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## Project Structure

```text
Shape-2-3D/
│
├── src/
│   ├── components/
│   │   ├── inputs/
│   │   ├── Home.tsx
│   │   ├── Explore.tsx
│   │   ├── ModelViewer.tsx
│   │   ├── History.tsx
│   │   └── AboutUs.tsx
│   │
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
│
├── backend/
│   └── generate_3d.py
│
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## Future Improvements

- Improve 3D reconstruction quality.
- Complete the TripoSR backend integration.
- Improve GLB generation and downloading.
- Develop text-to-3D functionality.
- Improve the similarity between input sketches and generated models.

## Our Goal

Through SKETCH2SHAPE AI, we want to explore a simpler way for beginners to turn their ideas and drawings into 3D models.

**Built with our team effort for TechZephyr 4.0 – IIT Bhubaneswar.**
