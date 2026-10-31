
from pathlib import Path
import json
import networkx as nx


PROJECT_ROOT = Path(__file__).resolve().parents[1]

GRAPH_FILE = (
    PROJECT_ROOT
    / "outputs"
    / "structural_graph"
    / "structural_graph.json"
)

PART_FILE = (
    PROJECT_ROOT
    / "outputs"
    / "part_recognition"
    / "recognized_parts.json"
)

OUTPUT_DIR = PROJECT_ROOT / "outputs" / "spatial_reasoning"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "spatial_analysis.json"


def load_json(path):

    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def get_midpoint(line):

    start = line.get("start")
    end = line.get("end")

    if start is None or end is None:
        return None

    return (
        (float(start[0]) + float(end[0])) / 2,
        (float(start[1]) + float(end[1])) / 2
    )


def calculate_bounds(lines):

    points = []

    for line in lines:

        start = line.get("start")
        end = line.get("end")

        if start is not None:
            points.append(start)

        if end is not None:
            points.append(end)

    if not points:
        return None

    return {
        "min_x": min(p[0] for p in points),
        "max_x": max(p[0] for p in points),
        "min_y": min(p[1] for p in points),
        "max_y": max(p[1] for p in points)
    }


def classify_position(x, y, bounds):

    center_x = (bounds["min_x"] + bounds["max_x"]) / 2
    center_y = (bounds["min_y"] + bounds["max_y"]) / 2

    if x < center_x:
        horizontal = "left"
    elif x > center_x:
        horizontal = "right"
    else:
        horizontal = "center"

    if y < center_y:
        vertical = "upper"
    elif y > center_y:
        vertical = "lower"
    else:
        vertical = "middle"

    return {
        "horizontal_position": horizontal,
        "vertical_position": vertical
    }


def calculate_line_relationships(lines):

    relationships = []

    for i in range(len(lines)):

        for j in range(i + 1, len(lines)):

            first = lines[i]
            second = lines[j]

            first_mid = get_midpoint(first)
            second_mid = get_midpoint(second)

            if first_mid is None or second_mid is None:
                continue

            dx = second_mid[0] - first_mid[0]
            dy = second_mid[1] - first_mid[1]

            distance = (dx ** 2 + dy ** 2) ** 0.5

            angle1 = float(first.get("angle", 0)) % 180
            angle2 = float(second.get("angle", 0)) % 180

            angle_difference = abs(angle1 - angle2)
            angle_difference = min(
                angle_difference,
                180 - angle_difference
            )

            if angle_difference <= 15:
                alignment = "approximately_parallel"

            elif 75 <= angle_difference <= 105:
                alignment = "approximately_perpendicular"

            else:
                alignment = "different_orientation"

            relationships.append({
                "line_1": first["id"],
                "line_2": second["id"],
                "midpoint_distance": round(distance, 2),
                "alignment": alignment,
                "relative_direction": (
                    "right" if dx > 0
                    else "left" if dx < 0
                    else "same_x"
                )
            })

    return relationships


def analyse_structural_parts(graph_data, part_data):

    lines = graph_data.get("nodes", [])

    if not lines:
        raise ValueError("No line segments found in structural graph.")

    image_bounds = calculate_bounds(lines)

    if image_bounds is None:
        raise ValueError("Could not calculate sketch boundaries.")

    parts = part_data.get("recognized_parts", [])

    part_positions = []

    for part in parts:

        center = part.get("center", {})

        x = center.get("x")
        y = center.get("y")

        if x is None or y is None:
            continue

        position = classify_position(
            x,
            y,
            image_bounds
        )

        part_positions.append({
            "part_id": part["part_id"],
            "part_name": part["part_name"],
            "center": {
                "x": x,
                "y": y
            },
            "position": position,
            "structure_type": part["structure_type"]
        })

    relationships = calculate_line_relationships(lines)

    graph = nx.Graph()

    for line in lines:
        graph.add_node(line["id"])

    for edge in graph_data.get("edges", []):

        source = edge.get("source")
        target = edge.get("target")

        if source in graph and target in graph:
            graph.add_edge(source, target)

    spatial_results = {
        "module": "Spatial Reasoning Engine",
        "analysis_type": "2D geometric spatial analysis",
        "sketch_bounds": image_bounds,
        "total_line_segments": len(lines),
        "part_positions": part_positions,
        "line_relationships": relationships,
        "relationship_summary": {
            "approximately_parallel": sum(
                1 for r in relationships
                if r["alignment"] == "approximately_parallel"
            ),
            "approximately_perpendicular": sum(
                1 for r in relationships
                if r["alignment"] == "approximately_perpendicular"
            ),
            "different_orientation": sum(
                1 for r in relationships
                if r["alignment"] == "different_orientation"
            )
        },
        "graph_connectivity": {
            "nodes": graph.number_of_nodes(),
            "connections": graph.number_of_edges(),
            "connected_components": nx.number_connected_components(graph)
        },
        "depth_estimation": {
            "status": "not_estimated",
            "reason": (
                "A single 2D sketch does not provide enough "
                "information for reliable depth estimation."
            )
        }
    }

    return spatial_results


def run_spatial_reasoning():

    print("\nLOADING STRUCTURAL DATA...")

    graph_data = load_json(GRAPH_FILE)
    part_data = load_json(PART_FILE)

    print("STRUCTURAL DATA LOADED!")

    print("\nANALYSING SPATIAL RELATIONSHIPS...")

    results = analyse_structural_parts(
        graph_data,
        part_data
    )

    with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
        json.dump(results, file, indent=4)

    print("\n========== SPATIAL REASONING RESULTS ==========")

    print("Line segments:", results["total_line_segments"])

    print(
        "Structural parts:",
        len(results["part_positions"])
    )

    print("\nPART POSITIONS:")

    for part in results["part_positions"]:

        print(
            part["part_name"],
            "->",
            part["position"]
        )

    print("\nLINE RELATIONSHIPS:")
    print(results["relationship_summary"])

    print("\nGRAPH CONNECTIVITY:")
    print(results["graph_connectivity"])

    print("\nDEPTH ESTIMATION:")
    print(results["depth_estimation"]["status"])

    print("\nOUTPUT FILE:")
    print(OUTPUT_FILE)

    print("\nSPATIAL REASONING COMPLETED!")


if __name__ == "__main__":
    run_spatial_reasoning()
