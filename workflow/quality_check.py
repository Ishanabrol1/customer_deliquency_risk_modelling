"""Rule-based quality checks on generated content.

These are simple, transparent checks. They catch common problems (hallucinated
materials, banned claims, trademark mentions, length limits) but do NOT replace
human review.
"""
import re


def _all_text(content: dict) -> str:
    parts = [content.get("description", "")]
    parts += content.get("captions", [])
    parts += content.get("ad_concepts", [])
    return " ".join(parts)


def _check(name: str, passed: bool, detail: str = "") -> dict:
    return {"check": name, "passed": passed, "detail": detail}


def run_checks(content: dict, product: dict, rules: dict) -> list:
    lim = rules["limits"]
    results = []
    text = _all_text(content)
    lowered = text.lower()

    # 1. Structure
    missing = [k for k in ("description", "captions", "ad_concepts", "image_prompt") if not content.get(k)]
    results.append(_check("structure", not missing, f"missing: {missing}" if missing else ""))

    # 2. Description length
    words = len(content.get("description", "").split())
    lo, hi = lim["description_words"]
    results.append(_check("description_length", lo <= words <= hi, f"{words} words (allowed {lo}-{hi})"))

    # 3. Caption limits
    bad = []
    for i, cap in enumerate(content.get("captions", []), 1):
        if len(cap) > lim["caption_chars"]:
            bad.append(f"caption {i}: {len(cap)} chars")
        if cap.count("#") > lim["max_hashtags"]:
            bad.append(f"caption {i}: too many hashtags")
        if cap.count("!") > lim["max_exclamations_per_caption"]:
            bad.append(f"caption {i}: too many exclamation marks")
    results.append(_check("caption_limits", not bad, "; ".join(bad)))

    # 4. Banned phrases
    hits = [p for p in rules["banned_phrases"] if p.lower() in lowered]
    results.append(_check("banned_phrases", not hits, ", ".join(hits)))

    # 5. Trademark / copyright risk
    marks = [m for m in rules["trademark_watchlist"] if re.search(rf"\b{re.escape(m)}\b", lowered)]
    results.append(_check("trademark_risk", not marks, ", ".join(marks)))

    # 6. Possible hallucinated materials: a material word in the output that is
    # not in the product facts.
    facts = " ".join(product.get("materials", []) + product.get("features", [])).lower()
    invented = [m for m in rules["materials_vocab"] if re.search(rf"\b{re.escape(m)}\b", lowered) and m not in facts]
    results.append(_check("material_accuracy", not invented, f"not in product facts: {invented}" if invented else ""))

    # 7. Possible hallucinated numbers: any digit sequence not found in product facts.
    fact_blob = " ".join(str(v) for v in product.values())
    fact_numbers = set(re.findall(r"\d+(?:\.\d+)?", fact_blob))
    out_numbers = set(re.findall(r"\d+(?:\.\d+)?", text))
    extra = sorted(out_numbers - fact_numbers)
    results.append(_check("numbers_match_facts", not extra, f"numbers not in facts: {extra}" if extra else ""))

    # 8. Image prompt shouldn't ask for text in the image
    ip = content.get("image_prompt", "").lower()
    asks_text = bool(re.search(r"\b(caption|logo text|with the words|slogan)\b", ip))
    results.append(_check("image_prompt_no_text", not asks_text))

    return results


def summarize(results: list) -> dict:
    failed = [r for r in results if not r["passed"]]
    return {"passed": len(results) - len(failed), "failed": len(failed), "needs_review": bool(failed)}
