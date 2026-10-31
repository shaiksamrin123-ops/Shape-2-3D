
from pathlib import Path

import cv2
import numpy as np


# PROJECT PATHS
PROJECT_ROOT = Path(__file__).resolve().parents[1]

INPUT_IMAGE = (
    PROJECT_ROOT
    / "outputs"
    / "preprocessing"
    / "my_sketch_clean.png"
)

OUTPUT_DIR = PROJECT_ROOT / "outputs" / "analysis"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def analyze_sketch(image_path):

    print("\nSTARTING SKETCH ANALYSIS...")

    # LOAD IMAGE
    image = cv2.imread(str(image_path))

    if image is None:
        raise FileNotFoundError(
            f"Cannot load sketch: {image_path}"
        )

    # GRAYSCALE CONVERSION
    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    # NOISE REDUCTION
    blurred = cv2.GaussianBlur(
        gray,
        (5, 5),
        0
    )

    # EDGE DETECTION
    edges = cv2.Canny(
        blurred,
        50,
        150
    )

    # LINE DETECTION
    detector = cv2.createLineSegmentDetector(
        cv2.LSD_REFINE_STD
    )

    raw_lines = detector.detect(edges)[0]

    if raw_lines is None:
        detected_lines = np.empty((0, 4))
    else:
        detected_lines = np.asarray(
            raw_lines
        ).reshape(-1, 4)

    # CONTOUR DETECTION
    contours, _ = cv2.findContours(
        edges,
        cv2.RETR_LIST,
        cv2.CHAIN_APPROX_SIMPLE
    )

    # CORNER DETECTION
    corners = cv2.goodFeaturesToTrack(
        gray,
        maxCorners=200,
        qualityLevel=0.01,
        minDistance=8,
        blockSize=5
    )

    # VISUALIZATION
    visualization = cv2.cvtColor(
        edges,
        cv2.COLOR_GRAY2BGR
    )

    # DRAW LINES IN GREEN
    for line in detected_lines:

        x1, y1, x2, y2 = map(int, line)

        cv2.line(
            visualization,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )

    # DRAW CORNERS IN RED
    corner_count = 0

    if corners is not None:

        for corner in corners:

            x, y = corner.ravel().astype(int)

            cv2.circle(
                visualization,
                (x, y),
                4,
                (0, 0, 255),
                -1
            )

            corner_count += 1

    # SAVE RESULTS
    cv2.imwrite(
        str(OUTPUT_DIR / "edges.png"),
        edges
    )

    cv2.imwrite(
        str(OUTPUT_DIR / "line_detection.png"),
        visualization
    )

    # RESULTS
    print("\n===== SKETCH ANALYSIS RESULTS =====")

    print("Image size:", image.shape[1], "x", image.shape[0])
    print("Detected lines:", len(detected_lines))
    print("Detected contours:", len(contours))
    print("Detected corners:", corner_count)

    print("\nOUTPUT FILES:")
    print(OUTPUT_DIR / "edges.png")
    print(OUTPUT_DIR / "line_detection.png")

    print("\nSKETCH ANALYSIS COMPLETED!")

    return {
        "edges": edges,
        "lines": detected_lines,
        "contours": contours,
        "corners": corners
    }


if __name__ == "__main__":

    analyze_sketch(INPUT_IMAGE)
