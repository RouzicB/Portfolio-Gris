/* eslint-disable @typescript-eslint/no-require-imports -- script Node en CommonJS, hors du site */
// Réglages communs aux démos MeetSign : instance locale (front 3200, API 3120) remplie de données fictives,
// session d'un utilisateur de démo (jeton signé avec le secret de l'instance locale, voir MEETSIGN_TOKEN_FILE).
const fs = require("node:fs");

const BASE = process.env.MEETSIGN_URL ?? "http://localhost:3200";

function cookies() {
  const token = fs.readFileSync(process.env.MEETSIGN_TOKEN_FILE, "utf8").trim();
  return [{ name: "jwt_token", value: token, domain: "localhost", path: "/" }];
}

module.exports = { BASE, cookies, accent: "#7c3aed" };
