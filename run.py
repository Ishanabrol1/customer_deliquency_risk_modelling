"""CLI: generate content for each product, run quality checks, save outputs.

Examples:
    python run.py --dry-run                 # no API keys needed
    python run.py                           # real LLM calls
    python run.py --images                  # also generate images
    python run.py --product tote-001
"""
import argparse
import json
import os
from pathlib import Path

# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

from workflow.generate import generate_content, load_json
from workflow.image_gen import generate_image
from workflow.quality_check import run_checks, summarize

OUT = Path(__file__).parent / "outputs"


def main():
    load_dotenv()
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="use canned output, no API calls")
    ap.add_argument("--images", action="store_true", help="also generate images")
    ap.add_argument("--product", help="only run this product id")
    args = ap.parse_args()

    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if not args.dry_run and (not api_key or "your_actual" in api_key):
        print("Note: No valid ANTHROPIC_API_KEY found in .env; automatically running in --dry-run mode.\n")
        args.dry_run = True

    products = load_json("data/products.json")
    rules = load_json("data/brand_rules.json")
    if args.product:
        products = [p for p in products if p["id"] == args.product]
        if not products:
            raise SystemExit(f"No product with id {args.product}")

    OUT.mkdir(exist_ok=True)
    rows = []
    for p in products:
        print(f"[{p['id']}] {p['name']}")
        try:
            content = generate_content(p, rules, dry_run=args.dry_run)
        except Exception as e:  # keep going; log the failure for the experiments doc
            print(f"  ! generation failed: {e}")
            rows.append((p["id"], p["name"], "generation failed", str(e)))
            continue

        results = run_checks(content, p, rules)
        summary = summarize(results)
        record = {"product": p, "content": content, "checks": results, "summary": summary}
        (OUT / f"{p['id']}.json").write_text(json.dumps(record, indent=2), encoding="utf-8")

        if args.images and not args.dry_run:
            generate_image(content["image_prompt"], OUT / f"{p['id']}.png")

        failed = [r["check"] for r in results if not r["passed"]]
        status = "OK" if not failed else "REVIEW"
        print(f"  checks: {summary['passed']} passed, {summary['failed']} failed -> {status}")
        rows.append((p["id"], p["name"], status, ", ".join(failed)))

    lines = ["# Run summary", "", "| Product | Name | Status | Failed checks |", "|---|---|---|---|"]
    lines += [f"| {a} | {b} | {c} | {d or '-'} |" for a, b, c, d in rows]
    (OUT / "summary.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"\nSaved outputs to {OUT}/")


if __name__ == "__main__":
    main()
