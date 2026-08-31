/* CamoBits — one-page mint + banner lab (blinking 1/1s) */
const CONTRACT = "0x0535234ed1a6acA7b717B8128ad10256db20f677";
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
  "function paidMintPriceWei() view returns (uint256)",
  "function quoteMint(address minter, uint256 quantity) view returns (uint256)",
  "function totalMinted() view returns (uint256)",
  "function freeSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function ownerOf(uint256) view returns (address)",
  "function FREE_SUPPLY() view returns (uint256)",
  "function hasClaimedFreeMint(address) view returns (bool)",
];
const FREE_CAP_FALLBACK = 888;
const TREASURY = "0x76B2c9Dfd8DCe539A6e009c0B5283c44e2D45421";

let provider, signer, contract, ownedIds = [], walletAddr = "";

function shortAddr(a) {
  return a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";
}

function setWalletUI(connected) {
  const chip = document.getElementById("btnWalletNav");
  const chipLabel = document.getElementById("walletChipLabel");
  const statusBtn = document.getElementById("btnConnect");
  const statusText = document.getElementById("walletStatusText");
  const disconnect = document.getElementById("btnDisconnect");
  const mintBtn = document.getElementById("btnMint");
  const labBtn = document.getElementById("btnConnectLab");

  if (connected && walletAddr) {
    chip?.classList.add("on");
    statusBtn?.classList.add("on");
    if (chipLabel) chipLabel.textContent = shortAddr(walletAddr);
    if (statusText) statusText.textContent = `Connected · ${shortAddr(walletAddr)}`;
    disconnect?.classList.remove("hidden");
    if (mintBtn) mintBtn.disabled = false;
    if (labBtn) labBtn.textContent = shortAddr(walletAddr);
  } else {
    chip?.classList.remove("on");
    statusBtn?.classList.remove("on");
    if (chipLabel) chipLabel.textContent = "Connect";
    if (statusText) statusText.textContent = "Not connected · tap to connect";
    disconnect?.classList.add("hidden");
    if (mintBtn) {
      mintBtn.disabled = true;
      mintBtn.textContent = "Mint";
    }
    if (labBtn) labBtn.textContent = "Connect wallet";
  }
}

function disconnectWallet() {
  provider = signer = contract = null;
  walletAddr = "";
  ownedIds = [];
  setWalletUI(false);
  document.getElementById("labOpen")?.classList.add("hidden");
  document.getElementById("labLocked")?.classList.remove("hidden");
  setMintMsg("Disconnected", true);
  refreshMintStats();
}

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
  if (r < 55) return "#CDFF00";
  if (r < 75) return "#00C805";
  if (r < 88) return "#1e2037";
  if (r < 96) return "#78e6a0";
  return "#12081a";
}

function accentColor(id) {
  const colors = ["#00C805", "#32c864", "#ff64a0", "#32d2e6", "#f0be28", "#b478ff", "#CDFF00"];
  return colors[rng(id, 9) % colors.length];
}

function nameOf(id) {
  const specials = {
    0: "Genesis Bit", 1: "Prime Scale", 7: "Lucky Bit", 42: "Oracle Bit",
    333: "Inferno King", 777: "Jackpot Bit", 4443: "Final Form",
  };
  return specials[id] || `CamoBit #${id}`;
}

function irisColor(id) {
  const r = rng(id, 4) % 20;
  if (r === 0) return "#ff2222";
  if (r === 1) return "#ff4444";
  if (r < 5) return "#1a1a1a";
  if (r < 10) return "#f0d232";
  return "#ffffff";
}

function blinkDur(id) {
  return (3 + (rng(id, 88) % 5)) + "." + (rng(id, 87) % 9);
}

function blinkBegin(id) {
  return (rng(id, 89) % 20) / 10;
}

/** Exactly 1111/4444 Pixelated (full body); all share first-deploy classic coil tail */
function isPixelated(id) {
  return (rng(id, 16) % 4444) < 1046;
}

