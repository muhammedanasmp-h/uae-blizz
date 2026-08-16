// HeroProducts are now dynamically generated below catalogProducts
// --- Catalog Products Data ---
const catalogProducts = [
  {
    name: "Laundry Liquid - Lavender",
    category: "detergent",
    desc: "Concentrated B2B laundry detergent with fabric-protecting agents and active enzymes for deep cleaning.",
    packaging: "20L Canister <span>(Also available in 5L)</span>",
    image: "asset/products/liquid detergent 4kg lavender.png?v=3",
    badge: "Popular"
  },
  {
    name: "Laundry Liquid - Ocean Breeze",
    category: "detergent",
    desc: "High-performance laundry liquid delivering a refreshing ocean scent, tailored for large-scale hospitality needs.",
    packaging: "20L Canister <span>(Also available in 5L)</span>",
    image: "asset/products/liquid detergent 4kg ocean.png?v=3",
    badge: "New"
  },
  {
    name: "Fabric Softener - Floral Pink",
    category: "detergent",
    desc: "Premium commercial fabric conditioner providing long-lasting softness and fresh floral scent.",
    packaging: "20L Canister <span>(Also available in 5L)</span>",
    image: "asset/products/fabric softner floral pink.png?v=3",
    badge: ""
  },
  {
    name: "Fabric Softener - Sandal Green",
    category: "detergent",
    desc: "Long-lasting freshness with a delightful sandalwood aroma, softening industrial fabrics effortlessly.",
    packaging: "20L Canister <span>(Also available in 5L)</span>",
    image: "asset/products/fabric softner floral green.png?v=3",
    badge: ""
  },
  {
    name: "Floor Cleaner - Lavender",
    category: "surface",
    desc: "Streak-free commercial floor disinfectant with natural citrus oil for cleaning marble and tile.",
    packaging: "20L Canister <span>(Also available in 5L)</span>",
    image: "asset/products/floor cleaner.png?v=3",
    badge: "Popular"
  },
  {
    name: "Glass & Window Shine",
    category: "surface",
    desc: "Heavy-duty glass cleaner that leaves a streak-free, crystal-clear finish on mirrors and glass panels.",
    packaging: "5L Spray Refill <span>(Box of 4)</span>",
    image: "asset/products/glass cleaner.png?v=3",
    badge: "New"
  },
  {
    name: "Antiseptic Disinfectant",
    category: "disinfectant",
    desc: "Hospital-grade sanitizer and odor eliminator, kills 99.9% of bacteria and viruses on impact.",
    packaging: "20L Canister <span>(Also available in 5L)</span>",
    image: "asset/products/antiseptic disinfectant.png?v=3",
    badge: "Popular"
  },
  {
    name: "Dish Wash - Green Apple",
    category: "surface",
    desc: "Powerful grease-cutting dishwashing liquid with a fresh green apple scent. Perfect for commercial kitchens.",
    packaging: "1L Bottles <span>(Box of 12)</span>",
    image: "asset/products/dish wash 1litr green apple.png?v=3",
    badge: "New"
  },
  {
    name: "Dish Wash - Lemon",
    category: "surface",
    desc: "High-suds, grease-fighting dish soap leaving utensils spotless with a zesty lemon fragrance.",
    packaging: "1L Bottles <span>(Box of 12)</span>",
    image: "asset/products/dishwash 1litr lemon.png?v=3",
    badge: ""
  },
  {
    name: "Dish Wash - Strawberry",
    category: "surface",
    desc: "Sweet strawberry scented dish wash delivering sparkling clean results for culinary facilities.",
    packaging: "1L Bottles <span>(Box of 12)</span>",
    image: "asset/products/dishwash 1litr strawberry.png?v=3",
    badge: ""
  },
  {
    name: "Hand Wash - Lavender",
    category: "handcare",
    desc: "Enriched skin-friendly foaming hand wash designed for high-frequency use in corporate offices.",
    packaging: "5L Dispenser Refill <span>(Box of 4)</span>",
    image: "asset/products/hand wash liq.png?v=3",
    badge: "Popular"
  }
];

