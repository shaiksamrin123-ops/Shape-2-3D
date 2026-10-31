
from pathlib import Path
from PIL import Image, ImageOps
import numpy as np
import argparse


PROJECT = Path(__file__).resolve().parents[1]

INPUT_DIR = PROJECT / "inputs"
INPUT_DIR.mkdir(parents=True, exist_ok=True)

DEFAULT_INPUT = INPUT_DIR / "my_sketch.jpeg"

OUTPUT_DIR = PROJECT / "outputs" / "preprocessing"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_IMAGE = OUTPUT_DIR / "my_sketch_clean.png"


def preprocess_sketch(input_path=None):

    if input_path is None:
        input_path = DEFAULT_INPUT

    input_path = Path(input_path)

    if not input_path.exists():
        raise FileNotFoundError(
            f"Sketch image not found: {input_path}\n"
            f"Place your sketch inside: {INPUT_DIR}"
        )

    image = Image.open(input_path).convert("RGB")

    # Convert sketch to grayscale
    gray = ImageOps.grayscale(image)

    # Improve contrast
    gray = ImageOps.autocontrast(gray, cutoff=1)

    # Convert sketch lines to black and background to white
    gray = gray.point(lambda p: 0 if p < 210 else 255)

    # Find drawing boundaries
    array = np.array(gray)
    rows, cols = np.where(array < 255)

    if len(rows) == 0:
        raise ValueError("No sketch lines detected!")

    # Crop around the drawing
    x_min, x_max = cols.min(), cols.max()
    y_min, y_max = rows.min(), rows.max()

    cropped = gray.crop((x_min, y_min, x_max + 1, y_max + 1))

    # Add white padding
    width, height = cropped.size
    padding = int(max(width, height) * 0.12)

    canvas_size = max(width, height) + 2 * padding
    canvas = Image.new("L", (canvas_size, canvas_size), 255)

    x_offset = (canvas_size - width) // 2
    y_offset = (canvas_size - height) // 2

    canvas.paste(cropped, (x_offset, y_offset))

    # Resize to model-friendly resolution
    canvas = canvas.resize((512, 512), Image.Resampling.LANCZOS)

    canvas.save(OUTPUT_IMAGE)

    print("PREPROCESSING SUCCESSFUL!")
    print("Original size:", image.size)
    print("Processed size:", canvas.size)
    print("Output:", OUTPUT_IMAGE)

    return str(OUTPUT_IMAGE)


if __name__ == "__main__":

    parser = argparse.ArgumentParser(
        description="Preprocess a hand-drawn sketch."
    )

    parser.add_argument(
        "input_image",
        nargs="?",
        default=str(DEFAULT_INPUT),
        help="Path to the input sketch image"
    )

    args = parser.parse_args()

    preprocess_sketch(args.input_image)
