/* CamoBits — minimal site, owner-only banners, chameleon bg */
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
  "function balanceOf(address) view returns (uint256)",
  "function ownerOf(uint256) view returns (address)",
];

let provider, signer, contract;
let ownedIds = [];
let walletAddr = "";

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
  const colors = ["#00C805", "#32c864", "#ff64a0", "#32d2e6", "#f0be28", "#b478ff", "#CDFF00", "#965ad2"];
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
  return specials[id] || `#${id}`;
}

function irisColor(id) {
  let iris = "#ffffff";
  if (rng(id, 4) % 10 > 7) iris = "#1a1a1a";
  if (rng(id, 4) % 17 === 0) iris = "#ff4444";
  return iris;
}

/**
 * Wide CamoBit for 1500×500 — tail curls UP like a real chameleon (tight spiral),
 * not stretched out the left edge. Body fills the banner length cleanly.
 */
function bannerCreatureWide(id) {
  const body = bodyColor(id);
  const belly = accentColor(id);
  const iris = irisColor(id);
  const outline = "#0a120c";
  return `
  <!-- habitat ground full local width -->
  <rect x="0" y="360" width="1400" height="60" fill="#2d6b2a"/>
  <rect x="0" y="360" width="1400" height="8" fill="#3d8c3a"/>
  <ellipse cx="220" cy="364" rx="70" ry="10" fill="#4a9e45" opacity="0.65"/>
  <ellipse cx="700" cy="366" rx="100" ry="9" fill="#4a9e45" opacity="0.5"/>
  <ellipse cx="1150" cy="365" rx="80" ry="10" fill="#4a9e45" opacity="0.55"/>

  <!-- tail: tight chameleon curl UP under/behind body (stays inside frame) -->
  <path d="
    M 520 300
    C 470 320, 430 335, 400 320
    C 365 300, 375 255, 410 240
    C 445 225, 480 250, 470 280
    C 462 300, 435 305, 420 290
    C 408 278, 418 262, 435 268
  " fill="none" stroke="${outline}" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="
    M 520 300
    C 470 320, 430 335, 400 320
    C 365 300, 375 255, 410 240
    C 445 225, 480 250, 470 280
    C 462 300, 435 305, 420 290
    C 408 278, 418 262, 435 268
  " fill="none" stroke="${body}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- elongated body -->
  <ellipse cx="720" cy="275" rx="175" ry="80" fill="${outline}"/>
  <ellipse cx="720" cy="275" rx="165" ry="72" fill="${body}"/>
  <ellipse cx="740" cy="292" rx="120" ry="38" fill="${belly}" opacity="0.42"/>

  <!-- neck -->
  <ellipse cx="890" cy="250" rx="92" ry="66" fill="${outline}"/>
  <ellipse cx="890" cy="250" rx="84" ry="58" fill="${body}"/>

  <!-- head -->
  <ellipse cx="1020" cy="220" rx="80" ry="74" fill="${outline}"/>
  <ellipse cx="1020" cy="220" rx="72" ry="66" fill="${body}"/>

  <path d="M 580 232 Q 720 188 890 196 Q 960 184 1030 194" fill="none"
        stroke="${outline}" stroke-width="8" stroke-linecap="round" opacity="0.3"/>

  <!-- eye -->
  <circle cx="1060" cy="210" r="38" fill="${iris}" stroke="${outline}" stroke-width="7"/>
  <circle cx="1072" cy="210" r="17" fill="#111"/>
  <circle cx="1082" cy="200" r="6.5" fill="#fff"/>

  <path d="M 1075 248 Q 1095 260 1070 268" fill="none" stroke="${outline}" stroke-width="4" stroke-linecap="round" opacity="0.45"/>

  <!-- legs -->
  <rect x="600" y="335" width="16" height="42" rx="5" fill="${outline}"/>
  <rect x="602" y="337" width="12" height="38" rx="4" fill="${body}"/>
  <rect x="670" y="338" width="16" height="40" rx="5" fill="${outline}"/>
  <rect x="672" y="340" width="12" height="36" rx="4" fill="${body}"/>
  <rect x="800" y="336" width="16" height="42" rx="5" fill="${outline}"/>
  <rect x="802" y="338" width="12" height="38" rx="4" fill="${body}"/>
  <rect x="870" y="338" width="16" height="40" rx="5" fill="${outline}"/>
  <rect x="872" y="340" width="12" height="36" rx="4" fill="${body}"/>
  <ellipse cx="608" cy="380" rx="14" ry="6" fill="${outline}"/>
  <ellipse cx="678" cy="381" rx="14" ry="6" fill="${outline}"/>
  <ellipse cx="808" cy="380" rx="14" ry="6" fill="${outline}"/>
  <ellipse cx="878" cy="381" rx="14" ry="6" fill="${outline}"/>
`;
}

