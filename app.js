/* CamoBits — banner project site + mint + banner lab */
const CONTRACT = "0x4314F790d6F4b48BB8699C97C0f698A95fA7F3AD";
const CHAIN_ID = 4663n;
const CHAIN_HEX = "0x1237";
const RPC = "https://rpc.mainnet.chain.robinhood.com";
const EXPLORER = "https://robinhoodchain.blockscout.com";
const MAX = 4444;
const BANNER_W = 1500;
const BANNER_H = 500;

const ABI = [
  "function mint(uint256 quantity) payable",
  "function mintPriceWei() view returns (uint256)",
  "function totalMinted() view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function treasury() view returns (address)",
  "function tokenURI(uint256) view returns (string)",
  "function ownerOf(uint256) view returns (address)",
];

/* ---------- Deterministic art ---------- */
function rng(tokenId, salt) {
  let h = 2166136261 >>> 0;
  const s = `camobits_v7_rh_green_4444|${tokenId}|${salt}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function bodyColor(id) {
  const colors = [
    "#32c864", "#8ce63c", "#28aaa0", "#468ce6", "#965ad2", "#f082aa",
    "#f08c32", "#f0d232", "#e64646", "#32d2e6", "#f0be28", "#b478ff",
  ];
  return colors[rng(id, 3) % colors.length];
}

function bgColor(id) {
  const r = rng(id, 1) % 100;
  if (r < 72) return "#CDFF00";
  if (r < 88) return "#00C805";
  if (r < 94) return "#1e2037";
  return "#78e6a0";
}

function accentColor(id) {
  const colors = ["#00C805", "#32c864", "#ff64a0", "#32d2e6", "#f0be28", "#b478ff", "#CDFF00"];
  return colors[rng(id, 9) % colors.length];
}

function nameOf(id) {
  const specials = {
    0: "Genesis Bit", 1: "Prime Scale", 7: "Lucky Bit", 13: "Unlucky Charm",
    42: "Oracle Bit", 69: "Blush Boss", 88: "Double Luck", 100: "Century Scale",
    111: "Triple One", 222: "Angelic", 333: "Inferno King", 420: "Leaf Lord",
    555: "Galaxy Drift", 666: "Void Serpent", 777: "Jackpot Bit",
    1111: "Quad One", 2222: "Double Angel", 3333: "Triple Inferno",
    4200: "Mega Leaf", 4443: "Final Form",
  };
  return specials[id] || `CamoBit #${id}`;
}

/** Square SVG art (on-chain style) */
function tokenSvgInner(id) {
  const bg = bgColor(id);
  const body = bodyColor(id);
  let iris = "#ffffff";
  if (rng(id, 4) % 10 > 7) iris = "#1a1a1a";
  if (rng(id, 4) % 17 === 0) iris = "#ff4444";
  return `
  <rect width="72" height="72" fill="${bg}"/>
  <rect y="58" width="72" height="14" fill="#3d8c3a"/>
  <path d="M24 50 C18 48 10 46 9 50 C8 56 14 60 18 58 C22 56 20 50 14 51 C10 52 11 57 16 57 C20 57 22 53 18 52" fill="none" stroke="${body}" stroke-width="2.6" stroke-linecap="round"/>
  <ellipse cx="38" cy="48" rx="13" ry="10" fill="${body}"/>
  <ellipse cx="51" cy="42" rx="9" ry="8.5" fill="${body}"/>
  <circle cx="54" cy="41" r="5.2" fill="${iris}" stroke="#000" stroke-width="1"/>
  <circle cx="55" cy="41" r="2.2" fill="#111"/>
  <circle cx="56" cy="40" r="0.8" fill="#fff"/>
  <rect x="28" y="56" width="2" height="6" fill="${body}"/>
  <rect x="34" y="56" width="2" height="6" fill="${body}"/>
  <rect x="44" y="56" width="2" height="6" fill="${body}"/>
  <rect x="50" y="56" width="2" height="6" fill="${body}"/>
`;
}