// --- Generate Hero Products ---
const categoryColors = {
  detergent: {
    bgGradient: "linear-gradient(135deg, #f3f0fc 0%, #e2daf7 100%)",
    shapeGradient: "linear-gradient(135deg, #a855f7 0%, #4c1d95 100%)",
    accentColor: "#7c3aed",
    accentLight: "rgba(124, 58, 237, 0.08)",
    glowColor: "rgba(124, 58, 237, 0.3)"
  },
  surface: {
    bgGradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    shapeGradient: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
    accentColor: "#2563eb",
    accentLight: "rgba(37, 99, 235, 0.08)",
    glowColor: "rgba(37, 99, 235, 0.3)"
  },
  disinfectant: {
    bgGradient: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    shapeGradient: "linear-gradient(135deg, #22c55e 0%, #064e3b 100%)",
    accentColor: "#15803d",
    accentLight: "rgba(21, 128, 61, 0.08)",
    glowColor: "rgba(21, 128, 61, 0.3)"
  },
  handcare: {
    bgGradient: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
    shapeGradient: "linear-gradient(135deg, #ec4899 0%, #831843 100%)",
    accentColor: "#db2777",
    accentLight: "rgba(219, 39, 119, 0.08)",
    glowColor: "rgba(219, 39, 119, 0.3)"
  }
};

// Specific Product Colors (overrides category colors)
const productColors = {
  "Laundry Liquid - Lavender": {
    bgGradient: "linear-gradient(135deg, #f3f0fc 0%, #e2daf7 100%)",
    shapeGradient: "linear-gradient(135deg, #a855f7 0%, #4c1d95 100%)",
    accentColor: "#7c3aed",
    accentLight: "rgba(124, 58, 237, 0.08)",
    glowColor: "rgba(124, 58, 237, 0.3)"
  },
  "Laundry Liquid - Ocean Breeze": {
    bgGradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    shapeGradient: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
    accentColor: "#2563eb",
    accentLight: "rgba(37, 99, 235, 0.08)",
    glowColor: "rgba(37, 99, 235, 0.3)"
  },
  "Fabric Softener - Floral Pink": {
    bgGradient: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
    shapeGradient: "linear-gradient(135deg, #ec4899 0%, #831843 100%)",
    accentColor: "#db2777",
    accentLight: "rgba(219, 39, 119, 0.08)",
    glowColor: "rgba(219, 39, 119, 0.3)"
  },
  "Fabric Softener - Sandal Green": {
    bgGradient: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    shapeGradient: "linear-gradient(135deg, #22c55e 0%, #064e3b 100%)",
    accentColor: "#15803d",
    accentLight: "rgba(21, 128, 61, 0.08)",
    glowColor: "rgba(21, 128, 61, 0.3)"
  },
  "Floor Cleaner - Lavender": {
    bgGradient: "linear-gradient(135deg, #f3f0fc 0%, #e2daf7 100%)",
    shapeGradient: "linear-gradient(135deg, #9333ea 0%, #581c87 100%)",
    accentColor: "#9333ea",
    accentLight: "rgba(147, 51, 234, 0.08)",
    glowColor: "rgba(147, 51, 234, 0.3)"
  },
  "Glass & Window Shine": {
    bgGradient: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
    shapeGradient: "linear-gradient(135deg, #06b6d4 0%, #164e63 100%)",
    accentColor: "#0891b2",
    accentLight: "rgba(8, 145, 178, 0.08)",
    glowColor: "rgba(8, 145, 178, 0.3)"
  },
  "Antiseptic Disinfectant": {
    bgGradient: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
    shapeGradient: "linear-gradient(135deg, #14b8a6 0%, #115e59 100%)",
    accentColor: "#0d9488",
    accentLight: "rgba(13, 148, 136, 0.08)",
    glowColor: "rgba(13, 148, 136, 0.3)"
  },
  "Dish Wash - Green Apple": {
    bgGradient: "linear-gradient(135deg, #f7fee7 0%, #ecfccb 100%)",
    shapeGradient: "linear-gradient(135deg, #84cc16 0%, #3f6212 100%)",
    accentColor: "#65a30d",
    accentLight: "rgba(101, 163, 13, 0.08)",
    glowColor: "rgba(101, 163, 13, 0.3)"
  },
  "Dish Wash - Lemon": {
    bgGradient: "linear-gradient(135deg, #fefce8 0%, #fef08a 100%)",
    shapeGradient: "linear-gradient(135deg, #eab308 0%, #713f12 100%)",
    accentColor: "#ca8a04",
    accentLight: "rgba(202, 138, 4, 0.08)",
    glowColor: "rgba(202, 138, 4, 0.3)"
  },
  "Dish Wash - Strawberry": {
    bgGradient: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
    shapeGradient: "linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)",
    accentColor: "#dc2626",
    accentLight: "rgba(220, 38, 38, 0.08)",
    glowColor: "rgba(220, 38, 38, 0.3)"
  },
  "Hand Wash - Lavender": {
    bgGradient: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
    shapeGradient: "linear-gradient(135deg, #d946ef 0%, #701a75 100%)",
    accentColor: "#c026d3",
    accentLight: "rgba(192, 38, 211, 0.08)",
    glowColor: "rgba(192, 38, 211, 0.3)"
  }
};

