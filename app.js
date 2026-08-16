/* CamoBits — Banner Lab = 1500×500 fit cube + mint (EVM / Robinhood) */
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

/* ---------- deterministic on-chain style art ---------- */
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

function irisColor(id) {
  let iris = "#ffffff";
  if (rng(id, 4) % 10 > 7) iris = "#1a1a1a";
  if (rng(id, 4) % 17 === 0) iris = "#ff4444";
  return iris;
}

/** Square on-chain style creature (matches collection look) */
function tokenArtInner(id) {
  const bg = bgColor(id);
  const body = bodyColor(id);
  const iris = irisColor(id);
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

/**
 * Banner Lab cube: same on-chain art, loaded into a fixed 1500×500 frame.
 * Cover-fit (fills the cube edge-to-edge) — specialized size box only.
 */
function bannerSvg(id) {
  const bg = bgColor(id);
  // Scale so 72px art covers 500px height (scale = 500/72 ≈ 6.944)
  // Center horizontally in 1500 wide frame
  const scale = BANNER_H / 72;
  const artW = 72 * scale;
  const ox = (BANNER_W - artW) / 2;
  const oy = 0;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${BANNER_W}" height="${BANNER_H}" viewBox="0 0 ${BANNER_W} ${BANNER_H}">
  <rect width="${BANNER_W}" height="${BANNER_H}" fill="${bg}"/>
  <g transform="translate(${ox},${oy}) scale(${scale})" shape-rendering="crispEdges">
    ${tokenArtInner(id)}
  </g>
</svg>`;
}

function svgToDataUrl(svg) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ---------- Features: 3 random banner-fit previews ---------- */
function buildFeatures() {
  const el = document.getElementById("featureStrip");
  if (!el) return;
  const pool = [];
  while (pool.length < 3) {
    const id = Math.floor(Math.random() * MAX);
    if (!pool.includes(id)) pool.push(id);
  }
  // prefer some named ones mixed in
  if (Math.random() > 0.4) pool[0] = [0, 1, 7, 42, 333, 777][Math.floor(Math.random() * 6)];
  el.innerHTML = "";
  pool.forEach((id) => {
    const card = document.createElement("div");
    card.className = "rounded-xl border border-line overflow-hidden bg-panel";
    card.innerHTML = `
      <div class="banner-cube">
        <img src="${svgToDataUrl(bannerSvg(id))}" alt="${nameOf(id)}" width="1500" height="500" loading="lazy" />
      </div>
      <p class="px-3 py-2 text-xs text-mute font-mono">#${id}</p>
    `;
    el.appendChild(card);
  });
}

/* ---------- Banner Lab ---------- */
function showLabOpen() {
  document.getElementById("labLocked")?.classList.add("hidden");
  document.getElementById("labOpen")?.classList.remove("hidden");
}

function fillOwnedSelect() {
  const sel = document.getElementById("ownedSelect");
  const frame = document.getElementById("previewFrame");
  const preview = document.getElementById("bannerPreview");
  const empty = document.getElementById("emptyMsg");
  const label = document.getElementById("bannerLabel");
  if (!sel) return;
  sel.innerHTML = "";
  if (!ownedIds.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "None";
    sel.appendChild(opt);
    preview?.classList.add("hidden");
    empty?.classList.remove("hidden");
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
  renderLabCube();
}

/** Load selected mint into the 1500×500 cube */
function renderLabCube() {
  const sel = document.getElementById("ownedSelect");
  const preview = document.getElementById("bannerPreview");
  const empty = document.getElementById("emptyMsg");
  const label = document.getElementById("bannerLabel");
  if (!sel || !preview) return;
  const id = parseInt(sel.value, 10);
  if (Number.isNaN(id) || !ownedIds.includes(id)) {
    preview.classList.add("hidden");
    empty?.classList.remove("hidden");
    return;
  }
  const svg = bannerSvg(id);
  preview.src = svgToDataUrl(svg);
  preview.dataset.svg = svg;
  preview.dataset.id = String(id);
  preview.classList.remove("hidden");
  empty?.classList.add("hidden");
  if (label) label.textContent = `${nameOf(id)} · ${BANNER_W}×${BANNER_H}`;
}

function downloadBannerPng() {
  if (!ownedIds.length) {
    setMintMsg("Mint first", false);
    return;
  }
  const preview = document.getElementById("bannerPreview");
  const id = parseInt(preview?.dataset.id || "", 10);
  if (!ownedIds.includes(id)) {
    setMintMsg("Pick one of yours", false);
    return;
  }
  const svg = preview.dataset.svg || bannerSvg(id);
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
      a.download = `camobit-${id}-header-1500x500.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  };
  img.src = svgToDataUrl(svg);
}

