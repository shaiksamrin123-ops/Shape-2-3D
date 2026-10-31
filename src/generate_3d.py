
import subprocess
import sys
import uuid
import numpy as np
import trimesh
import torch

from pathlib import Path
from PIL import Image

PROJECT = Path(__file__).resolve().parents[1]
TRIPOSR = PROJECT / "models" / "TripoSR"
OUTPUT_ROOT = PROJECT / "outputs" / "generated"

OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)


def generate_3d(input_image):

    run_id = uuid.uuid4().hex[:8]
    run_folder = OUTPUT_ROOT / run_id
    run_folder.mkdir(parents=True, exist_ok=True)

    if isinstance(input_image, (str, Path)):
        image = Image.open(input_image).convert("RGB")
    elif isinstance(input_image, np.ndarray):
        image = Image.fromarray(input_image.astype("uint8")).convert("RGB")
    else:
        image = input_image.convert("RGB")

    image_path = run_folder / "input.png"
    image.save(image_path)

    device = "cuda:0" if torch.cuda.is_available() else "cpu"

    command = [
        sys.executable,
        "run.py",
        str(image_path),
        "--device", device,
        "--chunk-size", "1024",
        "--mc-resolution", "128",
        "--output-dir", str(run_folder),
        "--model-save-format", "obj"
    ]

    result = subprocess.run(
        command,
        cwd=TRIPOSR,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        raise RuntimeError(
            "TripoSR generation failed:\n" + result.stderr[-4000:]
        )

    obj_path = run_folder / "0" / "mesh.obj"

    if not obj_path.exists():
        raise FileNotFoundError("Generated OBJ mesh not found!")

    mesh = trimesh.load_mesh(str(obj_path), file_type="obj")

    glb_path = run_folder / "mesh.glb"
    glb_path.write_bytes(mesh.export(file_type="glb"))

    if not glb_path.exists() or glb_path.stat().st_size == 0:
        raise RuntimeError("GLB export failed!")

    print("3D GENERATION SUCCESSFUL!")
    print("GPU:", device)
    print("Vertices:", len(mesh.vertices))
    print("Faces:", len(mesh.faces))
    print("OBJ:", obj_path)
    print("GLB:", glb_path)

    return str(glb_path)