// --- Custom Background Image Mapping ---
const customBgs = {
  "Laundry Liquid - Lavender": "asset/others/lavandar.png",
  "Laundry Liquid - Ocean Breeze": "asset/others/Ocean Breeze Laundry Liquid.png",
  "Fabric Softener - Floral Pink": "asset/others/Fabric Softener floral pink.png",
  "Fabric Softener - Sandal Green": "asset/others/sandale green.png",
  "Floor Cleaner - Lavender": "asset/others/lavandar.png",
  "Glass & Window Shine": "asset/others/glass cleaner.png",
  "Antiseptic Disinfectant": "asset/others/antisptic disinfectannt.png",
  "Dish Wash - Green Apple": "asset/others/green apple.png",
  "Dish Wash - Lemon": "asset/others/lemon.png",
  "Dish Wash - Strawberry": "asset/others/strawberrry.png",
  "Hand Wash - Lavender": "asset/others/lavandar.png"
};

const heroProducts = catalogProducts.map((p, index) => {
  const colors = productColors[p.name] || categoryColors[p.category] || categoryColors.detergent;
  return {
    ...p,
    title: p.name, // Ensure title exists
    baseAngle: index * (360 / catalogProducts.length), // Dynamic angle for all 11
    ...colors
  };
});

const collectionProducts = JSON.parse(JSON.stringify(catalogProducts));

async function initDynamicCollection() {
  try {
    const res = await fetch('/api/collection');
    if (!res.ok) throw new Error("Status: " + res.status);
    const fetched = await res.json();
    const visibleProducts = fetched.filter(p => p.isVisible === true || p.isVisible === 'true');
    collectionProducts.length = 0;
    visibleProducts.forEach(p => {
      collectionProducts.push({
        _id: p._id,
        name: p.name,
        category: p.category || 'detergent',
        desc: p.desc || '',
        packaging: p.packaging || '',
        image: p.image || '',
        badge: (p.badge && p.badge !== 'none') ? p.badgeText || p.badge : '',
        bgImage: p.bgImage || '',
        price: p.price || 0,
        oldPrice: p.oldPrice || null,
        rating: p.rating || 5
      });
    });
  } catch (err) {
    console.warn("Failed to load collection products from database, using static fallback:", err);
  } finally {
    renderQuickMenu();
    initScrollReveal();
  }
}

// --- State Management ---
let activeIndex = 0;
let isTransitioning = false;
let mobileShowcaseTimer = null;

function startMobileAutoPlay() {
  if (mobileShowcaseTimer) clearInterval(mobileShowcaseTimer);
  mobileShowcaseTimer = setInterval(() => {
    if (window.innerWidth <= 768) {
      if (isTransitioning) return;
      const nextIndex = (activeIndex + 1) % heroProducts.length;
      changeProduct(nextIndex);
    }
  }, 8000); // 8 seconds auto rotation
}

