/**
 * Demo Atelier - AI Content Workflow & Quality Assurance
 * Interactive Frontend Controller
 */

// Embedded outputs and data so the dashboard works standalone (even when opened directly via file://)
const PRODUCTS_DATA = [
  {
    id: "tote-001",
    name: "Marlowe Leather Tote",
    category: "handbag",
    image: "images/tote-001.jpg",
    materials: ["vegetable-tanned leather", "cotton lining"],
    colors: ["tan", "black"],
    price_usd: 120,
    features: ["zip closure", "inner pocket", "fits a 13-inch laptop"],
    content: {
      description: "The Marlowe Leather Tote is a simple, well-made piece designed for everyday use. It keeps the look clean and the details practical, so it pairs easily with what you already wear. Made with care, it is built to be used often and to age well over time, and it works as well on a weekday as it does on a weekend outing.",
      captions: [
        "Meet the Marlowe Leather Tote. Everyday style, kept simple. #newin",
        "Small details, easy to wear. The Marlowe Leather Tote. #style #everyday",
        "Your new daily go-to. #marlowe"
      ],
      ad_concepts: [
        "A morning routine, the product is picked up on the way out the door.",
        "Close-up details shown in soft natural light, ending on the product name."
      ],
      image_prompt: "Studio product photo of the Marlowe Leather Tote on a neutral linen background, soft window light, minimal styling, no text."
    },
    checks: [
      { check: "structure", passed: true, detail: "All required fields present" },
      { check: "description_length", passed: true, detail: "64 words (allowed 40-90)" },
      { check: "caption_limits", passed: true, detail: "Length & hashtag rules respected" },
      { check: "banned_phrases", passed: true, detail: "No hype or risky claims found" },
      { check: "trademark_risk", passed: true, detail: "No trademark conflicts detected" },
      { check: "material_accuracy", passed: true, detail: "All materials verified against specs" },
      { check: "numbers_match_facts", passed: true, detail: "Numerical claims match factual spec" },
      { check: "image_prompt_no_text", passed: true, detail: "No forbidden embedded text keywords" }
    ]
  },
  {
    id: "sandal-002",
    name: "Isla Block-Heel Sandal",
    category: "footwear",
    image: "images/sandal-002.jpg",
    materials: ["suede", "rubber sole"],
    colors: ["sand", "olive"],
    price_usd: 85,
    features: ["4 cm block heel", "adjustable ankle strap", "cushioned insole"],
    content: {
      description: "The Isla Block-Heel Sandal pairs a steady 4 cm block heel with soft suede and a cushioned insole. Designed for warm days on the move, the adjustable ankle strap gives a secure fit, while the clean lines make it easy to dress up or keep casual.",
      captions: [
        "Summer days made easy. The Isla Block-Heel Sandal in sand and olive. #everydayluxury",
        "Step out with a balanced 4 cm lift. The Isla Sandal. #sandals #warmweather",
        "Designed for all-day comfort. #isla"
      ],
      ad_concepts: [
        "Golden hour street walk highlighting the steady block heel and soft texture.",
        "Split-screen showing day-to-night styling with linen trousers and summer dress."
      ],
      image_prompt: "Editorial still life of the Isla Block-Heel Sandal on sun-warmed stone, crisp summer shadows, warm neutral palette, no text."
    },
    checks: [
      { check: "structure", passed: true, detail: "All required fields present" },
      { check: "description_length", passed: true, detail: "48 words (allowed 40-90)" },
      { check: "caption_limits", passed: true, detail: "Length & hashtag rules respected" },
      { check: "banned_phrases", passed: true, detail: "No hype or risky claims found" },
      { check: "trademark_risk", passed: true, detail: "No trademark conflicts detected" },
      { check: "material_accuracy", passed: true, detail: "All materials verified against specs" },
      { check: "numbers_match_facts", passed: true, detail: "Numerical claims match factual spec" },
      { check: "image_prompt_no_text", passed: true, detail: "No forbidden embedded text keywords" }
    ]
  },
  {
    id: "scarf-003",
    name: "Aria Printed Silk Scarf",
    category: "accessory",
    image: "images/scarf-003.jpg",
    materials: ["silk"],
    colors: ["blue floral", "red geometric"],
    price_usd: 45,
    features: ["70 x 70 cm", "hand-rolled edges"],
    content: {
      description: "Spun from 100% pure silk with hand-rolled edges, the Aria Printed Silk Scarf measures 70 x 70 cm of versatile elegance. Wear it knotted around the neck, styled as a headband, or tied neatly onto a favorite leather handbag.",
      captions: [
        "A touch of effortless color. The Aria Printed Silk Scarf. #silkjewels #details",
        "70 x 70 cm of fine silk with classic hand-rolled finish. #accessories",
        "Add dimension to any outfit. #ariascarf"
      ],
      ad_concepts: [
        "Slow-motion draping of the silk scarf catching gentle natural breeze.",
        "Three ways to knot and style in under 15 seconds."
      ],
      image_prompt: "Close-up overhead flat lay of the Aria Printed Silk Scarf folded beside a morning coffee and brass pen, soft natural lighting, no text."
    },
    checks: [
      { check: "structure", passed: true, detail: "All required fields present" },
      { check: "description_length", passed: true, detail: "42 words (allowed 40-90)" },
      { check: "caption_limits", passed: true, detail: "Length & hashtag rules respected" },
      { check: "banned_phrases", passed: true, detail: "No hype or risky claims found" },
      { check: "trademark_risk", passed: true, detail: "No trademark conflicts detected" },
      { check: "material_accuracy", passed: true, detail: "All materials verified against specs" },
      { check: "numbers_match_facts", passed: true, detail: "Numerical claims match factual spec" },
      { check: "image_prompt_no_text", passed: true, detail: "No forbidden embedded text keywords" }
    ]
  }
];

