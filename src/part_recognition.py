
from pathlib import Path
import json
import networkx as nx
from collections import Counter


PROJECT_ROOT = Path(__file__).resolve().parents[1]

GRAPH_FILE = (
    PROJECT_ROOT
    / "outputs"
    / "structural_graph"
    / "structural_graph.json"
)

OUTPUT_DIR = PROJECT_ROOT / "outputs" / "part_recognition"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "recognized_parts.json"


def load_json(path):

    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def build_graph(data):

    graph = nx.Graph()

    nodes = data.get("nodes", [])
    edges = data.get("edges", [])

    for node in nodes:

        node_id = node["id"]

        graph.add_node(
            node_id,
            **{
                key: value
                for key, value in node.items()
                if key != "id"
            }
        )

    for edge in edges:

        source = edge.get("source")
        target = edge.get("target")

        if source in graph and target in graph:
            graph.add_edge(source, target)

    return graph


def classify_orientation(angle):

    angle = float(angle) % 180

    if angle <= 15 or angle >= 165:
        return "horizontal"

    elif 75 <= angle <= 105:
        return "vertical"

    return "diagonal"


def get_midpoint(attributes):

    start = attributes.get("start")
    end = attributes.get("end")

    if start is None or end is None:
        return None

    return (
        (float(start[0]) + float(end[0])) / 2,
        (float(start[1]) + float(end[1])) / 2
    )


def analyse_component(graph, component, group_number):

    subgraph = graph.subgraph(component)

    orientations = []
    lengths = []
    positions = []

    for node_id in component:

        attributes = graph.nodes[node_id]

        angle = attributes.get("angle")

        if angle is not None:
            orientations.append(
                classify_orientation(angle)
            )

        length = attributes.get("length")

        if length is not None:
            lengths.append(float(length))

        midpoint = get_midpoint(attributes)

        if midpoint is not None:
            positions.append(midpoint)

    orientation_counts = Counter(orientations)

    horizontal = orientation_counts.get("horizontal", 0)
    vertical = orientation_counts.get("vertical", 0)
    diagonal = orientation_counts.get("diagonal", 0)

    if horizontal > 0 and vertical > 0 and diagonal > 0:
        structure_type = "mixed_geometric_structure"

    elif horizontal > 0 and vertical > 0:
        structure_type = "rectilinear_structure"

    elif diagonal > 0:
        structure_type = "angled_structure"

    elif horizontal > 0:
        structure_type = "horizontal_structure"

    elif vertical > 0:
        structure_type = "vertical_structure"

    else:
        structure_type = "unclassified_structure"

    if positions:

        center_x = sum(p[0] for p in positions) / len(positions)
        center_y = sum(p[1] for p in positions) / len(positions)

        bounds = {
            "min_x": min(p[0] for p in positions),
            "max_x": max(p[0] for p in positions),
            "min_y": min(p[1] for p in positions),
            "max_y": max(p[1] for p in positions)
        }

    else:

        center_x = None
        center_y = None
        bounds = None

    return {
        "part_id": group_number,
        "part_name": f"Structural Part {group_number}",
        "structure_type": structure_type,
        "line_count": subgraph.number_of_nodes(),
        "connection_count": subgraph.number_of_edges(),
        "orientation_counts": {
            "horizontal": horizontal,
            "vertical": vertical,
            "diagonal": diagonal
        },
        "average_line_length": (
            round(sum(lengths) / len(lengths), 2)
            if lengths else None
        ),
        "center": {
            "x": round(center_x, 2) if center_x is not None else None,
            "y": round(center_y, 2) if center_y is not None else None
        },
        "bounding_region": bounds
    }


def recognize_parts():

    print("\nLOADING STRUCTURAL GRAPH...")

    data = load_json(GRAPH_FILE)

    graph = build_graph(data)

    if graph.number_of_nodes() == 0:
        raise ValueError("Structural graph contains no nodes.")

    print("STRUCTURAL GRAPH LOADED!")
    print("Graph nodes:", graph.number_of_nodes())
    print("Graph connections:", graph.number_of_edges())

    print("\nRECOGNIZING STRUCTURAL PARTS...")

    components = sorted(
        nx.connected_components(graph),
        key=len,
        reverse=True
    )

    recognized_parts = []

    for index, component in enumerate(components, start=1):

        part = analyse_component(
            graph,
            component,
            index
        )

        recognized_parts.append(part)

    results = {
        "module": "Part Recognition Engine",
        "analysis_type": "Rule-based structural part estimation",
        "total_structural_parts": len(recognized_parts),
        "recognized_parts": recognized_parts,
        "interpretation_limit": (
            "These are geometric structural groups, "
            "not confirmed semantic object parts."
        )
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
        json.dump(results, file, indent=4)

    print("\n========== PART RECOGNITION RESULTS ==========")

    print("Total structural parts:", len(recognized_parts))

    for part in recognized_parts:

        print(f"\n{part['part_name']}")
        print("Structure type:", part["structure_type"])
        print("Lines:", part["line_count"])
        print("Connections:", part["connection_count"])
        print("Orientations:", part["orientation_counts"])

    print("\nOUTPUT FILE:")
    print(OUTPUT_FILE)

    print("\nPART RECOGNITION COMPLETED!")


if __name__ == "__main__":
    recognize_parts()