// --- DOM Elements ---
const showcaseOrbit = document.getElementById("showcase-orbit");
const showcaseGlow = document.getElementById("showcase-glow");
const activeProductImg = document.getElementById("active-product-img");
const heroCta = document.getElementById("hero-cta");
const sliderDotsContainer = document.getElementById("slider-dots");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const header = document.getElementById("header");
const navLinks = document.querySelectorAll(".nav-link");
const inquiryForm = document.getElementById("inquiry-form");
const successModal = document.getElementById("success-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const qmCarousel = document.getElementById("qm-carousel");
const qmPrev = document.getElementById("qm-prev");
const qmNext = document.getElementById("qm-next");
const mobileNavToggle = document.getElementById("mobile-nav-toggle");
const navRightGlass = document.querySelector(".nav-right-glass");

// --- Mobile Nav Menu Toggle ---
if (mobileNavToggle && navRightGlass) {
  mobileNavToggle.addEventListener("click", () => {
    const isExpanded = mobileNavToggle.classList.toggle("active");
    navRightGlass.classList.toggle("active");
    document.body.classList.toggle("menu-open");
    mobileNavToggle.setAttribute("aria-expanded", isExpanded);
  });
}

// --- Rotating Wheel Logic ---
function initShowcase() {
  if (!showcaseOrbit) return;

  // 0. Draw the continuous irregular connecting line
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "660");
  svg.setAttribute("height", "660");
  svg.style.position = "absolute";
  svg.style.left = "0";
  svg.style.top = "0";
  svg.style.zIndex = "0";

  const path = document.createElementNS(svgNS, "path");
  let d = "";
  for (let i = 0; i <= 360; i += 2) {
    const a = i * (Math.PI / 180);
    const r = 300 + Math.sin(a * 4) * 35; // Math matches the orbit items
    const x = 330 + r * Math.cos(a);
    const y = 330 + r * Math.sin(a);
    if (i === 0) d += `M ${x} ${y} `;
    else d += `L ${x} ${y} `;
  }
  d += "Z";
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "rgba(255, 255, 255, 0.4)");
  path.setAttribute("stroke-width", "2");

  svg.appendChild(path);
  showcaseOrbit.appendChild(svg);

  // 1. Build orbit items
  heroProducts.forEach((prod, index) => {
    const item = document.createElement("div");
    item.className = `orbit-item ${index === activeIndex ? 'active' : ''}`;
    item.dataset.index = index;

    // Position using trig baseAngle with an irregular wavy radius!
    const baseRadius = 300; 
    const centerX = 330; // Keep container 660x660
    const centerY = 330;
    const angleRad = prod.baseAngle * (Math.PI / 180);
    // Create an irregular organic pattern using a sine wave
    const r = baseRadius + Math.sin(angleRad * 4) * 35; 
    const x = centerX + r * Math.cos(angleRad) - 40; // 40 is half item width
    const y = centerY + r * Math.sin(angleRad) - 40; // 40 is half item height

    item.style.left = `${x}px`;
    item.style.top = `${y}px`;

    const img = document.createElement("img");
    img.src = prod.image;
    img.alt = prod.title || prod.name;
    item.appendChild(img);

    // Handle click
    item.addEventListener("click", () => {
      if (isTransitioning || activeIndex === index) return;
      changeProduct(index);
    });

    showcaseOrbit.appendChild(item);
  });

  // 2. Build dots
  heroProducts.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = `slider-dot ${index === activeIndex ? 'active' : ''}`;
    dot.addEventListener("click", () => {
      if (isTransitioning || activeIndex === index) return;
      changeProduct(index);
    });
    sliderDotsContainer.appendChild(dot);
  });

  // 3. Init initial positioning & styling
  updateOrbitRotations();

  // 4. Set initial background and theme colors
  const initialProd = heroProducts[0];
  document.documentElement.style.setProperty("--theme-bg-gradient", initialProd.bgGradient);
  document.documentElement.style.setProperty("--theme-shape-gradient", initialProd.shapeGradient || initialProd.bgGradient);
  document.documentElement.style.setProperty("--theme-accent", initialProd.accentColor);
  document.documentElement.style.setProperty("--theme-accent-light", initialProd.accentLight);
  document.documentElement.style.setProperty("--theme-glow", initialProd.glowColor);

  const heroShapeImg = document.getElementById("hero-shape-img");
  if (heroShapeImg) {
    const bgPath = initialProd.bgImage || customBgs[initialProd.name];
    if (bgPath) {
      heroShapeImg.style.backgroundImage = `url('${bgPath}')`;
      heroShapeImg.style.opacity = "0.35";
    } else {
      heroShapeImg.style.backgroundImage = "none";
      heroShapeImg.style.opacity = "0";
    }
  }
}

let currentRotation = 180;
let lastActiveIndex = 0;

