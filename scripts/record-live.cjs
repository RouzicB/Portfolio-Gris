/* eslint-disable @typescript-eslint/no-require-imports -- script Node en CommonJS, hors du site */
// Enregistre une vidéo de démonstration d'une application qui tourne en local (vraie interface, données fictives).
// Le navigateur est piloté par un scénario (scripts/live/<nom>.cjs) ; l'écran est capturé en continu
// (CDP screencast), puis encodé en MP4 à 30 i/s, avec une affiche WebP.
//
//   REC_TOOLS=<dossier avec playwright-core et ffmpeg-static> node scripts/record-live.cjs <scénario> [--poster ms]
//
// Le scénario exporte { url, cookies?, project, name, poster, run(page, h) }.
const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");
const { createRequire } = require("node:module");

const req = createRequire(path.join(path.resolve(process.env.REC_TOOLS ?? "."), "node_modules", "_"));
const { chromium } = req("playwright-core");
const ffmpeg = req("ffmpeg-static");

const W = 1600;
const H = 900;
const FPS = 30;

// Curseur, ondes de clic et légende, dessinés par-dessus l'application
const OVERLAY = `
(() => {
  const css = \`
    nextjs-portal, [data-nextjs-toast], #__next-build-watcher { display: none !important; }
    #rec-cursor { position: fixed; left: 0; top: 0; z-index: 2147483647; width: 24px; height: 28px; pointer-events: none;
      transform-origin: 3px 2px; filter: drop-shadow(0 2px 3px rgba(0,0,0,.4)); transition: scale .12s; }
    .rec-ripple { position: fixed; z-index: 2147483646; pointer-events: none; width: 16px; height: 16px; margin: -8px 0 0 -8px;
      border-radius: 50%; border: 2px solid var(--rec-accent, #3b82f6); animation: rec-r .6s ease-out forwards; }
    @keyframes rec-r { to { transform: scale(3.6); opacity: 0; } }
    #rec-caption { position: fixed; left: 50%; bottom: 26px; z-index: 2147483645; display: flex; align-items: center; gap: 12px;
      padding: 10px 20px 10px 10px; border-radius: 999px; font: 500 17px/1.2 "Segoe UI", system-ui, sans-serif; color: #fff;
      background: rgba(12,14,20,.8); backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0,0,0,.3); white-space: nowrap;
      transform: translate(-50%, 12px); opacity: 0; transition: opacity .45s, transform .45s; pointer-events: none; }
    #rec-caption.on { opacity: 1; transform: translate(-50%, 0); }
    #rec-caption b { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; font-size: 14px;
      background: var(--rec-accent, #3b82f6); }\`;
  const add = () => {
    if (document.getElementById("rec-cursor")) return;
    const st = document.createElement("style"); st.textContent = css; document.documentElement.appendChild(st);
    const c = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    c.id = "rec-cursor"; c.setAttribute("viewBox", "0 0 22 26");
    c.innerHTML = '<path d="M3 2 L3 21 L8 16.5 L11.5 24 L14.5 22.6 L11 15.2 L18 15.2Z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/>';
    c.style.translate = "-100px -100px";
    document.documentElement.appendChild(c);
    const cap = document.createElement("div"); cap.id = "rec-caption"; document.documentElement.appendChild(cap);
    addEventListener("mousemove", (e) => { c.style.translate = (e.clientX - 3) + "px " + (e.clientY - 2) + "px"; }, true);
    addEventListener("mousedown", (e) => {
      c.style.scale = ".85";
      const r = document.createElement("span"); r.className = "rec-ripple";
      r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px";
      document.documentElement.appendChild(r); setTimeout(() => r.remove(), 700);
    }, true);
    addEventListener("mouseup", () => { c.style.scale = "1"; }, true);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();`;