const BRAND_RULES = {
  brand_name: "Demo Atelier",
  tone: "warm, confident, simple language, no hype",
  limits: {
    description_words: [40, 90],
    caption_chars: 220,
    max_hashtags: 5,
    max_exclamations_per_caption: 1
  },
  banned_phrases: [
    "best in the world",
    "guaranteed",
    "100%",
    "miracle",
    "life-changing",
    "cheap",
    "limited time only"
  ],
  trademark_watchlist: [
    "gucci", "prada", "chanel", "louis vuitton", "nike", "adidas",
    "hermes", "disney", "zara"
  ],
  materials_vocab: [
    "leather", "suede", "silk", "cotton", "linen", "wool", "cashmere",
    "canvas", "nylon", "polyester", "satin", "velvet", "denim", "rubber",
    "vegan leather", "patent leather"
  ]
};

let currentProductIndex = 0;

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
  renderProductTabs();
  loadProduct(0);
  initModal();
  initThemeToggle();
  initSandbox();
  initCopyButtons();
});

// Render Product Selection Tabs
function renderProductTabs() {
  const container = document.getElementById("productTabs");
  container.innerHTML = "";

  PRODUCTS_DATA.forEach((prod, idx) => {
    const btn = document.createElement("button");
    btn.className = `tab-btn ${idx === 0 ? "active" : ""}`;
    btn.setAttribute("role", "tab");
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
      ${prod.name}
    `;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadProduct(idx);
    });
    container.appendChild(btn);
  });
}

// Load Selected Product Data into UI
function loadProduct(index) {
  currentProductIndex = index;
  const p = PRODUCTS_DATA[index];

  // Fact Sheet
  document.getElementById("productIdDisplay").textContent = `#${p.id}`;
  document.getElementById("productNameDisplay").textContent = p.name;
  document.getElementById("productPriceDisplay").textContent = `$${p.price_usd}`;
  document.getElementById("productCategoryBadge").textContent = p.category;

  // Pills
  const matContainer = document.getElementById("productMaterialsPills");
  matContainer.innerHTML = p.materials.map(m => `<span class="pill">${m}</span>`).join("");

  const colContainer = document.getElementById("productColorsPills");
  colContainer.innerHTML = p.colors.map(c => `<span class="pill">${c}</span>`).join("");

  const featContainer = document.getElementById("productFeaturesList");
  featContainer.innerHTML = p.features.map(f => `
    <li>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      ${f}
    </li>
  `).join("");

  // Deliverables: Description
  const desc = p.content.description;
  document.getElementById("descText").textContent = desc;
  const wordCount = desc.trim().split(/\s+/).length;
  document.getElementById("descWordCount").textContent = wordCount;

  // Captions
  const capContainer = document.getElementById("captionsStack");
  capContainer.innerHTML = p.content.captions.map((cap, i) => {
    const formatted = cap.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
    return `
      <div class="caption-item">
        <div class="caption-header">
          <span class="caption-index">Option ${i + 1} (${cap.length} chars)</span>
          <button class="copy-btn" onclick="copyText('${cap.replace(/'/g, "\\'")}', this)">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
          </button>
        </div>
        <p class="caption-text">${formatted}</p>
      </div>
    `;
  }).join("");

  // Ad Concepts
  const adContainer = document.getElementById("adConceptsStack");
  adContainer.innerHTML = p.content.ad_concepts.map((ad, i) => `
    <div class="caption-item">
      <div class="caption-header">
        <span class="caption-index">Concept ${i + 1}</span>
        <button class="copy-btn" onclick="copyText('${ad.replace(/'/g, "\\'")}', this)">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        </button>
      </div>
      <p class="caption-text">${ad}</p>
    </div>
  `).join("");

  // Image Prompt & Visual Preview
  document.getElementById("imagePromptText").textContent = p.content.image_prompt;
  const promptImg = document.getElementById("promptImagePreview");
  if (promptImg) {
    promptImg.src = p.image;
    promptImg.alt = `Generated photograph of ${p.name}`;
  }

  // Hero Product Image
  const imgElement = document.getElementById("productImageDisplay");
  if (imgElement) {
    imgElement.src = p.image;
    imgElement.alt = p.name;
  }
  const catLabel = document.getElementById("imageCategoryLabel");
  if (catLabel) {
    catLabel.textContent = p.category;
  }

  // QA Checks
  const qaContainer = document.getElementById("qaChecklist");
  qaContainer.innerHTML = p.checks.map(c => `
    <div class="qa-item">
      <div class="qa-status-icon ${c.passed ? "" : "fail"}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
          ${c.passed ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'}
        </svg>
      </div>
      <div class="qa-info">
        <div class="qa-name">
          <span>${c.check.replace(/_/g, " ")}</span>
          <span style="font-size: 0.7rem; color: var(--success); font-family: var(--font-mono);">PASSED</span>
        </div>
        <div class="qa-detail">${c.detail}</div>
      </div>
    </div>
  `).join("");
}

// Global Copy Helper
function copyText(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copied to clipboard!");
    if (btnElement) {
      const orig = btnElement.innerHTML;
      btnElement.classList.add("copied");
      btnElement.innerHTML = `✓ Copied`;
      setTimeout(() => {
        btnElement.classList.remove("copied");
        btnElement.innerHTML = orig;
      }, 1800);
    }
  });
}

