from pathlib import Path
import json
import numpy as np
import trimesh


PROJECT_ROOT = Path(__file__).resolve().parents[1]

MODEL_FILES = {
    "structural_glb": (
        PROJECT_ROOT / "outputs" / "reconstruction"
        / "structural_reconstruction.glb"
    ),
    "optimized_glb": (
        PROJECT_ROOT / "outputs" / "optimized_mesh"
        / "optimized_model.glb"
    ),
    "optimized_obj": (
        PROJECT_ROOT / "outputs" / "optimized_mesh"
        / "optimized_model.obj"
    )
}

OUTPUT_DIR = PROJECT_ROOT / "outputs" / "validation"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def load_mesh(file_path):

    loaded = trimesh.load(file_path, force="scene")

    if isinstance(loaded, trimesh.Scene):
        meshes = [
            geometry
            for geometry in loaded.geometry.values()
            if isinstance(geometry, trimesh.Trimesh)
        ]

        if not meshes:
            raise ValueError("No mesh geometry found.")

        return trimesh.util.concatenate(meshes)

    if isinstance(loaded, trimesh.Trimesh):
        return loaded

    raise TypeError("Unsupported model format.")


def validate_model(name, file_path):

    print(f"\nVALIDATING: {name}")

    if not file_path.exists():
        return {
            "file": str(file_path),
            "status": "FILE_NOT_FOUND"
        }

    try:
        mesh = load_mesh(file_path)

        valid_coordinates = bool(
            len(mesh.vertices) > 0
            and np.isfinite(mesh.vertices).all()
        )

        valid_faces = bool(
            len(mesh.faces) > 0
            and mesh.faces.min() >= 0
            and mesh.faces.max() < len(mesh.vertices)
        )

        result = {
            "file": str(file_path),
            "file_size_kb": round(
                file_path.stat().st_size / 1024, 2
            ),
            "vertices": int(len(mesh.vertices)),
            "faces": int(len(mesh.faces)),
            "valid_coordinates": valid_coordinates,
            "valid_face_indices": valid_faces,
            "watertight": bool(mesh.is_watertight),
            "winding_consistent": bool(
                mesh.is_winding_consistent
            ),
            "bounds": mesh.bounds.tolist(),
            "status": (
                "VALID"
                if valid_coordinates and valid_faces
                else "INVALID"
            )
        }

        print("Vertices:", result["vertices"])
        print("Faces:", result["faces"])
        print("Valid coordinates:", valid_coordinates)
        print("Valid face indices:", valid_faces)
        print("Watertight:", result["watertight"])
        print("Status:", result["status"])

        return result

    except Exception as error:

        print("VALIDATION ERROR:", error)

        return {
            "file": str(file_path),
            "status": "ERROR",
            "error": str(error)
        }


def main():

    print("\n========== 3D MODEL VALIDATION ==========")

    results = {}

    for name, file_path in MODEL_FILES.items():
        results[name] = validate_model(name, file_path)

    report_path = OUTPUT_DIR / "validation_report.json"

    with open(report_path, "w", encoding="utf-8") as file:
        json.dump(results, file, indent=4)

    valid_count = sum(
        1 for result in results.values()
        if result["status"] == "VALID"
    )

    print("\n========== FINAL SUMMARY ==========")
    print("Models checked:", len(results))
    print("Valid models:", valid_count)
    print("Invalid / missing models:", len(results) - valid_count)
    print("Report:", report_path)

    print("\n3D MODEL VALIDATION COMPLETED!")


if __name__ == "__main__":
    main()