/** Square token art — matches on-chain: classic coil + Smooth/Pixelated body */
function tokenArtInner(id) {
  const bg = bgColor(id);
  const body = bodyColor(id);
  const iris = irisColor(id);
  const dx = rng(id, 11) % 5;
  const dy = rng(id, 12) % 3;
  const ox = dx >> 1;
  const pixel = isPixelated(id);
  const classic = "M24 50 C18 48 10 46 9 50 C8 56 14 60 18 58 C22 56 20 50 14 51 C10 52 11 57 16 57 C20 57 22 53 18 52";
  const tail = `<path d="${classic}" fill="none" stroke="${body}" stroke-width="2.6" stroke-linecap="round"/>`;
  const dur = blinkDur(id);
  const begin = blinkBegin(id);
  const lw = pixel ? 3 : 2;
  let critter;
  if (pixel) {
    const y0 = 38 - dy;
    critter = `
  <rect x="${26 + ox}" y="${40 - dy}" width="24" height="18" fill="${body}"/>
  <rect x="${44 + dx}" y="${34 - dy}" width="16" height="16" fill="${body}"/>
  <rect x="${50 + dx}" y="${y0}" width="10" height="8" fill="${iris}" stroke="#000" stroke-width="1">
    <animate attributeName="height" values="8;1;8" keyTimes="0;0.08;0.16" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
  </rect>
  <rect x="${53 + dx}" y="${40 - dy}" width="3" height="3" fill="#111"/>`;
  } else {
    critter = `
  <ellipse cx="${38 + ox}" cy="${48 - dy}" rx="13" ry="10" fill="${body}"/>
  <ellipse cx="${51 + dx}" cy="${42 - dy}" rx="9" ry="8.5" fill="${body}"/>
  <ellipse cx="${54 + dx}" cy="${41 - dy}" rx="5.2" ry="5.2" fill="${iris}" stroke="#000" stroke-width="1">
    <animate attributeName="ry" values="5.2;0.5;5.2" keyTimes="0;0.08;0.16" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
  </ellipse>
  <circle cx="${55 + dx}" cy="${41 - dy}" r="2.2" fill="#111"/>
  <circle cx="${56 + dx}" cy="${40 - dy}" r="0.8" fill="#fff"/>`;
  }
  return `
  <rect width="72" height="72" fill="${bg}"/>
  <rect y="58" width="72" height="14" fill="#3d8c3a"/>
  ${tail}
  ${critter}
  <rect x="${28 + ox}" y="56" width="${lw}" height="6" fill="${body}"/>
  <rect x="${34 + ox}" y="56" width="${lw}" height="6" fill="${body}"/>
  <rect x="${44 + dx}" y="56" width="${lw}" height="6" fill="${body}"/>
  <rect x="${50 + dx}" y="56" width="${lw}" height="6" fill="${body}"/>
  <rect x="${2 + (rng(id, 77) % 8)}" y="2" width="2" height="2" fill="#000" opacity="0.15"/>
`;
}

/**
 * Banner: wide chameleon, DOWNWARD curling tail, feet ON ground, blinking eye.
 */