function tokenSvg(id, size = 72) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="${size}" height="${size}" shape-rendering="crispEdges">${tokenSvgInner(id)}</svg>`;
}

/** X/Twitter banner 1500×500 — full-bleed, safe-zone friendly */
function bannerSvg(id) {
  const bg = bgColor(id);
  const body = bodyColor(id);
  const accent = accentColor(id);
  const name = nameOf(id);
  const pattern = rng(id, 11) % 3;
  const secondId = (id + 777) % MAX;
  const thirdId = (id + 1337) % MAX;

  // layout: big bit left (safe from avatar crop), smaller bits trailing right
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${BANNER_W}" height="${BANNER_H}" viewBox="0 0 ${BANNER_W} ${BANNER_H}">
  <defs>
    <linearGradient id="g${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="28%" stop-color="${accent}"/>
      <stop offset="62%" stop-color="${body}"/>
      <stop offset="100%" stop-color="#0d1a12"/>
    </linearGradient>
    <linearGradient id="sh${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.28"/>
    </linearGradient>
    <filter id="soft${id}"><feGaussianBlur stdDeviation="18"/></filter>
    <pattern id="px${id}" width="24" height="24" patternUnits="userSpaceOnUse">
      <rect width="24" height="24" fill="none"/>
      <rect width="2" height="2" fill="#000" opacity="0.06"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#g${id})"/>
  ${pattern === 1 ? `<rect width="100%" height="100%" fill="url(#px${id})"/>` : ""}
  <circle cx="180" cy="90" r="200" fill="${body}" opacity="0.14" filter="url(#soft${id})"/>
  <circle cx="1280" cy="420" r="240" fill="#CDFF00" opacity="0.1" filter="url(#soft${id})"/>
  <circle cx="900" cy="80" r="120" fill="${accent}" opacity="0.1" filter="url(#soft${id})"/>
  <rect width="100%" height="100%" fill="url(#sh${id})"/>

  <!-- primary CamoBit (left third — clear of X avatar mask) -->
  <g transform="translate(90,55) scale(5.4)" shape-rendering="crispEdges">
    ${tokenSvgInner(id)}
  </g>

  <!-- supporting bits mid-right for "collection of banners" feel -->
  <g transform="translate(980,70) scale(2.4)" opacity="0.92" shape-rendering="crispEdges">
    ${tokenSvgInner(secondId)}
  </g>
  <g transform="translate(1200,220) scale(2.0)" opacity="0.78" shape-rendering="crispEdges">
    ${tokenSvgInner(thirdId)}
  </g>

  <!-- label block -->
  <rect x="680" y="155" width="12" height="120" rx="4" fill="#0a0c08" opacity="0.35"/>
  <text x="710" y="200" fill="#0a0c08" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="48" font-weight="700">${escapeXml(name)}</text>
  <text x="710" y="250" fill="#0a0c08" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="26" opacity="0.78">CamoBits · #${id} · Robinhood</text>
  <text x="710" y="295" fill="#0a0c08" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="20" opacity="0.55">1500×500 · X / Twitter banner</text>
  <rect x="710" y="325" width="200" height="7" rx="3.5" fill="#0a0c08" opacity="0.3"/>
</svg>`;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function svgToDataUrl(svg) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ---------- Chameleon gradient canvas (slow color morph) ---------- */
function initChameleonBg() {
  const c = document.getElementById("bg-canvas");
  if (!c) return;
  const ctx = c.getContext("2d", { alpha: false });
  let w = 0;
  let h = 0;
  const t0 = performance.now();
  // chameleon palette — hood yellow → greens → teal → pink → gold
  const colors = [
    [205, 255, 0],
    [0, 200, 5],
    [50, 200, 100],
    [40, 170, 160],
    [70, 140, 220],
    [180, 90, 210],
    [255, 100, 160],
    [240, 190, 40],
  ];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = w + "px";
    c.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function mix(a, b, t) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t),
    ];
  }

  function sample(t, offset) {
    const x = t + offset;
    const i = Math.floor(x) % colors.length;
    const j = (i + 1) % colors.length;
    const f = x - Math.floor(x);
    // smoothstep for softer chameleon blend
    const s = f * f * (3 - 2 * f);
    return mix(colors[i < 0 ? i + colors.length : i], colors[j], s);
  }

  function frame(now) {
    const t = reduceMotion ? 0.3 : (now - t0) / 14000; // ~14s per hue step
    const c1 = sample(t, 0);
    const c2 = sample(t, 1.7);
    const c3 = sample(t, 3.4);
    const c4 = sample(t, 5.1);

    // drifting multi-stop gradient (angle slowly rotates)
    const ang = reduceMotion ? 0.6 : (now - t0) / 28000;
    const cx = w * (0.5 + 0.25 * Math.sin(ang));
    const cy = h * (0.45 + 0.2 * Math.cos(ang * 0.8));
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.95);
    g.addColorStop(0, `rgb(${c1.join(",")})`);
    g.addColorStop(0.35, `rgb(${c2.join(",")})`);
    g.addColorStop(0.7, `rgb(${c3.join(",")})`);
    g.addColorStop(1, `rgb(${c4.join(",")})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // secondary diagonal wash
    const g2 = ctx.createLinearGradient(0, 0, w, h);
    g2.addColorStop(0, `rgba(${c3.join(",")},0.35)`);
    g2.addColorStop(0.5, "rgba(7,10,8,0)");
    g2.addColorStop(1, `rgba(${c1.join(",")},0.3)`);
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);

    // readability overlay — dark enough for UI, light enough to see camo shift
    ctx.fillStyle = "rgba(6,9,7,0.68)";
    ctx.fillRect(0, 0, w, h);

    if (!reduceMotion) requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (reduceMotion) frame(performance.now());
  });
  requestAnimationFrame(frame);
}

/* ---------- Featured banner strip ---------- */
const FEATURED_CORE = [0, 1, 7, 13, 42, 69, 88, 100, 111, 222, 333, 420, 555, 666, 777, 1111, 2222, 3333, 4200, 4443];

function pickFeatured(count = 12) {
  const pool = [...FEATURED_CORE];
  // sprinkle random IDs for variety
  while (pool.length < count + 8) {
    pool.push(Math.floor(Math.random() * MAX));
  }
  // shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const seen = new Set();
  const out = [];
  for (const id of pool) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= count) break;
  }
  return out;
}

function buildFeatured(ids) {
  const el = document.getElementById("bannerStrip");
  if (!el) return;
  el.innerHTML = "";
  (ids || pickFeatured(12)).forEach((id) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "banner-card";
    card.setAttribute("aria-label", `Load ${nameOf(id)} banner in lab`);
    card.innerHTML = `
      <img src="${svgToDataUrl(bannerSvg(id))}" alt="${nameOf(id)} banner 1500x500" width="450" height="150" loading="lazy" />
      <span>${nameOf(id)} · #${id}</span>
    `;
    card.addEventListener("click", () => {
      const input = document.getElementById("bannerId");
      if (input) {
        input.value = id;
        renderBannerLab();
        document.getElementById("lab")?.scrollIntoView({ behavior: "smooth" });
      }
    });
    el.appendChild(card);
  });
}

/* ---------- Banner lab ---------- */
function clampId(n) {
  let id = parseInt(n, 10);
  if (Number.isNaN(id) || id < 0) id = 0;
  if (id >= MAX) id = MAX - 1;
  return id;
}

function renderBannerLab() {
  const input = document.getElementById("bannerId");
  const preview = document.getElementById("bannerPreview");
  const label = document.getElementById("bannerLabel");
  if (!input || !preview) return;
  const id = clampId(input.value);
  input.value = id;
  const svg = bannerSvg(id);
  preview.src = svgToDataUrl(svg);
  preview.dataset.svg = svg;
  if (label) label.textContent = `${nameOf(id)} · #${id} · ${BANNER_W}×${BANNER_H} · X header`;
}

