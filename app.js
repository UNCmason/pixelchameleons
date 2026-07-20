/* CamoBit site — gallery + pixel field */
const IMG = "https://pixelchameleons.s3.filebase.io/images";

/** Featured set for gallery + hero */
const FEATURED = [
  { id: 0, name: "Genesis Bit", tier: "1/1 Legendary", tags: ["legendary", "gradient"], body: "Rainbow", note: "Gradient Void · Crystal · Holo" },
  { id: 1, name: "Prime Scale", tier: "1/1 Legendary", tags: ["legendary"], body: "Diamond", note: "Diamond Sky · Crystal floor" },
  { id: 7, name: "Lucky Bit", tier: "1/1 Legendary", tags: ["legendary", "laser", "gradient"], body: "Gold", note: "Gold Laser · Orchid" },
  { id: 13, name: "Unlucky Charm", tier: "1/1 Legendary", tags: ["legendary"], body: "Onyx", note: "Blood Moon · Void Gaze" },
  { id: 42, name: "Oracle Bit", tier: "1/1 Legendary", tags: ["legendary", "gradient"], body: "Amethyst", note: "Aurora · Third Eye" },
  { id: 69, name: "Blush Boss", tier: "1/1 Legendary", tags: ["legendary", "habitat"], body: "Rose", note: "Flower Bed · Blush" },
  { id: 88, name: "Double Luck", tier: "1/1 Legendary", tags: ["legendary", "habitat"], body: "Rose", note: "Tall Grass · Twin Bugs" },
  { id: 100, name: "Century Scale", tier: "1/1 Legendary", tags: ["legendary", "habitat"], body: "Emerald", note: "Jungle Floor · Canopy" },
  { id: 111, name: "Triple One", tier: "1/1 Legendary", tags: ["legendary", "laser", "gradient"], body: "Holo", note: "Neon · Laser Visor" },
  { id: 222, name: "Angelic", tier: "1/1 Legendary", tags: ["legendary", "habitat"], body: "Pearl", note: "Ferns · Flower Bloom" },
  { id: 333, name: "Inferno King", tier: "1/1 Legendary", tags: ["legendary", "laser", "gradient"], body: "Inferno", note: "Sunset · Lava Rock" },
  { id: 420, name: "Leaf Lord", tier: "1/1 Legendary", tags: ["legendary", "habitat", "gradient"], body: "Toxic", note: "Mushroom Ring · Leaf" },
  { id: 555, name: "Galaxy Drift", tier: "1/1 Legendary", tags: ["legendary", "gradient"], body: "Galaxy", note: "Void · Crystal" },
  { id: 666, name: "Void Serpent", tier: "1/1 Legendary", tags: ["legendary", "laser"], body: "Onyx", note: "Red Laser · Rock" },
  { id: 777, name: "Jackpot Bit", tier: "1/1 Legendary", tags: ["legendary", "laser", "gradient"], body: "Rainbow", note: "Gold Laser · Palm" },
  { id: 800, name: "Neon Pulse", tier: "1/1 Legendary", tags: ["legendary", "laser", "gradient"], body: "Cyan", note: "Bamboo · Laser" },
  { id: 998, name: "Final Form", tier: "1/1 Legendary", tags: ["legendary", "gradient"], body: "Galaxy", note: "Aurora · Hypno" },
  // wild variety
  { id: 6, name: "CamoBit #006", tier: "Uncommon", tags: ["habitat"], body: "Lime", note: "Shades · Sand · Flower Vine" },
  { id: 8, name: "CamoBit #008", tier: "Uncommon", tags: ["habitat", "gradient"], body: "Teal", note: "Shades · Ocean gradient" },
  { id: 14, name: "CamoBit #014", tier: "Uncommon", tags: ["habitat"], body: "Solar", note: "Cool lens · Cactus" },
  { id: 18, name: "CamoBit #018", tier: "Rare", tags: ["gradient", "habitat"], body: "Emerald", note: "Dawn · Lily Pad" },
  { id: 23, name: "CamoBit #023", tier: "Epic", tags: ["gradient", "habitat"], body: "Lime", note: "Hypno · Mushrooms" },
  { id: 34, name: "CamoBit #034", tier: "Epic", tags: ["laser", "gradient"], body: "Azure", note: "Laser Visor · Gold sky" },
  { id: 40, name: "CamoBit #040", tier: "Mythic", tags: ["laser", "gradient"], body: "Rainbow", note: "Red Laser · Neon" },
  { id: 46, name: "CamoBit #046", tier: "Rare", tags: ["laser", "habitat"], body: "Cyan", note: "Laser · Ivy Wall" },
  { id: 53, name: "CamoBit #053", tier: "Uncommon", tags: ["habitat"], body: "Lime", note: "3D Glasses · Orchid" },
  { id: 64, name: "CamoBit #064", tier: "Rare", tags: ["habitat"], body: "Rose", note: "Holo eyes · Snow" },
  { id: 82, name: "CamoBit #082", tier: "Epic", tags: ["habitat"], body: "Holo", note: "Orchid · Jungle" },
  { id: 103, name: "CamoBit #103", tier: "Rare", tags: ["habitat"], body: "Toxic", note: "VR · Crystal" },
];

