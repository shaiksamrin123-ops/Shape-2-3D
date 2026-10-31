
from pathlib import Path
import json
import math
import networkx as nx
from collections import Counter


PROJECT_ROOT = Path(__file__).resolve().parents[1]

INPUT_FILE = (
    PROJECT_ROOT
    / "outputs"
    / "structural_graph"
    / "structural_graph.json"
)

OUTPUT_DIR = PROJECT_ROOT / "outputs" / "understanding"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "sketch_understanding.json"


def load_graph_data():

    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Structural graph not found: {INPUT_FILE}"
        )

    with open(INPUT_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    return data


def extract_graph(data):

    graph = nx.Graph()

    nodes = data.get("nodes", [])
    edges = data.get("edges", data.get("links", []))

    for index, node in enumerate(nodes):

        if isinstance(node, dict):

            node_id = node.get("id", index)

            graph.add_node(
                node_id,
                **{
                    key: value
                    for key, value in node.items()
                    if key != "id"
                }
            )

        else:
            graph.add_node(node)

    for edge in edges:

        if isinstance(edge, dict):

            source = edge.get("source")
            target = edge.get("target")

        elif isinstance(edge, (list, tuple)) and len(edge) >= 2:

            source, target = edge[0], edge[1]

        else:
            continue

        if source in graph and target in graph:
            graph.add_edge(source, target)

    return graph


def classify_orientation(angle):

    angle = float(angle) % 180

    if angle <= 15 or angle >= 165:
        return "horizontal"

    elif 75 <= angle <= 105:
        return "vertical"

    else:
        return "diagonal"


def analyse_line_patterns(graph):

    orientations = []

    for _, attributes in graph.nodes(data=True):

        angle = attributes.get("angle")

        if angle is not None:
            orientations.append(
                classify_orientation(angle)
            )

    counts = Counter(orientations)

    return {
        "horizontal_lines": counts.get("horizontal", 0),
        "vertical_lines": counts.get("vertical", 0),
        "diagonal_lines": counts.get("diagonal", 0),
        "orientation_distribution": dict(counts)
    }


def analyse_structural_groups(graph):

    groups = []

    components = list(nx.connected_components(graph))

    for index, component in enumerate(components, start=1):

        subgraph = graph.subgraph(component)

        groups.append({
            "group_id": index,
            "line_count": subgraph.number_of_nodes(),
            "connections": subgraph.number_of_edges(),
            "is_connected": nx.is_connected(subgraph),
            "contains_cycle": (
                len(nx.cycle_basis(subgraph)) > 0
            ),
            "nodes": list(component)
        })

    return groups


def identify_patterns(graph, line_analysis):

    patterns = []

    horizontal = line_analysis["horizontal_lines"]
    vertical = line_analysis["vertical_lines"]
    diagonal = line_analysis["diagonal_lines"]

    if horizontal > 0:
        patterns.append("Horizontal line structures detected")

    if vertical > 0:
        patterns.append("Vertical line structures detected")

    if diagonal > 0:
        patterns.append("Diagonal line structures detected")

    cycles = nx.cycle_basis(graph)

    if cycles:
        patterns.append(
            f"Closed structural patterns detected: {len(cycles)}"
        )

    if horizontal >= 2 and vertical >= 2:
        patterns.append(
            "Possible rectangular or box-like structure"
        )

    if diagonal >= 2:
        patterns.append(
            "Possible triangular or angled structure"
        )

    if not patterns:
        patterns.append(
            "Insufficient geometric information for pattern classification"
        )

    return patterns


def analyse_node_connections(graph):

    degrees = dict(graph.degree())

    return {
        "total_nodes": graph.number_of_nodes(),
        "total_connections": graph.number_of_edges(),
        "isolated_nodes": sum(
            1 for degree in degrees.values() if degree == 0
        ),
        "highly_connected_nodes": sum(
            1 for degree in degrees.values() if degree >= 3
        ),
        "maximum_node_degree": max(degrees.values(), default=0)
    }


def understand_sketch():

    print("\nLOADING STRUCTURAL GRAPH...")

    data = load_graph_data()
    graph = extract_graph(data)

    if graph.number_of_nodes() == 0:
        raise ValueError(
            "No graph nodes found. Check structural_graph.json format."
        )

    print("STRUCTURAL GRAPH LOADED!")
    print("\nANALYSING SKETCH STRUCTURE...")

    line_analysis = analyse_line_patterns(graph)

    structural_groups = analyse_structural_groups(graph)

    patterns = identify_patterns(
        graph,
        line_analysis
    )

    connections = analyse_node_connections(graph)

    results = {
        "module": "Sketch Understanding Engine",
        "analysis_type": "Rule-based geometric understanding",
        "line_analysis": line_analysis,
        "structural_groups": structural_groups,
        "identified_patterns": patterns,
        "connection_analysis": connections,
        "interpretation_limit": (
            "These are geometric pattern estimates, "
            "not confirmed semantic object recognition."
        )
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as file:

        json.dump(
            results,
            file,
            indent=4
        )

    print("\n========== SKETCH UNDERSTANDING RESULTS ==========")

    print("Total graph nodes:", connections["total_nodes"])
    print("Total connections:", connections["total_connections"])

    print("\nLINE PATTERNS:")

    for name, count in line_analysis.items():

        if name != "orientation_distribution":
            print(f"{name}: {count}")

    print("\nSTRUCTURAL GROUPS:", len(structural_groups))

    print("\nIDENTIFIED PATTERNS:")

    for pattern in patterns:
        print("-", pattern)

    print("\nOUTPUT FILE:")
    print(OUTPUT_FILE)

    print("\nSKETCH UNDERSTANDING COMPLETED!")


if __name__ == "__main__":
    understand_sketch()
