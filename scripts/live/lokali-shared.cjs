/* eslint-disable @typescript-eslint/no-require-imports -- script Node en CommonJS, hors du site */
// Réglages communs aux démos Lokali : instance locale (front 3100, API 3110) remplie de données fictives,
// session d'un utilisateur de démo (jeton signé avec le secret de l'instance locale, voir LOKALI_TOKEN_FILE).
const fs = require("node:fs");

const URL = process.env.LOKALI_URL ?? "http://localhost:3100/?usine=cleon";

function cookies() {
  const token = fs.readFileSync(process.env.LOKALI_TOKEN_FILE, "utf8").trim();
  return [{ name: "jwt_token", value: token, domain: "localhost", path: "/" }];
}

/** Attend que la carte et ses marqueurs soient chargés */
async function mapReady(page) {
  await page.waitForFunction(() => document.querySelectorAll("gmp-advanced-marker").length > 5, null, { timeout: 120000 });
  await page.waitForTimeout(2500);
}

module.exports = { URL, cookies, mapReady, accent: "#2563eb" };
