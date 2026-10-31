from pathlib import Path
import json
import sys
import traceback

PROJECT_ROOT = Path(__file__).resolve().parents[1]

sys.path.insert(0, str(PROJECT_ROOT))

from src.generate_3d import generate_3d


INPUT_IMAGE = (
    PROJECT_ROOT
    / "outputs"
    / "preprocessing"
    / "my_sketch_clean.png"
)

STRUCTURAL_MODEL = (
    PROJECT_ROOT
    / "outputs"
    / "optimized_mesh"
    / "optimized_model.glb"
)

OUTPUT_DIR = PROJECT_ROOT / "outputs" / "hybrid"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def run_hybrid_pipeline():

    print("\n====================================")
    print("       HYBRID SKETCH-TO-3D")
    print("====================================")

    if not INPUT_IMAGE.exists():
        raise FileNotFoundError(
            f"Input sketch not found: {INPUT_IMAGE}"
        )

    print("\nINPUT SKETCH:")
    print(INPUT_IMAGE)

    print("\nCHECKING STRUCTURAL MODEL...")

    if STRUCTURAL_MODEL.exists():
        structural_status = "available"
        print("Structural reconstruction available!")
    else:
        structural_status = "missing"
        print("Structural reconstruction not found.")

    print("\nSTARTING TRIPOSR AI RECONSTRUCTION...")

    ai_glb_path = generate_3d(INPUT_IMAGE)

    ai_glb_path = Path(ai_glb_path)

    if not ai_glb_path.exists():
        raise FileNotFoundError(
            "TripoSR GLB output was not created."
        )

    print("\nTRIPOSR RECONSTRUCTION SUCCESSFUL!")

    report = {
        "input_image": str(INPUT_IMAGE),
        "structural_reconstruction": {
            "status": structural_status,
            "path": str(STRUCTURAL_MODEL)
        },
        "ai_reconstruction": {
            "model": "TripoSR",
            "status": "success",
            "glb_path": str(ai_glb_path)
        },
        "integration_status": "completed",
        "note": (
            "Structural reconstruction and TripoSR AI "
            "reconstruction are generated separately. "
            "They are not yet fused into one mesh."
        )
    }

    report_path = OUTPUT_DIR / "hybrid_pipeline_report.json"

    with open(report_path, "w", encoding="utf-8") as file:
        json.dump(report, file, indent=4)

    print("\n====================================")
    print("       HYBRID PIPELINE RESULTS")
    print("====================================")

    print("Structural model:", structural_status)
    print("AI model:", ai_glb_path)
    print("Report:", report_path)

    print("\nHYBRID PIPELINE COMPLETED!")

    return report


if __name__ == "__main__":

    try:
        run_hybrid_pipeline()

    except Exception as error:
        print("\nHYBRID PIPELINE FAILED!")
        print("Error:", error)
        traceback.print_exc()