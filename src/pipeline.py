
from pathlib import Path
import subprocess
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = PROJECT_ROOT / "src"

PIPELINE_STEPS = [
    ("1. IMAGE PREPROCESSING", "preprocess.py"),
    ("2. SKETCH ANALYSIS", "sketch_analyzer.py"),
    ("3. FEATURE EXTRACTION", "feature_extractor.py"),
    ("4. STRUCTURAL GRAPH", "structural_graph.py"),
    ("5. SKETCH UNDERSTANDING", "sketch_understanding.py"),
    ("6. PART RECOGNITION", "part_recognition.py"),
    ("7. SPATIAL REASONING", "spatial_reasoning.py"),
    ("8. 3D RECONSTRUCTION", "reconstruction_engine.py"),
    ("9. MESH OPTIMIZATION", "mesh_optimizer.py"),
    ("10. MESH VALIDATION", "mesh_validator.py"),
]


def run_pipeline():

    print("\n======================================")
    print("       SKETCH-TO-3D MASTER PIPELINE")
    print("======================================")

    print("\nProject:", PROJECT_ROOT)
    print("Python:", sys.executable)

    completed_steps = []

    for step_name, script_name in PIPELINE_STEPS:

        script_path = SRC_DIR / script_name

        print("\n--------------------------------------")
        print(step_name)
        print("--------------------------------------")

        if not script_path.exists():
            print("ERROR: Script not found:", script_path)
            print("PIPELINE STOPPED!")
            return

        result = subprocess.run(
            [sys.executable, str(script_path)],
            cwd=str(PROJECT_ROOT)
        )

        if result.returncode != 0:
            print("\nFAILED:", step_name)
            print("Pipeline stopped because this module failed.")
            return

        completed_steps.append(step_name)
        print("\nSTEP COMPLETED:", step_name)

    print("\n======================================")
    print("       PIPELINE EXECUTION SUMMARY")
    print("======================================")

    for step in completed_steps:
        print("[SUCCESS]", step)

    print("\nCompleted steps:", len(completed_steps))
    print("Total steps:", len(PIPELINE_STEPS))

    print("\nALL PIPELINE STEPS COMPLETED!")


if __name__ == "__main__":
    run_pipeline()
