Brand rules:
{brand_rules}

Product facts:
{product}

Write marketing content for this product.

Return JSON with exactly these keys:
{{
  "description": "a product description, {min_words}-{max_words} words",
  "captions": ["3 social media captions, each under {caption_chars} characters, max {max_hashtags} hashtags each"],
  "ad_concepts": ["2 short ad concepts, 1-2 sentences each"],
  "image_prompt": "one prompt for an image generator: product photo, setting, lighting, mood. No text in the image."
}}
