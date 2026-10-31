# Sketch-to-3D

AI-powered image-to-3D generation using TripoSR.

## Member 1 – AI Model

### Features
- Image-to-3D generation
- CUDA GPU acceleration
- OBJ mesh export
- GLB export
- Mesh validation
- Reusable generate_3d(input_image) function

## Project Structure

- src/generate_3d.py
- inputs/
- outputs/
- models/
- tests/
- requirements.txt
- README.md

## Requirements

- Python 3.11
- NVIDIA GPU recommended
- CUDA-compatible PyTorch
- TripoSR repository

## Setup

Clone TripoSR inside models/TripoSR.

Install dependencies:

pip install -r requirements.txt

Install PyTorch compatible with your CUDA version.

## Usage

from src.generate_3d import generate_3d

glb_path = generate_3d(input_image)

The function returns the generated GLB file path.
The OBJ file is also saved in the generation folder.

## Testing

Five TripoSR sample images were tested:
- Chair
- Flamingo
- Hamburger
- Horse
- Robot

All five GLB files passed vertex-coordinate and face-index validation.

Note: These were sample images, not independently hand-drawn sketches.

## Member 1 Handover

The generate_3d.py module is intended for integration into Member 2's Gradio application.
