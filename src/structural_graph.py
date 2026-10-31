
from pathlib import Path
import json
import math

import networkx as nx
import matplotlib.pyplot as plt


# ==========================================
# PROJECT PATHS
# ==========================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

INPUT_FILE = (
    PROJECT_ROOT
    / "outputs"
    / "features"
    / "geometric_features_v2.json"
)

OUTPUT_DIR = PROJECT_ROOT / "outputs" / "structural_graph"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ==========================================
# DISTANCE CALCULATION
# ==========================================

def calculate_distance(point_a, point_b):

    return math.sqrt(
        (point_a[0] - point_b[0]) ** 2
        +
        (point_a[1] - point_b[1]) ** 2
    )


# ==========================================
# STRUCTURAL GRAPH GENERATION
# ==========================================

def build_structural_graph():

    print("\nSTARTING STRUCTURAL GRAPH GENERATION...")

    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Feature file not found: {INPUT_FILE}"
        )

    with open(
        INPUT_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        data = json.load(file)

    lines = data["lines"]

    graph = nx.Graph()

    # ======================================
    # 1. CREATE LINE NODES
    # ======================================

    for index, line in enumerate(lines):

        graph.add_node(
            index,
            start=line["start"],
            end=line["end"],
            length=line["length"],
            angle=line["angle_degrees"]
        )

    # ======================================
    # 2. CONNECT RELATED LINES
    # ======================================

    connection_threshold = 15

    for i in range(len(lines)):

        for j in range(i + 1, len(lines)):

            line_a = lines[i]
            line_b = lines[j]

            endpoints_a = [
                line_a["start"],
                line_a["end"]
            ]

            endpoints_b = [
                line_b["start"],
                line_b["end"]
            ]

            minimum_distance = min(
                calculate_distance(a, b)
                for a in endpoints_a
                for b in endpoints_b
            )

            if minimum_distance <= connection_threshold:

                graph.add_edge(
                    i,
                    j,
                    distance=round(
                        minimum_distance, 2
                    )
                )

    # ======================================
    # 3. GRAPH STATISTICS
    # ======================================

    node_count = graph.number_of_nodes()
    edge_count = graph.number_of_edges()

    components = list(
        nx.connected_components(graph)
    )

    # ======================================
    # 4. SAVE GRAPH DATA
    # ======================================

    graph_data = nx.node_link_data(graph)

    graph_path = (
        OUTPUT_DIR / "structural_graph.json"
    )

    with open(
        graph_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            graph_data,
            file,
            indent=4
        )

    # ======================================
    # 5. VISUALIZE GRAPH
    # ======================================

    plt.figure(figsize=(12, 9))

    positions = nx.spring_layout(
        graph,
        seed=42
    )

    nx.draw_networkx(
        graph,
        positions,
        node_size=250,
        font_size=8,
        with_labels=True
    )

    plt.title(
        "Sketch Structural Relationship Graph"
    )

    plt.axis("off")

    graph_image = (
        OUTPUT_DIR / "structural_graph.png"
    )

    plt.savefig(
        graph_image,
        dpi=200,
        bbox_inches="tight"
    )

    plt.close()

    # ======================================
    # 6. RESULTS
    # ======================================

    print("\n===== STRUCTURAL GRAPH RESULTS =====")

    print("Total line nodes:", node_count)
    print("Connected relationships:", edge_count)
    print("Connected components:", len(components))

    print("\nOUTPUT FILES:")
    print("Graph data:", graph_path)
    print("Graph image:", graph_image)

    print("\nSTRUCTURAL GRAPH GENERATION COMPLETED!")

    return graph


# ==========================================
# MAIN EXECUTION
# ==========================================

if __name__ == "__main__":

    build_structural_graph()