/**
 * Robinhood chain mark: bold dark bird-feather on Hood green (#CDFF00).
 */
function robinhoodLogo(x, y, size = 56) {
  const s = size / 48;
  return `
  <g transform="translate(${x},${y}) scale(${s})">
    <rect x="0" y="0" width="48" height="48" rx="10" fill="#CDFF00"/>
    <!-- single bold dark feather (birdlike, not a leaf) -->
    <path fill="#0a0c08" d="
      M24.5 6
      C19 14 16.5 20 16 27
      c-0.3 4 0.8 7.5 3 10
      c1.5-2.2 3.2-4.8 4.8-8.2
      c0.4 0.1 0.8 0.1 1.2 0
      c1.6 3.4 3.3 6 4.8 8.2
      c2.2-2.5 3.3-6 3-10
      C32.3 20 29.8 14 24.5 6Z"/>
    <!-- quill shaft -->
    <path d="M24.5 12 L24.5 38" stroke="#0a0c08" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <!-- barb ticks (feather, not leaf veins) -->
    <path d="M24.5 16 L19 20 M24.5 20 L18.5 25 M24.5 24 L19 30
             M24.5 16 L30 20 M24.5 20 L30.5 25 M24.5 24 L30 30"
          stroke="#0a0c08" stroke-width="1.6" stroke-linecap="round" fill="none"/>
  </g>`;
}

/**
 * X header 1500×500 — wide CamoBit + RH feather on hood green.
 */