const TRAITS = [
  { title: "Background", body: "Solids (Sky, Night, Forest…) plus rare Gradient Dawn / Ocean / Sunset / Aurora / Neon / Gold / Void skies for high-score rolls & 1/1s." },
  { title: "Ground", body: "23 habitat floors: moss, lily pad, jungle floor, bamboo edge, mushroom ring, lava rock, crystal, reeds…" },
  { title: "Plants", body: "Scene plants — hanging vines, canopy leaves, orchids, palm fronds, fern arches. Never glued as body stickers." },
  { title: "Body", body: "Emerald → Rainbow, Galaxy, Holo, Diamond, Inferno, Toxic… smooth cel paint on a 72×72 grid." },
  { title: "Eyes", body: "One side-eye. Normal blinks. Shades = one lens, no blink. Lasers fire a single beam from that eye." },
  { title: "Hat", body: "Leaf, crown, mushroom, cowboy, astronaut, diamond crown… or none." },
  { title: "Mouth", body: "Smile, tongue, fangs, cigar, pipe, gold grill, fire tongue — expression + a bit of attitude." },
  { title: "Extra", body: "Jungle life only: bugs, cricket, dragonfly, dew, berry, vine, firefly, snail — what a CamoBit actually meets." },
];

const pad = (n) => String(n).padStart(3, "0");
const gifUrl = (id) => `${IMG}/${pad(id)}.gif`;

function tierClass(tier) {
  if (tier.includes("1/1")) return "tier-legendary";
  if (tier.includes("Mythic")) return "tier-mythic";
  if (tier.includes("Epic") || tier.includes("Legendary")) return "tier-epic";
  return "tier-rare";
}