/* ---------- Wallet (EVM only, no Phantom) ---------- */
async function loadEthers() {
  return import("https://cdn.jsdelivr.net/npm/ethers@6.13.4/+esm");
}

function getEvmProvider() {
  const eth = window.ethereum;
  if (!eth) return null;
  const isPhantom = (p) => !!(p && (p.isPhantom || p._isPhantom));
  if (Array.isArray(eth.providers) && eth.providers.length) {
    const list = eth.providers.filter((p) => !isPhantom(p));
    return (
      list.find((p) => p.isMetaMask && !p.isBraveWallet) ||
      list.find((p) => p.isRabby) ||
      list.find((p) => p.isCoinbaseWallet) ||
      list.find((p) => p.isOkxWallet || p.isOKExWallet) ||
      list.find((p) => p.isBraveWallet) ||
      list[0] ||
      null
    );
  }
  if (isPhantom(eth)) return null;
  return eth;
}

async function ensureChain() {
  const raw = getEvmProvider();
  if (!raw) {
    throw new Error("Use MetaMask, Rabby, or Coinbase (EVM · Robinhood Chain)");
  }
  const { BrowserProvider, Contract } = await loadEthers();
  provider = new BrowserProvider(raw);
  await provider.send("eth_requestAccounts", []);
  const net = await provider.getNetwork();
  if (net.chainId !== CHAIN_ID) {
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
  const p = new JsonRpcProvider(RPC);
  const c = new Contract(CONTRACT, ABI, p);
  const bal = await c.balanceOf(addr);
  if (bal === 0n) return [];
  const total = Number(await c.totalMinted());
  const me = addr.toLowerCase();
  const owned = [];
  const chunk = 40;
  for (let i = 0; i < total; i += chunk) {
    const jobs = [];
    for (let j = i; j < Math.min(i + chunk, total); j++) {
      const id = j;
      jobs.push(c.ownerOf(id).then((o) => (o.toLowerCase() === me ? id : null)).catch(() => null));
    }
    for (const x of await Promise.all(jobs)) if (x !== null) owned.push(x);
    if (owned.length >= Number(bal)) break;
  }
  return owned.sort((a, b) => a - b);
}

async function connectWallet() {
  if (!getEvmProvider()) throw new Error("EVM wallet required (not Phantom)");
  await ensureChain();
  walletAddr = await signer.getAddress();
  const el = document.getElementById("walletLabel");
  if (el) el.textContent = walletAddr.slice(0, 6) + "…" + walletAddr.slice(-4);
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
  el.className = "mt-3 min-h-[1.25rem] text-sm " + (ok === true ? "text-hood" : ok === false ? "text-red-400" : "text-mute");
  el.textContent = t || "";
}

function boot() {
  buildFeatures();
  refreshMintStats();
  setInterval(refreshMintStats, 25000);

  document.getElementById("btnShuffle")?.addEventListener("click", buildFeatures);
  document.getElementById("ownedSelect")?.addEventListener("change", renderLabCube);
  document.getElementById("btnBannerPng")?.addEventListener("click", downloadBannerPng);

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
}

document.addEventListener("DOMContentLoaded", boot);