function bannerSvg(id) {
  const bg = bgColor(id);
  const body = bodyColor(id);
  const a1 = accentColor(id);
  const a2 = accentColor(id + 17);
  const a3 = bodyColor(id + 3);
  const uid = `b${id}`;
  const padX = 50;
  const padY = 40;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${BANNER_W}" height="${BANNER_H}" viewBox="0 0 ${BANNER_W} ${BANNER_H}">
  <defs>
    <linearGradient id="${uid}g" x1="0%" y1="0%" x2="100%" y2="40%">
      <stop offset="0%" stop-color="${bg}">
        <animate attributeName="stop-color" values="${bg};${a1};${a2};${body};${bg}" dur="12s" repeatCount="indefinite"/>
      </stop>
      <stop offset="40%" stop-color="${a1}">
        <animate attributeName="stop-color" values="${a1};${a2};${bg};${a3};${a1}" dur="14s" repeatCount="indefinite"/>
      </stop>
      <stop offset="75%" stop-color="${a2}">
        <animate attributeName="stop-color" values="${a2};${body};${a1};${bg};${a2}" dur="16s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="${a3}">
        <animate attributeName="stop-color" values="${a3};${bg};${a1};${a2};${a3}" dur="13s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
    <linearGradient id="${uid}v" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.07"/>
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.18"/>
    </linearGradient>
    <filter id="${uid}f"><feGaussianBlur stdDeviation="36"/></filter>
    <clipPath id="${uid}clip"><rect width="1500" height="500"/></clipPath>
  </defs>

  <g clip-path="url(#${uid}clip)">
    <rect width="1500" height="500" fill="url(#${uid}g)"/>
    <circle cx="250" cy="90" r="190" fill="${a1}" opacity="0.16" filter="url(#${uid}f)"/>
    <circle cx="980" cy="50" r="150" fill="${body}" opacity="0.12" filter="url(#${uid}f)"/>
    <circle cx="1320" cy="200" r="200" fill="#CDFF00" opacity="0.1" filter="url(#${uid}f)"/>
    <rect width="1500" height="500" fill="url(#${uid}v)"/>
    <g transform="translate(${padX},${padY})">
      ${bannerCreatureWide(id)}
    </g>
  </g>

  ${robinhoodLogo(1416, 420, 60)}
  <text x="1400" y="478" text-anchor="end" fill="#0a0c08" fill-opacity="0.4"
        font-family="ui-monospace,monospace" font-size="14" font-weight="700">#${id}</text>
</svg>`;
}

function svgToDataUrl(svg) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ---------- Chameleon canvas (extra fluid layer) ---------- */
function initChameleonBg() {
  const c = document.getElementById("bg-canvas");
  if (!c) return;
  const ctx = c.getContext("2d", { alpha: true });
  let w = 0, h = 0;
  const t0 = performance.now();
  const colors = [
    [205, 255, 0], [0, 200, 5], [50, 200, 100], [40, 170, 160],
    [70, 140, 220], [180, 90, 210], [255, 100, 160], [240, 190, 40],
    [205, 255, 0],
  ];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  function sample(t, off) {
    const x = t + off;
    const i = ((Math.floor(x) % colors.length) + colors.length) % colors.length;
    const j = (i + 1) % colors.length;
    const f = x - Math.floor(x);
    const s = f * f * (3 - 2 * f);
    return mix(colors[i], colors[j], s);
  }

  function frame(now) {
    const t = reduce ? 0.4 : (now - t0) / 11000;
    const ang = reduce ? 0.5 : (now - t0) / 20000;
    ctx.clearRect(0, 0, w, h);

    // multiple drifting orbs
    for (let k = 0; k < 5; k++) {
      const col = sample(t, k * 1.3);
      const cx = w * (0.5 + 0.35 * Math.sin(ang * (0.7 + k * 0.2) + k));
      const cy = h * (0.5 + 0.3 * Math.cos(ang * (0.9 + k * 0.15) + k * 1.2));
      const r = Math.max(w, h) * (0.25 + 0.08 * k);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(${col.join(",")},0.55)`);
      g.addColorStop(0.55, `rgba(${col.join(",")},0.12)`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    if (!reduce) requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(frame);
}

/* ---------- Public preview strip (look only) ---------- */
function buildFeatured() {
  const el = document.getElementById("bannerStrip");
  if (!el) return;
  // keep strip light — a few previews only
  const ids = [0, 333, 777];
  el.innerHTML = "";
  ids.forEach((id) => {
    const card = document.createElement("div");
    card.className = "banner-card";
    card.innerHTML = `<img src="${svgToDataUrl(bannerSvg(id))}" alt="" width="450" height="150" loading="lazy" />`;
    el.appendChild(card);
  });
}

function initHeroRotate() {
  const hero = document.getElementById("heroBanner");
  if (!hero) return;
  const ids = [0, 1, 333, 777];
  let i = 0;
  const tick = () => {
    hero.src = svgToDataUrl(bannerSvg(ids[i % ids.length]));
    i++;
  };
  tick();
  setInterval(tick, 5000);
}

/* ---------- Owner lab ---------- */
async function loadEthers() {
  return import("https://cdn.jsdelivr.net/npm/ethers@6.13.4/+esm");
}

/** Prefer EVM wallets (MetaMask / Rabby / Coinbase / OKX / Brave). Never Phantom. */
function getEvmProvider() {
  const eth = window.ethereum;
  if (!eth) return null;

  const isPhantom = (p) =>
    !!(p && (p.isPhantom || p._isPhantom || p.provider?.isPhantom));

  if (Array.isArray(eth.providers) && eth.providers.length) {
    const list = eth.providers.filter((p) => !isPhantom(p));
    const pick =
      list.find((p) => p.isMetaMask && !p.isBraveWallet) ||
      list.find((p) => p.isRabby) ||
      list.find((p) => p.isCoinbaseWallet) ||
      list.find((p) => p.isOkxWallet || p.isOKExWallet) ||
      list.find((p) => p.isBraveWallet) ||
      list.find((p) => p.isFrame) ||
      list[0];
    return pick || null;
  }

  if (isPhantom(eth)) {
    // Phantom alone — reject so user installs an EVM wallet for RH
    return null;
  }
  return eth;
}