function updateOrbitRotations() {
  const total = heroProducts.length;
  let diff = activeIndex - lastActiveIndex;
  
  // Calculate shortest path for infinite looping
  if (diff > total / 2) {
    diff -= total;
  } else if (diff < -total / 2) {
    diff += total;
  }
  
  currentRotation -= diff * (360 / total);
  lastActiveIndex = activeIndex;

  showcaseOrbit.style.transform = `rotate(${currentRotation}deg)`;

  // Keep thumbnail images vertical on the 2D track
  const orbitItems = document.querySelectorAll(".orbit-item");
  orbitItems.forEach((item) => {
    const img = item.querySelector("img");
    img.style.transform = `rotate(${-currentRotation}deg)`;
    
    // Toggle active class
    const idx = parseInt(item.dataset.index);
    if (idx === activeIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Update dots
  const dots = document.querySelectorAll(".slider-dot");
  dots.forEach((dot, idx) => {
    if (idx === activeIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

function changeProduct(index) {
  isTransitioning = true;
  activeIndex = index;
  const prod = heroProducts[activeIndex];
  const isMobile = window.innerWidth <= 768;
  const waveOverlay = document.getElementById("mobile-wave-overlay");

  if (isMobile && waveOverlay) {
    // Reset/restart mobile autoplay timer on product change
    startMobileAutoPlay();

    // Trigger Mobile Wave Wiping Animation (top to bottom)
    waveOverlay.style.background = prod.bgGradient;
    waveOverlay.classList.remove("animating");
    void waveOverlay.offsetWidth; // Reflow
    waveOverlay.classList.add("animating");

    // Mid-wave: update the 'Premium Cleaning' span color as wave passes over it (~1800ms)
    setTimeout(() => {
      document.documentElement.style.setProperty("--theme-accent", prod.accentColor);
      document.documentElement.style.setProperty("--theme-glow", prod.glowColor);
    }, 1800);

    // Fade out / slide down product image
    activeProductImg.classList.add("swapping");

    // Update Dots immediately
    updateOrbitRotations();

    // At 4000ms (transition finished and screen fully covered by wave), swap content, apply base colors, reset overlay
    setTimeout(() => {
      document.documentElement.style.setProperty("--theme-bg-gradient", prod.bgGradient);
      document.documentElement.style.setProperty("--theme-shape-gradient", prod.shapeGradient || prod.bgGradient);
      document.documentElement.style.setProperty("--theme-accent", prod.accentColor);
      document.documentElement.style.setProperty("--theme-accent-light", prod.accentLight);
      document.documentElement.style.setProperty("--theme-glow", prod.glowColor);

      activeProductImg.src = prod.image;
      
      const heroShapeImg = document.getElementById("hero-shape-img");
      if (heroShapeImg) {
        const bgPath = prod.bgImage || customBgs[prod.name];
        if (bgPath) {
          heroShapeImg.style.backgroundImage = `url('${bgPath}')`;
          heroShapeImg.style.opacity = "0.35";
        } else {
          heroShapeImg.style.backgroundImage = "none";
          heroShapeImg.style.opacity = "0";
        }
      }

      const detailTitle = document.getElementById("hero-detail-title");
      const detailDesc = document.getElementById("hero-detail-desc");
      const detailBadge = document.getElementById("hero-detail-badge");
      if (detailTitle) detailTitle.innerHTML = prod.title || prod.name;
      if (detailDesc) detailDesc.innerHTML = prod.desc;
      if (detailBadge) {
        detailBadge.innerHTML = prod.badge || prod.category;
        detailBadge.style.color = prod.accentColor;
      }

      // Remove swapping class to slide up new image from bottom to top!
      activeProductImg.classList.remove("swapping");
      
      // Instantly reset wave overlay back above the viewport
      waveOverlay.classList.remove("animating");
      isTransitioning = false;
    }, 4000);

  } else {
    // Desktop Transition (no wave overlay)
    activeProductImg.classList.add("swapping");
    updateOrbitRotations();

    document.documentElement.style.setProperty("--theme-bg-gradient", prod.bgGradient);
    document.documentElement.style.setProperty("--theme-shape-gradient", prod.shapeGradient || prod.bgGradient);
    document.documentElement.style.setProperty("--theme-accent", prod.accentColor);
    document.documentElement.style.setProperty("--theme-accent-light", prod.accentLight);
    document.documentElement.style.setProperty("--theme-glow", prod.glowColor);

    const heroShapeImg = document.getElementById("hero-shape-img");
    if (heroShapeImg) {
      heroShapeImg.style.opacity = "0";
    }

    setTimeout(() => {
      activeProductImg.src = prod.image;
      
      if (heroShapeImg) {
        const bgPath = prod.bgImage || customBgs[prod.name];
        if (bgPath) {
          heroShapeImg.style.backgroundImage = `url('${bgPath}')`;
          heroShapeImg.style.opacity = "0.35";
        } else {
          heroShapeImg.style.backgroundImage = "none";
          heroShapeImg.style.opacity = "0";
        }
      }
      
      const detailTitle = document.getElementById("hero-detail-title");
      const detailDesc = document.getElementById("hero-detail-desc");
      const detailBadge = document.getElementById("hero-detail-badge");
      if (detailTitle) detailTitle.innerHTML = prod.title || prod.name;
      if (detailDesc) detailDesc.innerHTML = prod.desc;
      if (detailBadge) {
        detailBadge.innerHTML = prod.badge || prod.category;
        detailBadge.style.color = prod.accentColor;
      }

      activeProductImg.classList.remove("swapping");

      setTimeout(() => {
        isTransitioning = false;
      }, 300);
    }, 400);
  }
}

// Arrow Nav (Home Showcase)
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (isTransitioning) return;
    let newIdx = activeIndex - 1;
    if (newIdx < 0) newIdx = heroProducts.length - 1;
    changeProduct(newIdx);
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    if (isTransitioning) return;
    let newIdx = activeIndex + 1;
    if (newIdx >= heroProducts.length) newIdx = 0;
    changeProduct(newIdx);
  });
}

// --- Product Popup Logic ---
function openProductPopup(p) {
  const popup = document.getElementById("product-popup");
  const popupCard = document.getElementById("product-popup-card");
  const popupImg = document.getElementById("popup-img");
  const popupBadge = document.getElementById("popup-badge");
  const popupTitle = document.getElementById("popup-title");
  const popupCategory = document.getElementById("popup-category");
  const popupDesc = document.getElementById("popup-desc");
  const popupPackagingVal = document.getElementById("popup-packaging-val");

  if (!popup || !popupCard) return;

  // Set data
  popupImg.src = p.image;
  popupImg.alt = p.name;
  popupTitle.innerText = p.name;
  popupDesc.innerText = p.desc;
  popupPackagingVal.innerHTML = p.packaging;
  
  // Badge handling
  if (p.badge) {
    popupBadge.innerText = p.badge;
    popupBadge.style.display = "inline-block";
  } else {
    popupBadge.style.display = "none";
  }

  // Prettify category label
  let prettyCategory = p.category;
  if (p.category === "detergent") prettyCategory = "Laundry & Detergent";
  else if (p.category === "disinfectant") prettyCategory = "Sanitizer & Disinfectant";
  else if (p.category === "handcare") prettyCategory = "Hand & Body Care";
  else if (p.category === "surface") prettyCategory = "Surface & Floor Cleaner";
  popupCategory.innerText = prettyCategory;

  // Theme Colors
  const colors = productColors[p.name] || categoryColors[p.category] || categoryColors.detergent;
  
  // Reset dynamic background colors
  popupCard.style.backgroundImage = "";
  popupCard.style.backgroundSize = "";
  popupCard.style.backgroundPosition = "";
  popupCard.style.backgroundColor = "";
  popupCard.style.color = "";
  
  // Reset text color styles
  popupTitle.style.color = "";
  popupDesc.style.color = "";
  const popupPackContainer = document.getElementById("popup-packaging");
  if (popupPackContainer) popupPackContainer.style.color = "";
  popupCategory.style.color = colors.accentColor;
  popupBadge.style.backgroundColor = colors.accentColor;

  const actionBtn = popupCard.querySelector(".popup-action-btn");
  if (actionBtn) {
    actionBtn.style.setProperty("background-color", colors.accentColor, "important");
    actionBtn.style.setProperty("box-shadow", `0 6px 15px ${colors.glowColor}`, "important");
  }

  // Set card background matching the clicked item
  const bgPath = p.bgImage || customBgs[p.name];
  if (bgPath) {
    popupCard.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('${bgPath}')`;
    popupCard.style.backgroundSize = "cover";
    popupCard.style.backgroundPosition = "center";
    popupCard.style.color = "#000000";
    
    popupTitle.style.color = "#000000";
    popupDesc.style.color = "rgba(0, 0, 0, 0.8)";
    if (popupPackContainer) popupPackContainer.style.color = "rgba(0, 0, 0, 0.8)";
  } else {
    popupCard.style.background = colors.bgGradient;
  }

  // Open the Modal
  popup.classList.add("active");
  document.body.classList.add("modal-open");
}

function closeProductPopup() {
  const popup = document.getElementById("product-popup");
  if (popup) {
    popup.classList.remove("active");
  }
  document.body.classList.remove("modal-open");
}

// --- Quick Menu Carousel ---
function renderQuickMenu() {
  if (!qmCarousel) return;
  qmCarousel.innerHTML = "";
  
  collectionProducts.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "qm-card reveal reveal-scale";
    card.style.transitionDelay = `${index * 100}ms`;
    
    const shortDesc = p.desc.split(" ").slice(0, 5).join(" ") + "...";
    
    card.innerHTML = `
      <div class="qm-img-wrapper">
        <img src="${p.image}" alt="${p.name}" class="qm-img">
      </div>
      <h4 class="qm-card-title">${p.name}</h4>
      <p class="qm-card-desc">${shortDesc}</p>
    `;

    // Apply custom background image for specific products
    const bgPath = p.bgImage || customBgs[p.name];
    if (bgPath) {
      // Add a light fade overlay using linear-gradient over the image
      card.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url('${bgPath}')`;
      card.style.backgroundSize = "cover";
      card.style.backgroundPosition = "center";
      card.style.color = "#000"; // Deep black text
      
      const title = card.querySelector(".qm-card-title");
      const desc = card.querySelector(".qm-card-desc");
      if (title) title.style.color = "#000";
      if (desc) desc.style.color = "rgba(0, 0, 0, 0.8)"; // Slightly softer black for description

      // Make the small circle highly visible against the custom background!
      const imgWrapper = card.querySelector(".qm-img-wrapper");
      if (imgWrapper) {
        imgWrapper.style.background = "rgba(255, 255, 255, 0.85)"; // Solid white circle
        imgWrapper.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
      }
    }
    
    // Touch tracking to avoid accidental clicks when swiping/scrolling on mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    card.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    card.addEventListener("touchend", (e) => {
      const touch = e.changedTouches[0];
      const diffX = Math.abs(touch.clientX - touchStartX);
      const diffY = Math.abs(touch.clientY - touchStartY);
      const duration = Date.now() - touchStartTime;

      // If dragged horizontally or vertically, or held too long, do not trigger
      if (diffX > 10 || diffY > 10 || duration > 350) {
        return;
      }
      
      // Prevent double trigger: click listener also listens for clicks
      e.preventDefault();
      openProductPopup(p);
    }, { passive: false });

    // Fallback/standard click for PC (ignored on mobile if touched recently)
    card.addEventListener("click", (e) => {
      if (Date.now() - touchStartTime < 500) {
        return;
      }
      openProductPopup(p);
    });
    
    qmCarousel.appendChild(card);
  });
  
  // Arrow navigation
  qmPrev.addEventListener("click", () => {
    qmCarousel.scrollBy({ left: -300, behavior: 'smooth' });
  });
  qmNext.addEventListener("click", () => {
    qmCarousel.scrollBy({ left: 300, behavior: 'smooth' });
  });
}

