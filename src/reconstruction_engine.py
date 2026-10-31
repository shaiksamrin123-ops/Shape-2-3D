from pathlib import Path
import json
import numpy as np
import trimesh


PROJECT_ROOT = Path(__file__).resolve().parents[1]

GRAPH_FILE = PROJECT_ROOT / "outputs" / "structural_graph" / "structural_graph.json"
FEATURE_FILE = PROJECT_ROOT / "outputs" / "features" / "geometric_features_v2.json"
PARTS_FILE = PROJECT_ROOT / "outputs" / "part_recognition" / "recognized_parts.json"
SPATIAL_FILE = PROJECT_ROOT / "outputs" / "spatial_reasoning" / "spatial_analysis.json"

OUTPUT_DIR = PROJECT_ROOT / "outputs" / "reconstruction"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def load_json(path):
    if not path.exists():
        raise FileNotFoundError(f"Required file not found: {path}")

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def get_sketch_bounds(nodes):
    points = []

    for node in nodes:
        points.append(node["start"])
        points.append(node["end"])

    points = np.asarray(points, dtype=float)

    minimum = points.min(axis=0)
    maximum = points.max(axis=0)

    width = max(maximum[0] - minimum[0], 1)
    height = max(maximum[1] - minimum[1], 1)

    return minimum, maximum, width, height


def create_line_geometry(nodes, minimum, width, height):
    """
    Convert detected 2D sketch lines into thin 3D visual elements.
    These elements represent the detected sketch structure,
    not a semantically verified object model.
    """

    scene = trimesh.Scene()

    scale = 2.0 / max(width, height)

    for index, node in enumerate(nodes):

        start = np.asarray(node["start"], dtype=float)
        end = np.asarray(node["end"], dtype=float)

        start_3d = np.array([
            (start[0] - minimum[0]) * scale - 1.0,
            1.0 - (start[1] - minimum[1]) * scale,
            0.0
        ])

        end_3d = np.array([
            (end[0] - minimum[0]) * scale - 1.0,
            1.0 - (end[1] - minimum[1]) * scale,
            0.0
        ])

        direction = end_3d - start_3d
        length = np.linalg.norm(direction)

        if length < 0.001:
            continue

        midpoint = (start_3d + end_3d) / 2

        cylinder = trimesh.creation.cylinder(
            radius=0.004,
            height=length,
            sections=8
        )

        cylinder.apply_transform(
            trimesh.geometry.align_vectors(
                [0, 0, 1],
                direction / length
            )
        )

        cylinder.apply_translation(midpoint)

        scene.add_geometry(
            cylinder,
            node_name=f"sketch_line_{index}"
        )

    return scene


def create_reconstruction():

    print("\nLOADING SKETCH STRUCTURE...")

    graph_data = load_json(GRAPH_FILE)
    feature_data = load_json(FEATURE_FILE)
    parts_data = load_json(PARTS_FILE)
    spatial_data = load_json(SPATIAL_FILE)

    nodes = graph_data.get("nodes", [])

    if not nodes:
        raise ValueError("No structural lines found in graph data.")

    print("STRUCTURAL DATA LOADED!")

    print("\nANALYSING RECONSTRUCTION INPUT...")

    minimum, maximum, width, height = get_sketch_bounds(nodes)

    part_count = len(parts_data.get("parts", []))

    print("Detected structural lines:", len(nodes))
    print("Recognized structural groups:", part_count)
    print("Sketch width:", round(width, 2))
    print("Sketch height:", round(height, 2))

    print("\nBUILDING 3D STRUCTURAL REPRESENTATION...")

    scene = create_line_geometry(
        nodes,
        minimum,
        width,
        height
    )

    if len(scene.geometry) == 0:
        raise RuntimeError("Could not generate 3D structural geometry.")

    print("3D STRUCTURE GENERATED!")

    glb_path = OUTPUT_DIR / "structural_reconstruction.glb"
    obj_path = OUTPUT_DIR / "structural_reconstruction.obj"
    report_path = OUTPUT_DIR / "reconstruction_report.json"

    print("\nEXPORTING 3D MODEL...")

    scene.export(glb_path)

    combined_mesh = trimesh.util.concatenate(
        tuple(scene.geometry.values())
    )

    combined_mesh.export(obj_path)

    report = {
        "reconstruction_type": "2D_structural_line_to_3D",
        "method": "geometric_line_extrusion",
        "input_lines": len(nodes),
        "structural_groups": part_count,
        "generated_geometry_count": len(scene.geometry),
        "sketch_bounds": {
            "width": float(width),
            "height": float(height)
        },
        "depth_estimation": "not_estimated",
        "semantic_object_recognition": "not_verified",
        "outputs": {
            "glb": str(glb_path),
            "obj": str(obj_path)
        }
    }

    with open(report_path, "w", encoding="utf-8") as file:
        json.dump(report, file, indent=4)

    print("\nRECONSTRUCTION RESULTS:")
    print("Generated geometries:", len(scene.geometry))
    print("GLB:", glb_path)
    print("OBJ:", obj_path)
    print("Report:", report_path)

    print("\n3D STRUCTURAL RECONSTRUCTION COMPLETED!")

    return glb_path


if __name__ == "__main__":
    create_reconstruction()