function downloadBanner(format) {
  const preview = document.getElementById("bannerPreview");
  const input = document.getElementById("bannerId");
  const id = clampId(input?.value || "0");
  const svg = preview?.dataset.svg || bannerSvg(id);
  if (format === "svg") {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `camobit-${id}-banner-1500x500.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
    return;
  }
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = BANNER_W;
    canvas.height = BANNER_H;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `camobit-${id}-banner-1500x500.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  };
  img.onerror = () => {
    setMintMsg("PNG export failed — try SVG download", false);
  };
  img.src = svgToDataUrl(svg);
}

/* ---------- Mint ---------- */
let provider, signer, contract;

async function loadEthers() {
  return import("https://cdn.jsdelivr.net/npm/ethers@6.13.4/+esm");
}

async function ensureChain(BrowserProvider) {
  provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const net = await provider.getNetwork();
  if (net.chainId !== CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_HEX }],
      });
    } catch (e) {
      if (e.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: CHAIN_HEX,
            chainName: "Robinhood Chain",
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: [RPC],
            blockExplorerUrls: [EXPLORER],
          }],
        });
      } else {
        throw e;
      }
    }
  }
  signer = await provider.getSigner();
  const { Contract } = await loadEthers();
  contract = new Contract(CONTRACT, ABI, signer);
}

async function refreshMintStats() {
  try {
    const { JsonRpcProvider, Contract } = await loadEthers();
    const p = new JsonRpcProvider(RPC);
    const c = new Contract(CONTRACT, ABI, p);
    const [minted, price] = await Promise.all([c.totalMinted(), c.mintPriceWei()]);
    const elM = document.getElementById("statMinted");
    const elP = document.getElementById("statPrice");
    if (elM) elM.textContent = `${minted.toString()} / ${MAX}`;
    if (elP) {
      const eth = Number(price) / 1e18;
      elP.textContent = `${eth.toFixed(6)} ETH ≈ $0.70`;
    }
  } catch (e) {
    console.warn("mint stats", e);
    const elM = document.getElementById("statMinted");
    const elP = document.getElementById("statPrice");
    if (elM && elM.textContent === "—") elM.textContent = "0 / 4444";
    if (elP && elP.textContent === "—") elP.textContent = "0.000220 ETH ≈ $0.70";
  }
}