// --- Sticky Header Class Toggle ---
let headerTicking = false;
window.addEventListener("scroll", () => {
  if (!headerTicking) {
    requestAnimationFrame(() => {
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
      headerTicking = false;
    });
    headerTicking = true;
  }
}, { passive: true });

// Smooth nav scroll clicks
navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    // Close mobile menu if active
    if (mobileNavToggle && mobileNavToggle.classList.contains("active")) {
      mobileNavToggle.classList.remove("active");
      navRightGlass.classList.remove("active");
      document.body.classList.remove("menu-open");
      mobileNavToggle.setAttribute("aria-expanded", "false");
    }

    const targetId = link.getAttribute("href");
    
    // Only intercept if it's an anchor link starting with #, or if we want to scroll to a section on the same page
    if (targetId.startsWith("#")) {
      e.preventDefault();
      const targetSec = document.querySelector(targetId);
      if (targetSec) {
        window.scrollTo({
          top: targetSec.offsetTop - 80,
          behavior: "smooth"
        });
      }
    } else {
      // Force navigation for standard links (like blog.html) to prevent mobile menu from interrupting
      if (targetId && targetId !== "#") {
        window.location.href = targetId;
      }
    }
  });
});

// --- Inquiry Form Submission & Modal Handling ---
if (inquiryForm) {
  inquiryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const submitBtn = inquiryForm.querySelector(".form-submit-btn");
    const origText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending Enquiry...";

    const name = document.getElementById("contact-name").value;
    const company = document.getElementById("company-name").value;
    const email = document.getElementById("contact-email").value;
    const phone = document.getElementById("contact-phone").value;
    const message = document.getElementById("message").value;

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, company, email, phone, message })
      });

      const result = await response.json();

      if (response.ok) {
        // Show success modal
        if (successModal) successModal.classList.add("active");
        inquiryForm.reset();
      } else {
        alert(result.error || "Failed to send enquiry. Please try again.");
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      alert("A network error occurred. Please try again.");
    } finally {
      // Reset submit button state
      submitBtn.disabled = false;
      submitBtn.textContent = origText;
    }
  });
}

