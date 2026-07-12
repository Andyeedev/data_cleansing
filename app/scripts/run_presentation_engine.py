"""
MAP Presentation Engine — Master Orchestrator
Chains Module 01 (Execution) -> JSON Generation -> Demo Package Build.

Usage:
    python app/scripts/run_presentation_engine.py --config config.yaml
    python app/scripts/run_presentation_engine.py --synthetic
    python app/scripts/run_presentation_engine.py --batch-id <existing-batch>
    python app/scripts/run_presentation_engine.py --build-only
"""

import argparse
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from app.utils.logger import get_logger

logger = get_logger(__name__)

SCRIPTS_DIR = Path(__file__).resolve().parent


def run_step(name, cmd):
    """Run a script step and return success/failure."""
    logger.info(f"{'='*60}")
    logger.info(f"STEP: {name}")
    logger.info(f"{'='*60}")
    print(f"\n{'='*60}")
    print(f"  STEP: {name}")
    print(f"{'='*60}")

    start = time.time()
    result = subprocess.run(cmd, capture_output=False, text=True)
    elapsed = time.time() - start

    if result.returncode != 0:
        logger.error(f"FAILED: {name} (exit code {result.returncode})")
        print(f"\n  FAILED: {name} (exit code {result.returncode})")
        return False

    logger.info(f"COMPLETED: {name} ({elapsed:.1f}s)")
    print(f"\n  COMPLETED: {name} ({elapsed:.1f}s)")
    return True


def main():
    parser = argparse.ArgumentParser(description="MAP Presentation Engine — Master Orchestrator")
    parser.add_argument("--config", default="config.yaml", help="MAP config file")
    parser.add_argument("--batch-id", help="Use existing batch ID")
    parser.add_argument("--synthetic", action="store_true", help="Use synthetic data (no MAP execution)")
    parser.add_argument("--build-only", action="store_true", help="Skip MAP execution, build from existing JSON")
    parser.add_argument("--output-dir", help="Override output directory")
    args = parser.parse_args()

    total_start = time.time()

    print(f"\n{'#'*60}")
    print(f"  MAP Presentation Engine — Module 01")
    print(f"  Demonstration Execution Engine")
    print(f"{'#'*60}\n")

    # STEP 1: Generate Dashboard JSON
    gen_cmd = [sys.executable, str(SCRIPTS_DIR / "generate_demo_scenario.py"), "--config", args.config]
    if args.synthetic:
        gen_cmd.append("--synthetic")
    elif args.batch_id:
        gen_cmd.extend(["--batch-id", args.batch_id])

    if args.output_dir:
        gen_cmd.extend(["--output-dir", args.output_dir])

    if not args.build_only:
        if not run_step("Generate Dashboard JSON Data", gen_cmd):
            print("\n  Falling back to synthetic data...")
            gen_cmd_fallback = [sys.executable, str(SCRIPTS_DIR / "generate_demo_scenario.py"), "--synthetic"]
            if args.output_dir:
                gen_cmd_fallback.extend(["--output-dir", args.output_dir])
            if not run_step("Generate Synthetic Dashboard Data", gen_cmd_fallback):
                sys.exit(1)

    # STEP 2: Build Demo Package
    build_cmd = [sys.executable, str(SCRIPTS_DIR / "build_demo_package.py")]
    if args.output_dir:
        build_cmd.extend(["--output-dir", str(Path(args.output_dir).parent / "Demo")])

    if not run_step("Build Demo Package (HTML/CSS/JS)", build_cmd):
        sys.exit(1)

    # STEP 3: Completion Audit
    print(f"\n{'#'*60}")
    print(f"  COMPLETION AUDIT")
    print(f"{'#'*60}\n")

    output_base = Path(args.output_dir).parent if args.output_dir else Path("research/Packaging_our_Company/ver2/02_output/18_Presentation_Engine")
    demo_dir = output_base / "Demo"
    data_dir = output_base / "demo" / "data"

    checks = [
        ("Dashboard JSON files exist", all((data_dir / f).exists() for f in [
            "01_Executive_Overview.json", "02_Migration_Overview.json",
            "03_Validation_Centre.json", "04_Risk_Assessment.json",
            "05_Migration_Progress.json", "06_Data_Quality.json",
            "07_Governance_Centre.json", "08_Platform_Health.json",
            "landing_page.json",
        ])),
        ("Demo HTML exists", (demo_dir / "index.html").exists()),
        ("Dashboard HTML exists", (demo_dir / "dashboard" / "index.html").exists()),
        ("CSS theme exists", (demo_dir / "css" / "style.css").exists()),
        ("data.js exists", (demo_dir / "js" / "data.js").exists()),
        ("dashboard.js exists", (demo_dir / "js" / "dashboard.js").exists()),
        ("chart.min.js exists", (demo_dir / "js" / "chart.min.js").exists()),
    ]

    all_pass = True
    for name, result in checks:
        status = "PASS" if result else "FAIL"
        if not result:
            all_pass = False
        print(f"  [{status}] {name}")

    # Infrastructure sanitisation check
    import re
    forbidden = ["localhost", "127.0.0.1", "PostgreSQL", "Docker", "VS Code", "Python"]
    sanitisation_pass = True
    data_js_path = demo_dir / "js" / "data.js"
    if data_js_path.exists():
        content = data_js_path.read_text(encoding="utf-8")
        for term in forbidden:
            if term.lower() in content.lower():
                print(f"  [FAIL] Infrastructure reference found: {term}")
                sanitisation_pass = False
                all_pass = False

    if sanitisation_pass:
        print(f"  [PASS] No forbidden infrastructure references")

    total_elapsed = time.time() - total_start

    print(f"\n{'#'*60}")
    if all_pass:
        print(f"  ALL CHECKS PASSED")
    else:
        print(f"  SOME CHECKS FAILED — review above")
    print(f"  Total time: {total_elapsed:.1f}s")
    print(f"{'#'*60}\n")

    if not all_pass:
        sys.exit(1)


if __name__ == "__main__":
    main()
