"""Builds prompts from templates + product data and parses the model's JSON output."""
import json
import re
from pathlib import Path

from .llm import complete

ROOT = Path(__file__).resolve().parent.parent


def load_json(path: str):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))


def parse_json(text: str) -> dict:
    """Parse JSON even if the model wrapped it in code fences or added stray text."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start, end = text.find("{"), text.rfind("}")
        if start != -1 and end > start:
            return json.loads(text[start : end + 1])
        raise


def generate_content(product: dict, rules: dict, dry_run: bool = False) -> dict:
    system = (ROOT / "prompts" / "system.md").read_text(encoding="utf-8")
    template = (ROOT / "prompts" / "product_content.md").read_text(encoding="utf-8")
    lim = rules["limits"]
    user = template.format(
        brand_rules=json.dumps(
            {"brand": rules["brand_name"], "tone": rules["tone"], "banned_phrases": rules["banned_phrases"]},
            indent=2,
        ),
        product=json.dumps(product, indent=2),
        min_words=lim["description_words"][0],
        max_words=lim["description_words"][1],
        caption_chars=lim["caption_chars"],
        max_hashtags=lim["max_hashtags"],
    )
    raw = complete(system, user, product_name=product["name"], dry_run=dry_run)
    return parse_json(raw)