async function ensureChain(BrowserProvider) {
  const raw = getEvmProvider();
  if (!raw) {
    throw new Error(
      "Need an EVM wallet for Robinhood Chain (MetaMask, Rabby, Coinbase…). Phantom is not supported."
    );
  }
  provider = new BrowserProvider(raw);
  await provider.send("eth_requestAccounts", []);
  const net = await provider.getNetwork();
  if (net.chainId !== CHAIN_ID) {
    try {
      await raw.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_HEX }],
      });
    } catch (e) {
      if (e.code === 4902) {
        await raw.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: CHAIN_HEX,
            chainName: "Robinhood Chain",
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: [RPC],
            blockExplorerUrls: [EXPLORER],
          }],
        });
      } else throw e;
    }
  }
  signer = await provider.getSigner();
  const { Contract } = await loadEthers();
  contract = new Contract(CONTRACT, ABI, signer);
}

/** Scan minted range for tokens owned by addr (fine while supply is modest). */
async function fetchOwnedIds(addr) {
  const { JsonRpcProvider, Contract } = await loadEthers();
  const p = new JsonRpcProvider(RPC);
  const c = new Contract(CONTRACT, ABI, p);
  const bal = await c.balanceOf(addr);
  if (bal === 0n) return [];
  const total = Number(await c.totalMinted());
  if (total === 0) return [];
  const me = addr.toLowerCase();
  const owned = [];
  const chunk = 40;
  for (let i = 0; i < total; i += chunk) {
    const jobs = [];
    for (let j = i; j < Math.min(i + chunk, total); j++) {
      const id = j;
      jobs.push(
        c.ownerOf(id)
          .then((o) => (o.toLowerCase() === me ? id : null))
          .catch(() => null)
      );
    }
    const part = await Promise.all(jobs);
    for (const x of part) if (x !== null) owned.push(x);
    if (owned.length >= Number(bal)) break;
  }
  return owned.sort((a, b) => a - b);
}

function showLabOpen() {
  document.getElementById("labLocked")?.classList.add("hidden");
  document.getElementById("labOpen")?.classList.remove("hidden");
}

function fillOwnedSelect() {
  const sel = document.getElementById("ownedSelect");
  const frame = document.getElementById("previewFrame");
  if (!sel) return;
  sel.innerHTML = "";
  if (!ownedIds.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "None owned";
    sel.appendChild(opt);
    frame?.classList.add("empty");
    const prev = document.getElementById("bannerPreview");
    if (prev) {
      prev.removeAttribute("src");
      delete prev.dataset.svg;
    }
    const label = document.getElementById("bannerLabel");
    if (label) label.textContent = "";
    return;
  }
  ownedIds.forEach((id) => {
    const opt = document.createElement("option");
    opt.value = String(id);
    opt.textContent = `${nameOf(id)} · #${id}`;
    sel.appendChild(opt);
  });
  sel.value = String(ownedIds[0]);
  renderOwnedBanner();
}

function renderOwnedBanner() {
  const sel = document.getElementById("ownedSelect");
  const preview = document.getElementById("bannerPreview");
  const label = document.getElementById("bannerLabel");
  const frame = document.getElementById("previewFrame");
  if (!sel || !preview) return;
  const id = parseInt(sel.value, 10);
  if (Number.isNaN(id) || !ownedIds.includes(id)) {
    frame?.classList.add("empty");
    return;
  }
  const svg = bannerSvg(id);
  preview.src = svgToDataUrl(svg);
  preview.dataset.svg = svg;
  frame?.classList.remove("empty");
  if (label) label.textContent = `${nameOf(id)} · #${id}`;
}

