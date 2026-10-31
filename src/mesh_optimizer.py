from pathlib import Path
import json
import numpy as np
import trimesh


PROJECT_ROOT = Path(__file__).resolve().parents[1]

INPUT_FILE = (
    PROJECT_ROOT
    / "outputs"
    / "reconstruction"
    / "structural_reconstruction.glb"
)

OUTPUT_DIR = PROJECT_ROOT / "outputs" / "optimized_mesh"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def optimize_mesh():

    print("\nLOADING GENERATED 3D MODEL...")

    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Reconstruction file not found: {INPUT_FILE}"
        )

    loaded = trimesh.load(INPUT_FILE, force="scene")

    if isinstance(loaded, trimesh.Scene):

        meshes = [
            geometry.copy()
            for geometry in loaded.geometry.values()
            if isinstance(geometry, trimesh.Trimesh)
        ]

        if not meshes:
            raise ValueError("No valid mesh geometry found.")

        mesh = trimesh.util.concatenate(meshes)

    elif isinstance(loaded, trimesh.Trimesh):
        mesh = loaded.copy()

    else:
        raise TypeError("Unsupported 3D model format.")

    print("MODEL LOADED!")
    print("Original vertices:", len(mesh.vertices))
    print("Original faces:", len(mesh.faces))

    print("\nOPTIMIZING MESH...")

    mesh.merge_vertices()

    mesh.update_faces(mesh.unique_faces())

    mesh.update_faces(mesh.nondegenerate_faces())

    mesh.remove_unreferenced_vertices()

    mesh.fix_normals()

    valid_coordinates = bool(
        len(mesh.vertices) > 0
        and len(mesh.faces) > 0
        and np.isfinite(mesh.vertices).all()
    )

    if not valid_coordinates:
        raise ValueError("Mesh contains invalid coordinates.")

    print("MESH OPTIMIZATION COMPLETED!")

    glb_path = OUTPUT_DIR / "optimized_model.glb"
    obj_path = OUTPUT_DIR / "optimized_model.obj"
    report_path = OUTPUT_DIR / "mesh_optimization_report.json"

    print("\nEXPORTING OPTIMIZED MODEL...")

    mesh.export(glb_path)
    mesh.export(obj_path)

    report = {
        "input_file": str(INPUT_FILE),
        "vertices": int(len(mesh.vertices)),
        "faces": int(len(mesh.faces)),
        "is_watertight": bool(mesh.is_watertight),
        "is_winding_consistent": bool(mesh.is_winding_consistent),
        "valid_coordinates": valid_coordinates,
        "bounds": mesh.bounds.tolist(),
        "exports": {
            "glb": str(glb_path),
            "obj": str(obj_path)
        }
    }

    with open(report_path, "w", encoding="utf-8") as file:
        json.dump(report, file, indent=4)

    print("\nOPTIMIZATION RESULTS:")
    print("Vertices:", len(mesh.vertices))
    print("Faces:", len(mesh.faces))
    print("Watertight:", mesh.is_watertight)
    print("GLB:", glb_path)
    print("OBJ:", obj_path)
    print("Report:", report_path)

    print("\nMESH OPTIMIZER COMPLETED!")

    return glb_path


if __name__ == "__main__":
    optimize_mesh()