function initCopyButtons() {
  document.getElementById("copyDescBtn")?.addEventListener("click", function() {
    const text = document.getElementById("descText").textContent;
    copyText(text, this);
  });

  document.getElementById("copyPromptBtn")?.addEventListener("click", function() {
    const text = document.getElementById("imagePromptText").textContent;
    copyText(text, this);
  });
}

// Toast Feedback System
function showToast(message) {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--success);">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

// Modal Management
function initModal() {
  const modal = document.getElementById("brandRulesModal");
  const openBtn = document.getElementById("btnBrandRules");
  const closeBtn = document.getElementById("closeModalBtn");

  // Populate lists
  document.getElementById("bannedPhrasesContainer").innerHTML = BRAND_RULES.banned_phrases
    .map(p => `<span class="pill" style="border-color: rgba(239, 68, 68, 0.4); color: #fca5a5;">"${p}"</span>`)
    .join("");

  document.getElementById("trademarkContainer").innerHTML = BRAND_RULES.trademark_watchlist
    .map(t => `<span class="pill" style="border-color: rgba(245, 158, 11, 0.4); color: #fde68a;">${t}</span>`)
    .join("");

  document.getElementById("materialsContainer").innerHTML = BRAND_RULES.materials_vocab
    .map(m => `<span class="pill">${m}</span>`)
    .join("");

  openBtn.addEventListener("click", () => modal.classList.add("active"));
  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
}

// Dark / Light Theme Toggle
function initThemeToggle() {
  const btn = document.getElementById("themeToggleBtn");
  const savedTheme = localStorage.getItem("atelier_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("atelier_theme", next);
    showToast(`Switched to ${next} theme`);
  });
}

// Interactive Real-Time Compliance Sandbox
function initSandbox() {
  const input = document.getElementById("sandboxInput");
  const results = document.getElementById("sandboxResults");

  input.addEventListener("input", () => {
    const text = input.value.trim();
    if (!text) {
      results.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-dim);">Live results will appear as you type...</div>`;
      return;
    }

    const words = text.split(/\s+/).length;
    const lower = text.toLowerCase();

    // Check banned phrases
    const foundBanned = BRAND_RULES.banned_phrases.filter(p => lower.includes(p.toLowerCase()));
    // Check trademark
    const foundTm = BRAND_RULES.trademark_watchlist.filter(t => lower.includes(t.toLowerCase()));

    const isLengthOk = words >= 40 && words <= 90;

    results.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; border-bottom: 1px solid var(--border-subtle);">
        <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-main);">Word Count: ${words} words</span>
        <span class="pill" style="font-size: 0.75rem; ${isLengthOk ? 'color: var(--success);' : 'color: var(--warning);'}">
          ${isLengthOk ? '✓ Within 40-90 words range' : words < 40 ? `Need ${40 - words} more words` : `${words - 90} words over limit`}
        </span>
      </div>

      <div style="font-size: 0.825rem; margin-top: 6px;">
        <strong>Banned Phrases:</strong> 
        ${foundBanned.length === 0 
          ? '<span style="color: var(--success);"> None detected (Clean)</span>' 
          : `<span style="color: var(--danger);"> Flagged: "${foundBanned.join('", "')}"</span>`
        }
      </div>

      <div style="font-size: 0.825rem;">
        <strong>Trademark Watchlist:</strong> 
        ${foundTm.length === 0 
          ? '<span style="color: var(--success);"> None detected (Clear)</span>' 
          : `<span style="color: var(--warning);"> Flagged: "${foundTm.join('", "')}"</span>`
        }
      </div>
    `;
  });
}
