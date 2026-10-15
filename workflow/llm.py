"""LLM call wrapper. Real calls use the Anthropic API; dry-run returns canned JSON."""
import json
import os

DEFAULT_MODEL = "claude-sonnet-5-5"


def _dry_run_response(product_name: str) -> str:
    # Clearly marked stub so nobody mistakes it for real model output.
    return json.dumps({
        "description": (
            f"[DRY RUN] The {product_name} is a simple, well-made piece designed for everyday use. "
            "It keeps the look clean and the details practical, so it pairs easily with what "
            "you already wear. Made with care, it is built to be used often and to age well over "
            "time, and it works as well on a weekday as it does on a weekend outing."
        ),
        "captions": [
            f"[DRY RUN] Meet the {product_name}. Everyday style, kept simple. #newin",
            f"[DRY RUN] Small details, easy to wear. The {product_name}. #style #everyday",
            f"[DRY RUN] Your new daily go-to. #{product_name.split()[0].lower()}",
        ],
        "ad_concepts": [
            "[DRY RUN] A morning routine, the product is picked up on the way out the door.",
            "[DRY RUN] Close-up details shown in soft natural light, ending on the product name.",
        ],
        "image_prompt": (
            f"[DRY RUN] Studio product photo of the {product_name} on a neutral linen "
            "background, soft window light, minimal styling, no text."
        ),
    })


def complete(system: str, user: str, product_name: str = "", dry_run: bool = False) -> str:
    if dry_run:
        return _dry_run_response(product_name)

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not set. Add it to .env or use --dry-run.")

    from anthropic import Anthropic  # imported lazily so --dry-run needs no SDK

    client = Anthropic(api_key=api_key)
    resp = client.messages.create(
        model=os.getenv("LLM_MODEL", DEFAULT_MODEL),
        max_tokens=1200,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    return "".join(block.text for block in resp.content if block.type == "text")