function downloadBanner(format) {
  if (!ownedIds.length) {
    setMintMsg("Mint first — only your CamoBits", false);
    return;
  }
  const preview = document.getElementById("bannerPreview");
  const sel = document.getElementById("ownedSelect");
  const id = parseInt(sel?.value || "", 10);
  if (!ownedIds.includes(id)) {
    setMintMsg("Pick one of your CamoBits", false);
    return;
  }
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
    canvas.getContext("2d").drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `camobit-${id}-banner-1500x500.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  };
  img.src = svgToDataUrl(svg);
}

async function connectWallet() {
  if (!getEvmProvider() && !window.ethereum) {
    throw new Error("Install MetaMask or another EVM wallet (Robinhood Chain)");
  }
  if (!getEvmProvider()) {
    throw new Error("Use MetaMask / Rabby / Coinbase — not Phantom (needs EVM + Robinhood)");
  }
  const { BrowserProvider } = await loadEthers();
  await ensureChain(BrowserProvider);
  walletAddr = await signer.getAddress();
  const short = walletAddr.slice(0, 6) + "…" + walletAddr.slice(-4);
  const wl = document.getElementById("walletLabel");
  if (wl) wl.textContent = short;
  document.getElementById("btnMint").disabled = false;
  setMintMsg("Connected", true);
  showLabOpen();
  ownedIds = await fetchOwnedIds(walletAddr);
  fillOwnedSelect();
  await refreshMintStats();
}

async function refreshMintStats() {
  try {
    const { JsonRpcProvider, Contract } = await loadEthers();
    const p = new JsonRpcProvider(RPC);
    const c = new Contract(CONTRACT, ABI, p);
    const [minted, price] = await Promise.all([c.totalMinted(), c.mintPriceWei()]);
    const elM = document.getElementById("statMinted");
    const elP = document.getElementById("statPrice");
    if (elM) elM.textContent = `${minted} / ${MAX}`;
    if (elP) elP.textContent = `${(Number(price) / 1e18).toFixed(6)} ETH`;
  } catch {
    const elM = document.getElementById("statMinted");
    const elP = document.getElementById("statPrice");
    if (elM && elM.textContent === "—") elM.textContent = "0 / 4444";
    if (elP && elP.textContent === "—") elP.textContent = "0.000220 ETH";
  }
}

function setMintMsg(t, ok) {
  const el = document.getElementById("mintMsg");
  if (!el) return;
  el.className = "mint-msg " + (ok === true ? "ok" : ok === false ? "err" : "");
  el.textContent = t || "";
}

function boot() {
  initChameleonBg();
  initHeroRotate();
  buildFeatured();
  refreshMintStats();
  setInterval(refreshMintStats, 25000);

  document.getElementById("ownedSelect")?.addEventListener("change", renderOwnedBanner);
  document.getElementById("btnBannerPng")?.addEventListener("click", () => downloadBanner("png"));
  document.getElementById("btnBannerSvg")?.addEventListener("click", () => downloadBanner("svg"));

  const onConnect = async () => {
    try {
      await connectWallet();
    } catch (e) {
      setMintMsg(e.shortMessage || e.message || String(e), false);
    }
  };
  document.getElementById("btnConnect")?.addEventListener("click", onConnect);
  document.getElementById("btnConnectLab")?.addEventListener("click", onConnect);

  document.getElementById("btnMint")?.addEventListener("click", async () => {
    try {
      if (!contract) throw new Error("Connect first");
      const qty = Math.max(1, Math.min(20, parseInt(document.getElementById("qty").value, 10) || 1));
      setMintMsg("Confirm…");
      const unit = await contract.mintPriceWei();
      const tx = await contract.mint(qty, { value: unit * BigInt(qty) });
      setMintMsg("Minting…", true);
      await tx.wait();
      setMintMsg(`Minted ${qty}`, true);
      ownedIds = await fetchOwnedIds(walletAddr);
      fillOwnedSelect();
      showLabOpen();
      await refreshMintStats();
    } catch (e) {
      setMintMsg(e.shortMessage || e.message || String(e), false);
    }
  });

  // OpenSea collection / token deep-link
  const os = `https://opensea.io/assets/robinhood/${CONTRACT}/0`;
  ["openseaNav", "openseaHero", "openseaFoot"].forEach((id) => {
    const a = document.getElementById(id);
    if (a) a.href = os;
  });
}

document.addEventListener("DOMContentLoaded", boot);