// Close success modal
if (closeModalBtn && successModal) {
  closeModalBtn.addEventListener("click", () => {
    successModal.classList.remove("active");
  });

  // Click outside modal content closes it
  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) {
      successModal.classList.remove("active");
    }
  });
}

// Close product details popup modal
const productPopup = document.getElementById("product-popup");
const popupCloseBtn = document.getElementById("popup-close-btn");

if (popupCloseBtn && productPopup) {
  popupCloseBtn.addEventListener("click", closeProductPopup);

  // Click outside modal content closes it
  productPopup.addEventListener("click", (e) => {
    if (e.target === productPopup) {
      closeProductPopup();
    }
  });
}

// Global ESC key listener to close active modals
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeProductPopup();
    if (successModal) successModal.classList.remove("active");
  }
});

// --- Mobile Hands Scroll Entrance ---
function initMobileHandsScroll() {
  const handLeft = document.getElementById("mobile-hand-left");
  const handRight = document.getElementById("mobile-hand-right");
  
  if (!handLeft || !handRight) return;
  
  let handsTicking = false;
  window.addEventListener("scroll", () => {
    if (window.innerWidth > 768) return;
    
    if (!handsTicking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / 300, 1);
        
        const leftTranslate = -100 + (progress * 65);
        const rightTranslate = 100 - (progress * 75);
        
        handLeft.style.transform = `translateX(${leftTranslate}%)`;
        handRight.style.transform = `translateX(${rightTranslate}%)`;
        handsTicking = false;
      });
      handsTicking = true;
    }
  }, { passive: true });
}