function bannerSvg(id) {
  const bg = bgColor(id);
  const body = bodyColor(id);
  const belly = accentColor(id);
  const iris = irisColor(id);
  const outline = "#0a120c";
  const uid = `b${id}`;
  const dur = blinkDur(id);
  const begin = blinkBegin(id);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${BANNER_W}" height="${BANNER_H}" viewBox="0 0 ${BANNER_W} ${BANNER_H}">
  <defs>
    <linearGradient id="${uid}g" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="55%" stop-color="${belly}"/>
      <stop offset="100%" stop-color="${body}"/>
    </linearGradient>
  </defs>
  <rect width="1500" height="500" fill="url(#${uid}g)"/>
  <circle cx="220" cy="90" r="160" fill="${belly}" opacity="0.12"/>
  <circle cx="1280" cy="140" r="180" fill="#CCFF00" opacity="0.1"/>

  <!-- ground -->
  <rect x="0" y="400" width="1500" height="100" fill="#2d6b2a"/>
  <rect x="0" y="400" width="1500" height="10" fill="#3d8c3a"/>

  <!-- DOWNWARD curling tail (natural chameleon coil toward ground) -->
  <path d="M620 340 C560 370 500 400 460 395 C420 390 430 350 470 355 C505 360 510 395 475 400 C455 403 445 385 460 375"
        fill="none" stroke="${outline}" stroke-width="34" stroke-linecap="round"/>
  <path d="M620 340 C560 370 500 400 460 395 C420 390 430 350 470 355 C505 360 510 395 475 400 C455 403 445 385 460 375"
        fill="none" stroke="${body}" stroke-width="24" stroke-linecap="round"/>

  <!-- body seated -->
  <ellipse cx="780" cy="335" rx="155" ry="72" fill="${outline}"/>
  <ellipse cx="780" cy="335" rx="145" ry="64" fill="${body}"/>
  <ellipse cx="800" cy="355" rx="105" ry="34" fill="${belly}" opacity="0.4"/>

  <ellipse cx="940" cy="300" rx="88" ry="60" fill="${outline}"/>
  <ellipse cx="940" cy="300" rx="80" ry="52" fill="${body}"/>
  <ellipse cx="1060" cy="265" rx="74" ry="68" fill="${outline}"/>
  <ellipse cx="1060" cy="265" rx="66" ry="60" fill="${body}"/>

  <!-- blinking eye -->
  <ellipse cx="1105" cy="255" rx="34" ry="34" fill="${iris}" stroke="${outline}" stroke-width="6">
    <animate attributeName="ry" values="34;3;34" keyTimes="0;0.08;0.16" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
  </ellipse>
  <circle cx="1116" cy="255" r="14" fill="#111"/>
  <circle cx="1124" cy="247" r="5" fill="#fff"/>

  <!-- feet ON the ground line -->
  <rect x="700" y="385" width="14" height="24" rx="4" fill="${outline}"/>
  <rect x="702" y="387" width="10" height="20" rx="3" fill="${body}"/>
  <rect x="760" y="387" width="14" height="22" rx="4" fill="${outline}"/>
  <rect x="762" y="389" width="10" height="18" rx="3" fill="${body}"/>
  <rect x="840" y="385" width="14" height="24" rx="4" fill="${outline}"/>
  <rect x="842" y="387" width="10" height="20" rx="3" fill="${body}"/>
  <rect x="895" y="387" width="14" height="22" rx="4" fill="${outline}"/>
  <rect x="897" y="389" width="10" height="18" rx="3" fill="${body}"/>
  <ellipse cx="707" cy="408" rx="12" ry="5" fill="${outline}"/>
  <ellipse cx="767" cy="408" rx="12" ry="5" fill="${outline}"/>
  <ellipse cx="847" cy="408" rx="12" ry="5" fill="${outline}"/>
  <ellipse cx="902" cy="408" rx="12" ry="5" fill="${outline}"/>

  <text x="1475" y="478" text-anchor="end" fill="#0a0c08" fill-opacity="0.35"
        font-family="ui-monospace,monospace" font-size="14" font-weight="700">#${id}</text>
</svg>`;
}

function svgToDataUrl(svg) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function buildFeatures() {
  const el = document.getElementById("bannerStrip");
  if (!el) return;
  const ids = [];
  while (ids.length < 3) {
    const id = Math.floor(Math.random() * Math.min(MAX, 2000));
    if (!ids.includes(id)) ids.push(id);
  }
  el.innerHTML = "";
  ids.forEach((id) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "banner-card";
    card.innerHTML = `<img src="${svgToDataUrl(bannerSvg(id))}" alt="${nameOf(id)}" width="450" height="150" />`;
    el.appendChild(card);
  });
}

function initHero() {
  const hero = document.getElementById("heroBanner");
  if (!hero) return;
  const ids = [0, 7, 42, 333, 777, 1111];
  let i = 0;
  const tick = () => {
    hero.src = svgToDataUrl(bannerSvg(ids[i % ids.length]));
    i++;
  };
  tick();
  setInterval(tick, 4500);
}

function initChameleonBg() {
  const c = document.getElementById("bg-canvas");
  if (!c) return;
  const ctx = c.getContext("2d", { alpha: true });
  let w = 0, h = 0, t0 = performance.now();
  const colors = [
    [204, 255, 0], [0, 200, 5], [50, 200, 100], [40, 170, 160],
    [180, 90, 210], [255, 100, 160], [240, 190, 40],
  ];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = innerWidth; h = innerHeight;
    c.width = (w * dpr) | 0; c.height = (h * dpr) | 0;
    c.style.width = w + "px"; c.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function mix(a, b, t) {
    return a.map((v, i) => Math.round(v + (b[i] - v) * t));
  }
  function sample(t, off) {
    const x = t + off;
    const i = ((Math.floor(x) % colors.length) + colors.length) % colors.length;
    const f = x - Math.floor(x);
    const s = f * f * (3 - 2 * f);
    return mix(colors[i], colors[(i + 1) % colors.length], s);
  }
  function frame(now) {
    const t = reduce ? 0.3 : (now - t0) / 12000;
    ctx.clearRect(0, 0, w, h);
    for (let k = 0; k < 4; k++) {
      const col = sample(t, k * 1.4);
      const cx = w * (0.5 + 0.3 * Math.sin((now - t0) / 18000 * (0.8 + k * 0.2) + k));
      const cy = h * (0.45 + 0.25 * Math.cos((now - t0) / 20000 * (0.9 + k * 0.15) + k));
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.4);
      g.addColorStop(0, `rgba(${col.join(",")},0.45)`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  resize();
  addEventListener("resize", resize);
  requestAnimationFrame(frame);
}

async function loadEthers() {
  return import("https://cdn.jsdelivr.net/npm/ethers@6.13.4/+esm");
}

function getEvmProvider() {
  const eth = window.ethereum;
  if (!eth) return null;
  const isPhantom = (p) => !!(p && (p.isPhantom || p._isPhantom));
  if (Array.isArray(eth.providers) && eth.providers.length) {
    const list = eth.providers.filter((p) => !isPhantom(p));
    return list.find((p) => p.isMetaMask && !p.isBraveWallet) ||
      list.find((p) => p.isRabby) ||
      list.find((p) => p.isCoinbaseWallet) ||
      list[0] || null;
  }
  return isPhantom(eth) ? null : eth;
}

async function ensureChain() {
  const raw = getEvmProvider();
  if (!raw) throw new Error("EVM wallet required (MetaMask / Rabby / Coinbase)");
  const { BrowserProvider, Contract } = await loadEthers();
  provider = new BrowserProvider(raw);
  await provider.send("eth_requestAccounts", []);
  if ((await provider.getNetwork()).chainId !== CHAIN_ID) {
    try {
      await raw.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_HEX }] });
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
  contract = new Contract(CONTRACT, ABI, signer);
}

async function fetchOwnedIds(addr) {
  const { JsonRpcProvider, Contract } = await loadEthers();
  const c = new Contract(CONTRACT, ABI, new JsonRpcProvider(RPC));
  const bal = await c.balanceOf(addr);
  if (bal === 0n) return [];
  const total = Number(await c.totalMinted());
  const me = addr.toLowerCase();
  const owned = [];
  for (let i = 0; i < total; i += 40) {
    const jobs = [];
    for (let j = i; j < Math.min(i + 40, total); j++) {
      const id = j;
      jobs.push(c.ownerOf(id).then((o) => (o.toLowerCase() === me ? id : null)).catch(() => null));
    }
    for (const x of await Promise.all(jobs)) if (x !== null) owned.push(x);
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
  const preview = document.getElementById("bannerPreview");
  const empty = document.getElementById("emptyMsg");
  const frame = document.getElementById("previewFrame");
  const label = document.getElementById("bannerLabel");
  if (!sel) return;
  sel.innerHTML = "";
  if (!ownedIds.length) {
    sel.innerHTML = "<option value=''>None</option>";
    preview?.classList.add("hidden");
    empty?.classList.remove("hidden");
    frame?.classList.add("empty");
    if (label) label.textContent = "";
    return;
  }
  ownedIds.forEach((id) => {
    const o = document.createElement("option");
    o.value = id;
    o.textContent = `${nameOf(id)} · #${id}`;
    sel.appendChild(o);
  });
  sel.value = String(ownedIds[0]);
  renderLab();
}

