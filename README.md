# Sketch-to-3D Generator

Image-to-3D generation using TripoSR, combined with computer-vision-based sketch analysis and geometric reconstruction.

## Features
- Sketch preprocessing
- Geometric feature extraction
- Structural graph generation
- Spatial analysis
- Structural 3D reconstruction
- Mesh optimization and validation
- AI-based 3D generation using TripoSR
- CUDA GPU acceleration
- OBJ and GLB export
- Hybrid pipeline

## Requirements
- Python 3.11 recommended
- NVIDIA GPU recommended
- CUDA-compatible PyTorch
- Git

## Setup

Clone this repository:

    git clone https://github.com/shaiksamrin123-ops/Shape-2-3D.git
    cd Shape-2-3D

Create environment:

    conda create -n sketch3d python=3.11 -y
    conda activate sketch3d

Install PyTorch compatible with your CUDA setup from https://pytorch.org/get-started/locally/

Install project dependencies:

    pip install -r requirements.txt

Clone TripoSR:

    git clone https://github.com/VAST-AI-Research/TripoSR models/TripoSR
    pip install -r models/TripoSR/requirements.txt

## Input
Place your sketch at `inputs/my_sketch.jpeg`.

## Running

    python src/preprocess.py
    python src/pipeline.py
    python src/hybrid_pipeline.py

## AI Generation Usage

    from src.generate_3d import generate_3d
    glb_path = generate_3d("inputs/my_sketch.jpeg")

The function returns the generated GLB path. The OBJ file is also saved.

## Testing
Five sample images (Chair, Flamingo, Hamburger, Horse, Robot) were tested with TripoSR. All five generated GLB files passed vertex-coordinate and face-index validation. These were sample images, not independently hand-drawn sketches.

## Technical Notes
- Structural analysis uses computer-vision and geometric heuristics.
- TripoSR performs learned image-to-3D reconstruction.
- The hybrid pipeline generates separate structural and AI models; it does not fuse them into one mesh.
- Generated outputs and model weights are excluded from Git.

## Member 1 Handover
The `src/generate_3d.py` module exposes `generate_3d(input_image)` for integration into Member 2\'s Gradio application.