function setMintMsg(t, ok) {
  const el = document.getElementById("mintMsg");
  if (!el) return;
  el.className = "mint-msg " + (ok === true ? "ok" : ok === false ? "err" : "");
  el.textContent = t || "";
}

/* ---------- Hero rotate ---------- */
function initHeroRotate() {
  const hero = document.getElementById("heroBanner");
  const cap = document.getElementById("heroCap");
  if (!hero) return;
  const ids = [0, 7, 42, 100, 333, 420, 777, 1111, 2222, 4443];
  let i = 0;
  const tick = () => {
    const id = ids[i % ids.length];
    hero.src = svgToDataUrl(bannerSvg(id));
    if (cap) cap.textContent = `${nameOf(id)} · #${id} · X header 1500×500`;
    i++;
  };
  tick();
  setInterval(tick, 4500);
}

/* ---------- Nav ---------- */
function initNav() {
  const nav = document.querySelector(".nav");
  const btn = document.getElementById("navToggle");
  btn?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.querySelectorAll(".nav-links a").forEach((a) =>
    a.addEventListener("click", () => {
      nav?.classList.remove("open");
      btn?.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---------- Boot ---------- */
function boot() {
  initChameleonBg();
  initNav();
  initHeroRotate();
  buildFeatured(pickFeatured(12));
  renderBannerLab();
  refreshMintStats();
  setInterval(refreshMintStats, 20000);

  document.getElementById("bannerId")?.addEventListener("input", renderBannerLab);
  document.getElementById("bannerId")?.addEventListener("change", renderBannerLab);
  document.getElementById("btnBannerSvg")?.addEventListener("click", () => downloadBanner("svg"));
  document.getElementById("btnBannerPng")?.addEventListener("click", () => downloadBanner("png"));
  document.getElementById("btnRandom")?.addEventListener("click", () => {
    const input = document.getElementById("bannerId");
    if (input) {
      input.value = Math.floor(Math.random() * MAX);
      renderBannerLab();
    }
  });
  document.getElementById("btnPrev")?.addEventListener("click", () => {
    const input = document.getElementById("bannerId");
    if (!input) return;
    input.value = clampId(Number(input.value) - 1);
    renderBannerLab();
  });
  document.getElementById("btnNext")?.addEventListener("click", () => {
    const input = document.getElementById("bannerId");
    if (!input) return;
    input.value = clampId(Number(input.value) + 1);
    renderBannerLab();
  });
  document.getElementById("btnMoreBanners")?.addEventListener("click", () => {
    buildFeatured(pickFeatured(12));
  });

  document.getElementById("btnConnect")?.addEventListener("click", async () => {
    try {
      if (!window.ethereum) throw new Error("Install MetaMask (or a web3 wallet)");
      const { BrowserProvider } = await loadEthers();
      await ensureChain(BrowserProvider);
      const addr = await signer.getAddress();
      document.getElementById("walletLabel").textContent =
        addr.slice(0, 6) + "…" + addr.slice(-4);
      document.getElementById("btnMint").disabled = false;
      setMintMsg("Connected on Robinhood Chain", true);
      await refreshMintStats();
    } catch (e) {
      setMintMsg(e.shortMessage || e.message || String(e), false);
    }
  });

  document.getElementById("btnMint")?.addEventListener("click", async () => {
    try {
      if (!contract) throw new Error("Connect wallet first");
      const qty = Math.max(1, Math.min(20, parseInt(document.getElementById("qty").value, 10) || 1));
      setMintMsg("Confirm in wallet…");
      const unit = await contract.mintPriceWei();
      const tx = await contract.mint(qty, { value: unit * BigInt(qty) });
      setMintMsg("Tx " + tx.hash.slice(0, 14) + "… waiting…", true);
      await tx.wait();
      setMintMsg(`Minted ${qty} CamoBit(s). View on explorer / OpenSea.`, true);
      await refreshMintStats();
    } catch (e) {
      setMintMsg(e.shortMessage || e.message || String(e), false);
    }
  });

  document.querySelectorAll("[data-contract]").forEach((a) => {
    a.href = `${EXPLORER}/address/${CONTRACT}`;
    a.textContent = CONTRACT.slice(0, 10) + "…" + CONTRACT.slice(-6);
  });
}

document.addEventListener("DOMContentLoaded", boot);