async function main() {
  const name = process.argv[2];
  const scenario = require(path.resolve(__dirname, "live", `${name}.cjs`));
  const browser = await chromium.launch({ channel: process.env.BROWSER === "chrome" ? "chrome" : "msedge" });
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  if (scenario.cookies) await ctx.addCookies(scenario.cookies());
  await ctx.addInitScript(OVERLAY);
  const page = await ctx.newPage();
  if (scenario.accent) await ctx.addInitScript(`document.documentElement.style.setProperty("--rec-accent", "${scenario.accent}")`);

  // Préparation hors caméra (chargement de la carte, etc.)
  await page.goto(scenario.url, { waitUntil: "domcontentloaded", timeout: 180000 });
  if (scenario.prepare) await scenario.prepare(page);

  // Capture
  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", async (f) => {
    frames.push({ t: f.metadata.timestamp * 1000, data: Buffer.from(f.data, "base64") });
    try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch { /* fin */ }
  });
  let pos = { x: W / 2, y: H / 2 };
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const h = {
    wait: (ms) => page.waitForTimeout(ms),
    async move(x, y, ms = 700) {
      const n = Math.max(2, Math.round(ms / 16));
      const from = { ...pos };
      for (let i = 1; i <= n; i++) {
        const p = ease(i / n);
        await page.mouse.move(from.x + (x - from.x) * p, from.y + (y - from.y) * p);
        await page.waitForTimeout(ms / n);
      }
      pos = { x, y };
    },
    async box(target) {
      const loc = typeof target === "string" ? page.locator(target).first() : target;
      const b = await loc.boundingBox({ timeout: 10000 });
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    },
    async to(target, ms = 700) {
      const c = Array.isArray(target) ? { x: target[0], y: target[1] } : await h.box(target);
      await h.move(c.x, c.y, ms);
    },
    async click(target, ms = 700) {
      await h.to(target, ms);
      await page.mouse.down();
      await page.waitForTimeout(90);
      await page.mouse.up();
    },
    async type(text, delay = 75) {
      await page.keyboard.type(text, { delay });
    },
    async drag(from, to, ms = 1400) {
      await h.to(from, 600);
      await page.mouse.down();
      await page.waitForTimeout(150);
      await h.to(to, ms);
      await page.waitForTimeout(150);
      await page.mouse.up();
    },
    async wheel(dy, steps = 6) {
      for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dy / steps); await page.waitForTimeout(60); }
    },
    caption: (n, text) =>
      page.evaluate(([n, text]) => {
        const c = document.getElementById("rec-caption");
        if (!c) return;
        if (!text) { c.classList.remove("on"); return; }
        c.classList.remove("on");
        setTimeout(() => { c.innerHTML = "<b>" + n + "</b>" + text; c.classList.add("on"); }, c.innerHTML ? 350 : 0);
      }, [n, text]),
  };
  await page.mouse.move(pos.x, pos.y);
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
  const t0 = Date.now();
  await page.waitForTimeout(300);
  await scenario.run(page, h);
  await h.caption(0, "");
  await page.waitForTimeout(700);
  const t1 = Date.now();
  await cdp.send("Page.stopScreencast");
  await browser.close();

  // Images à cadence fixe : à chaque instant, la dernière image reçue
  frames.sort((a, b) => a.t - b.t);
  const start = Math.max(t0, frames[0]?.t ?? t0);
  const out = path.join(__dirname, "..", "public", "projets", scenario.project);
  fs.mkdirSync(out, { recursive: true });
  const mp4 = path.join(out, `${scenario.name}.mp4`);
  const enc = spawn(ffmpeg, ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-vf", `scale=${W}:${H}`, "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4]);
  const done = new Promise((res, rej) => enc.on("close", (c) => (c === 0 ? res() : rej(new Error(`ffmpeg ${c}`)))));
  let k = 0;
  let poster = null;
  const total = Math.floor(((t1 - start) / 1000) * FPS);
  for (let i = 0; i < total; i++) {
    const t = start + (i * 1000) / FPS;
    while (k + 1 < frames.length && frames[k + 1].t <= t) k++;
    const buf = frames[k].data;
    if (!poster && t - start >= (scenario.poster ?? 5000)) poster = buf;
    if (!enc.stdin.write(buf)) await new Promise((r) => enc.stdin.once("drain", r));
  }
  enc.stdin.end();
  await done;
  const webp = path.join(out, `${scenario.name}.webp`);
  await new Promise((res, rej) => {
    const p = spawn(ffmpeg, ["-y", "-loglevel", "error", "-f", "mjpeg", "-i", "-", "-c:v", "libwebp", "-quality", "82", webp]);
    p.on("close", (c) => (c === 0 ? res() : rej(new Error(`ffmpeg ${c}`))));
    p.stdin.end(poster ?? frames.at(-1).data);
  });
  console.info(`${scenario.name} : ${((t1 - start) / 1000).toFixed(1)} s, ${frames.length} images capturées → ${path.relative(process.cwd(), mp4)}`);
}

main().catch((e) => {
  console.info(e);
  process.exit(1);
});