// --- Mobile Truck Scroll Animation ---
function initMobileTruckScroll() {
  const truck     = document.getElementById('mobile-truck-vehicle');
  const scene     = document.getElementById('mobile-truck-scene');
  const tireFront = document.getElementById('tire-front');
  const tireRear  = document.getElementById('tire-rear');
  if (!truck || !scene) return;

  let prevTranslateX   = -110;   // last known truck position (%)
  let frontRotation    = 0;      // cumulative rotation degrees
  let rearRotation     = 0;

  const DEG_PER_PERCENT = 4.7;
  let truckTicking = false;

  window.addEventListener('scroll', () => {
    if (window.innerWidth > 768) return;

    if (!truckTicking) {
      requestAnimationFrame(() => {
        const sceneRect = scene.getBoundingClientRect();
        const viewH     = window.innerHeight;

        const rawProgress = 1 - (sceneRect.bottom / (viewH + sceneRect.height));
        const progress    = Math.max(0, Math.min(1, rawProgress));

        const translateX = -110 + (progress * 220);

        const delta = translateX - prevTranslateX;
        prevTranslateX = translateX;

        frontRotation += delta * DEG_PER_PERCENT;
        rearRotation  += delta * DEG_PER_PERCENT;

        truck.style.transform = `translateX(${translateX}%)`;
        if (tireFront) tireFront.style.transform = `rotate(${frontRotation}deg)`;
        if (tireRear)  tireRear.style.transform  = `rotate(${rearRotation}deg)`;
        truckTicking = false;
      });
      truckTicking = true;
    }
  }, { passive: true });
}

// --- Scroll Reveal Animation Observer ---
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal:not(.active), .reveal-card-top:not(.active)");
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null, // use viewport
    rootMargin: "0px 0px -80px 0px", // triggers slightly before entering view
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        obs.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

// --- Dynamic Support Agents Integration ---
function initWhatsAppSupport() {
  const floatingBtn = document.querySelector('.floating-whatsapp-btn');
  const indexButtonsContainer = document.getElementById('index-whatsapp-buttons');
  const defaultPhone = '971555292167';

  // 1. Setup floating button
  if (floatingBtn) {
    floatingBtn.href = `https://wa.me/${defaultPhone}`;
    floatingBtn.setAttribute('target', '_blank');
  }

  // 2. Setup index homepage buttons
  if (indexButtonsContainer) {
    indexButtonsContainer.innerHTML = `
      <a href="https://wa.me/${defaultPhone}" target="_blank" class="whatsapp-btn whatsapp-btn-main">
        <img src="asset/whatsapp logo.png" alt="WhatsApp" style="width: 20px; height: 20px; object-fit: contain; margin-right: 8px; vertical-align: middle;">
        Chat with Sales
      </a>
      <a href="https://wa.me/${defaultPhone}" target="_blank" class="whatsapp-btn whatsapp-btn-outline">
        <img src="asset/whatsapp logo.png" alt="WhatsApp" style="width: 20px; height: 20px; object-fit: contain; margin-right: 8px; vertical-align: middle;">
        WhatsApp Support
      </a>
    `;
  }

  // 3. Set global product redirection phone variable
  window.whatsappProductPhone = defaultPhone;
}

// --- Initialize Everything ---
window.addEventListener("DOMContentLoaded", () => {
  initShowcase();
  initDynamicCollection();
  initCatalogToggle();
  startMobileAutoPlay();
  initMobileHandsScroll();
  initMobileTruckScroll();
  initScrollReveal();
  initWhatsAppSupport();
});

// --- Wholesale Catalog View More Toggle (Products Page) ---
function initCatalogToggle() {
  const viewMoreBtn = document.getElementById("view-more-btn");
  const hiddenCards = document.querySelectorAll(".catalog-items-grid .catalog-card.hidden");
  
  if (viewMoreBtn && hiddenCards.length > 0) {
    viewMoreBtn.addEventListener("click", () => {
      const isExpanding = viewMoreBtn.classList.toggle("expanded");
      
      hiddenCards.forEach(card => {
        if (isExpanding) {
          card.classList.remove("hidden");
          // Add subtle fade-in animation
          card.style.opacity = "0";
          card.style.transform = "translateY(15px)";
          card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        } else {
          card.classList.add("hidden");
        }
      });

      if (isExpanding) {
        viewMoreBtn.innerHTML = `Show Less <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
      } else {
        viewMoreBtn.innerHTML = `View More <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
        // Scroll back up to the catalog list start
        const catalogList = document.getElementById("catalog-list");
        if (catalogList) {
          window.scrollTo({
            top: catalogList.offsetTop - 80,
            behavior: "smooth"
          });
        }
      }
    });
  }
}