function renderLab() {
  const sel = document.getElementById("ownedSelect");
  const preview = document.getElementById("bannerPreview");
  const empty = document.getElementById("emptyMsg");
  const frame = document.getElementById("previewFrame");
  const label = document.getElementById("bannerLabel");
  const id = parseInt(sel?.value || "", 10);
  if (!ownedIds.includes(id)) {
    preview?.classList.add("hidden");
    empty?.classList.remove("hidden");
    frame?.classList.add("empty");
    return;
  }
  const svg = bannerSvg(id);
  preview.src = svgToDataUrl(svg);
  preview.dataset.svg = svg;
  preview.dataset.id = String(id);
  preview.classList.remove("hidden");
  empty?.classList.add("hidden");
  frame?.classList.remove("empty");
  if (label) label.textContent = `${nameOf(id)} · 1500×500 · 1/1`;
}

function downloadPng() {
  const preview = document.getElementById("bannerPreview");
  const id = parseInt(preview?.dataset.id || "", 10);
  if (!ownedIds.includes(id)) return setMintMsg("Pick one of yours", false);
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = BANNER_W;
    c.height = BANNER_H;
    c.getContext("2d").drawImage(img, 0, 0);
    c.toBlob((b) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = `camobit-${id}-1500x500.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  };
  img.src = svgToDataUrl(preview.dataset.svg || bannerSvg(id));
}

async function connectWallet() {
  if (!getEvmProvider()) throw new Error("EVM wallet required");
  await ensureChain();
  walletAddr = await signer.getAddress();
  setWalletUI(true);
  setMintMsg("Connected", true);
  showLabOpen();
  ownedIds = await fetchOwnedIds(walletAddr);
  fillOwnedSelect();
  await refreshMintStats();
}

async function trySilentConnect() {
  try {
    const raw = getEvmProvider();
    if (!raw) return;
    const accounts = await raw.request({ method: "eth_accounts" });
    if (!accounts?.length) return;
    await connectWallet();
  } catch (_) { /* ignore */ }
}

async function walletFreeEligible(c, addr, freeCap, minted) {
  if (Number(minted) >= freeCap || !addr) return false;
  try {
    if (Number(await c.balanceOf(addr)) > 0) return false;
    if (await c.hasClaimedFreeMint(addr)) return false;
  } catch (_) {
    return Number(minted) < freeCap;
  }
  return true;
}

async function refreshMintStats() {
  try {
    const { JsonRpcProvider, Contract } = await loadEthers();
    const c = new Contract(CONTRACT, ABI, new JsonRpcProvider(RPC));
    let freeCap = FREE_CAP_FALLBACK;
    try { freeCap = Number(await c.freeSupply()); } catch (_) {}
    const [minted, nextPrice] = await Promise.all([c.totalMinted(), c.mintPriceWei()]);
    const freeOpen = Number(nextPrice) === 0 && Number(minted) < freeCap;
    const eligible = await walletFreeEligible(c, walletAddr, freeCap, minted);
    const elM = document.getElementById("statMinted");
    const elMH = document.getElementById("statMintedHero");
    const elPH = document.getElementById("statPriceHero");
    if (elM) elM.textContent = `${minted} / ${MAX}`;
    if (elMH) elMH.textContent = minted.toString();
    if (elPH) elPH.textContent = freeOpen ? "1 free" : "~¢30";
    const qtyEl = document.getElementById("qty");
    if (qtyEl) {
      if (eligible) {
        qtyEl.value = "1";
        qtyEl.max = "1";
        qtyEl.disabled = true;
      } else {
        qtyEl.max = "99";
        qtyEl.disabled = false;
      }
    }
    const note = document.getElementById("mintNote");
    if (note) {
      if (eligible) note.textContent = "1 free · then ~¢30 each";
      else if (freeOpen) note.textContent = "More · ~¢30 each";
      else note.textContent = "~¢30 each";
    }
    const mintBtn = document.getElementById("btnMint");
    if (mintBtn && !mintBtn.disabled) {
      mintBtn.textContent = eligible ? "Mint free" : "Mint";
    }
  } catch {
    /* ignore */
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
  initHero();
  buildFeatures();
  setWalletUI(false);
  refreshMintStats();
  setInterval(refreshMintStats, 20000);
  trySilentConnect();

  document.getElementById("btnShuffle")?.addEventListener("click", buildFeatures);
  document.getElementById("ownedSelect")?.addEventListener("change", renderLab);
  document.getElementById("btnBannerPng")?.addEventListener("click", downloadPng);

  const onConnect = async () => {
    if (walletAddr) return; // already connected — use Disconnect
    try { await connectWallet(); }
    catch (e) { setMintMsg(e.shortMessage || e.message || String(e), false); }
  };
  document.getElementById("btnConnect")?.addEventListener("click", onConnect);
  document.getElementById("btnConnectLab")?.addEventListener("click", onConnect);
  document.getElementById("btnWalletNav")?.addEventListener("click", async () => {
    if (walletAddr) disconnectWallet();
    else {
      try { await connectWallet(); }
      catch (e) { setMintMsg(e.shortMessage || e.message || String(e), false); }
    }
  });
  document.getElementById("btnDisconnect")?.addEventListener("click", () => disconnectWallet());

  const raw = getEvmProvider();
  raw?.on?.("accountsChanged", (accs) => {
    if (!accs?.length) disconnectWallet();
    else connectWallet().catch(() => disconnectWallet());
  });

  document.getElementById("btnMint")?.addEventListener("click", async () => {
    try {
      if (!contract || !walletAddr) throw new Error("Tap to connect first");
      let freeCap = FREE_CAP_FALLBACK;
      try { freeCap = Number(await contract.freeSupply()); } catch (_) {}
      const minted = Number(await contract.totalMinted());
      const eligible = await walletFreeEligible(contract, walletAddr, freeCap, minted);
      let qty = Math.max(1, Math.min(99, parseInt(document.getElementById("qty").value, 10) || 1));
      if (eligible) qty = 1;
      setMintMsg("Confirm in wallet…");
      let value = 0n;
      try {
        value = await contract.quoteMint(walletAddr, qty);
      } catch (_) {
        if (!eligible) {
          const paid = await contract.paidMintPriceWei();
          value = paid * BigInt(qty);
        }
      }
      const tx = await contract.mint(qty, { value });
      setMintMsg("Minting…", true);
      await tx.wait();
      setMintMsg((eligible ? "Free mint secured" : `Minted ${qty}`) + " · tap Disconnect anytime", true);
      ownedIds = await fetchOwnedIds(walletAddr);
      fillOwnedSelect();
      showLabOpen();
      await refreshMintStats();
    } catch (e) {
      const rawMsg = e.shortMessage || e.reason || e.message || String(e);
      let msg = rawMsg;
      if (/FreeMintOneOnly/i.test(rawMsg)) msg = "Free is 1 — set qty to 1, or pay for more";
      else if (/NoContracts/i.test(rawMsg)) msg = "Use a normal wallet";
      else if (/WrongPayment|insufficient/i.test(rawMsg)) msg = "Add a bit more ETH for mint + gas";
      setMintMsg(msg, false);
    }
  });

  const os = "https://opensea.io/collection/camobitsonhood";
  ["openseaNav", "openseaHero", "openseaFoot"].forEach((id) => {
    const a = document.getElementById(id);
    if (a) a.href = os;
  });
}

document.addEventListener("DOMContentLoaded", boot);
