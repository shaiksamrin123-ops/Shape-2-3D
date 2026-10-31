
from pathlib import Path
import json
import math

import cv2
import numpy as np


# ==========================================
# PROJECT PATHS
# ==========================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

INPUT_IMAGE = (
    PROJECT_ROOT
    / "outputs"
    / "analysis"
    / "edges.png"
)

OUTPUT_DIR = PROJECT_ROOT / "outputs" / "features"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ==========================================
# FEATURE EXTRACTION
# ==========================================

def extract_features():

    print("\nSTARTING FEATURE EXTRACTION V2...")

    # LOAD IMAGE
    edges = cv2.imread(
        str(INPUT_IMAGE),
        cv2.IMREAD_GRAYSCALE
    )

    if edges is None:
        raise FileNotFoundError(
            f"Cannot load edge image: {INPUT_IMAGE}"
        )

    # ======================================
    # 1. LINE DETECTION
    # ======================================

    detected = cv2.HoughLinesP(
        edges,
        rho=1,
        theta=np.pi / 180,
        threshold=25,
        minLineLength=20,
        maxLineGap=12
    )

    line_features = []

    if detected is not None:

        # Handle different OpenCV output shapes
        detected_lines = np.asarray(
            detected
        ).reshape(-1, 4)

        for line in detected_lines:

            x1, y1, x2, y2 = map(int, line)

            # Calculate line properties
            dx = x2 - x1
            dy = y2 - y1

            length = math.sqrt(
                dx ** 2 + dy ** 2
            )

            angle = math.degrees(
                math.atan2(dy, dx)
            ) % 180

            midpoint_x = (x1 + x2) / 2
            midpoint_y = (y1 + y2) / 2

            line_features.append({

                "start": [x1, y1],

                "end": [x2, y2],

                "length": round(
                    length, 2
                ),

                "angle_degrees": round(
                    angle, 2
                ),

                "midpoint": [
                    round(midpoint_x, 2),
                    round(midpoint_y, 2)
                ]

            })

    # ======================================
    # 2. CORNER DETECTION
    # ======================================

    corners = cv2.goodFeaturesToTrack(
        edges,
        maxCorners=80,
        qualityLevel=0.02,
        minDistance=12,
        blockSize=5
    )

    corner_features = []

    if corners is not None:

        for corner in corners:

            x, y = corner.ravel().astype(int)

            corner_features.append({

                "x": int(x),

                "y": int(y)

            })

    # ======================================
    # 3. VISUALIZATION
    # ======================================

    visualization = cv2.cvtColor(
        edges,
        cv2.COLOR_GRAY2BGR
    )

    # Draw detected lines in GREEN
    for feature in line_features:

        x1, y1 = feature["start"]
        x2, y2 = feature["end"]

        cv2.line(
            visualization,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )

    # Draw detected corners in RED
    for corner in corner_features:

        cv2.circle(
            visualization,
            (corner["x"], corner["y"]),
            4,
            (0, 0, 255),
            -1
        )

    # ======================================
    # 4. SAVE FEATURE DATA
    # ======================================

    results = {

        "image_width": int(edges.shape[1]),

        "image_height": int(edges.shape[0]),

        "total_lines": len(line_features),

        "total_corners": len(corner_features),

        "lines": line_features,

        "corners": corner_features

    }

    json_path = (
        OUTPUT_DIR
        / "geometric_features_v2.json"
    )

    with open(
        json_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            results,
            file,
            indent=4
        )

    # ======================================
    # 5. SAVE VISUALIZATION
    # ======================================

    image_path = (
        OUTPUT_DIR
        / "feature_visualization_v2.png"
    )

    cv2.imwrite(
        str(image_path),
        visualization
    )

    # ======================================
    # 6. DISPLAY RESULTS
    # ======================================

    print("\n===== FEATURE EXTRACTION RESULTS =====")

    print(
        "Image dimensions:",
        edges.shape[1],
        "x",
        edges.shape[0]
    )

    print(
        "Detected line segments:",
        len(line_features)
    )

    print(
        "Detected corners:",
        len(corner_features)
    )

    print("\nOUTPUT FILES:")

    print("JSON:", json_path)

    print("Visualization:", image_path)

    print("\nFEATURE EXTRACTION V2 COMPLETED!")

    return results


# ==========================================
# MAIN EXECUTION
# ==========================================

if __name__ == "__main__":

    extract_features()