/* ---------- Nav ---------- */
const nav = document.querySelector(".nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});
navLinks?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

/* ---------- Hero ---------- */
const heroGif = document.getElementById("heroGif");
const heroName = document.getElementById("heroName");
const heroTier = document.getElementById("heroTier");
const heroThumbs = document.getElementById("heroThumbs");

const HERO_IDS = [0, 7, 100, 333, 420, 555, 777, 998];

/** Single clean label: #042 or #000 Genesis Bit — never double ids */
function itemLabel(item) {
  const id = `#${pad(item.id)}`;
  if (!item.name || item.name.startsWith("CamoBit")) return id;
  // strip any leading #123 / CamoBit #123 from special names
  let name = String(item.name)
    .replace(/^CamoBit\s*#?\d+\s*/i, "")
    .replace(/^#\d+\s*/, "")
    .trim();
  if (!name || name === id) return id;
  // if name is only the number again, skip it
  if (name === String(item.id) || name === pad(item.id) || name === `#${pad(item.id)}`) return id;
  return `${id} ${name}`;
}

function setHero(item) {
  heroGif.src = gifUrl(item.id);
  heroGif.alt = `${item.name} animated CamoBit`;
  heroName.textContent = itemLabel(item);
  heroTier.textContent = item.tier;
  heroTier.className = `tier ${tierClass(item.tier)}`;
  heroThumbs.querySelectorAll("button").forEach((b) => {
    b.classList.toggle("active", Number(b.dataset.id) === item.id);
  });
}

const SPECIAL_NAMES = Object.fromEntries(
  FEATURED.filter((f) => !f.name.startsWith("CamoBit")).map((f) => [f.id, f.name])
);

function buildHeroThumbs() {
  HERO_IDS.forEach((id, i) => {
    const item = FEATURED.find((f) => f.id === id) || { id, name: `#${pad(id)}`, tier: "Featured" };
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.id = id;
    if (i === 0) btn.classList.add("active");
    btn.innerHTML = `<img src="${gifUrl(id)}" alt="" loading="lazy" width="56" height="56" />`;
    btn.addEventListener("click", () => setHero(item));
    heroThumbs.appendChild(btn);
  });
}

/* ---------- Gallery ---------- */
const galleryGrid = document.getElementById("galleryGrid");
const filters = document.getElementById("filters");

function buildGallery() {
  galleryGrid.innerHTML = "";
  FEATURED.forEach((item, idx) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "g-card";
    card.style.animationDelay = `${(idx % 8) * 0.04}s`;
    card.dataset.tags = item.tags.join(" ");
    card.innerHTML = `
      <img src="${gifUrl(item.id)}" alt="${item.name}" loading="lazy" width="280" height="280" />
      <div class="g-meta">
        <span class="id">${itemLabel(item)}</span>
        <span class="sub">${item.note}</span>
        <span class="tier ${tierClass(item.tier)}">${item.tier}</span>
      </div>
    `;
    card.addEventListener("click", () => {
      setHero(item);
      document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
    });
    galleryGrid.appendChild(card);
  });
}

filters?.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  filters.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  const f = chip.dataset.filter;
  galleryGrid.querySelectorAll(".g-card").forEach((card) => {
    const tags = card.dataset.tags || "";
    const show = f === "all" || tags.includes(f);
    card.classList.toggle("hidden", !show);
  });
});

/* ---------- Traits ---------- */
function buildTraits() {
  const grid = document.getElementById("traitGrid");
  TRAITS.forEach((t) => {
    const el = document.createElement("article");
    el.className = "trait-card";
    el.innerHTML = `<h3>${t.title}</h3><p>${t.body}</p>`;
    grid.appendChild(el);
  });
}

/* ---------- Pixel field canvas ---------- */
function initPixelField() {
  const canvas = document.getElementById("px-field");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  const dots = [];
  const COLORS = ["#7dff6a", "#3df0ff", "#ffd24a", "#ff6bb5", "#4dffc3"];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(n = 40) {
    dots.length = 0;
    for (let i = 0; i < n; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        s: Math.random() < 0.7 ? 2 : 3,
        vy: 0.15 + Math.random() * 0.45,
        vx: (Math.random() - 0.5) * 0.2,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        a: 0.15 + Math.random() * 0.35,
      });
    }
  }

  let last = 0;
  function frame(t) {
    if (t - last < 33) {
      requestAnimationFrame(frame);
      return;
    }
    last = t;
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.y += d.vy;
      d.x += d.vx;
      if (d.y > h) {
        d.y = -4;
        d.x = Math.random() * w;
      }
      ctx.globalAlpha = d.a;
      ctx.fillStyle = d.c;
      ctx.fillRect(d.x | 0, d.y | 0, d.s, d.s);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  resize();
  spawn(window.innerWidth < 720 ? 28 : 48);
  window.addEventListener("resize", () => {
    resize();
    spawn(window.innerWidth < 720 ? 28 : 48);
  });
  requestAnimationFrame(frame);
}

/* ---------- Boot ---------- */
buildHeroThumbs();
setHero(FEATURED[0]);
buildGallery();
buildTraits();
initPixelField();

// gentle hero rotation
let rot = 0;
const rotateHero = () => {
  rot = (rot + 1) % HERO_IDS.length;
  const item = FEATURED.find((f) => f.id === HERO_IDS[rot]) || FEATURED[0];
  setHero(item);
};
setInterval(rotateHero, 7000);
