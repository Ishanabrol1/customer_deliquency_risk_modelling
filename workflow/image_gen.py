"""Optional image generation using the OpenAI Images API.

Skipped (with a message) if OPENAI_API_KEY is not set. Swap this file out to use
any other image tool; the rest of the pipeline only needs a prompt in and a file out.
"""
import base64
import os
from pathlib import Path


def generate_image(prompt: str, out_path: Path) -> bool:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("  - image skipped (OPENAI_API_KEY not set)")
        return False

    from openai import OpenAI

    client = OpenAI(api_key=api_key)
    result = client.images.generate(
        model=os.getenv("IMAGE_MODEL", "gpt-image-1"),
        prompt=prompt,
        size="1024x1024",
    )
    out_path.write_bytes(base64.b64decode(result.data[0].b64_json))
    return True
