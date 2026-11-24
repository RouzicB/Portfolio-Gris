/* eslint-disable @typescript-eslint/no-require-imports -- script Node en CommonJS, hors du site */
// Lokali · Placer un point : glisser un picto sur la carte, compléter sa fiche, le retrouver
const { URL, cookies, mapReady, accent } = require("./lokali-shared.cjs");

module.exports = {
  project: "lokali",
  name: "lokali-placer",
  url: URL,
  cookies,
  accent,
  poster: 11000,
  async prepare(page) {
    await mapReady(page);
    await page.mouse.click(996, 423);
    await page.waitForTimeout(3000);
  },
  async run(page, h) {
    await h.caption(1, "Glisser un picto de la barre d'outils sur la carte");
    await h.wait(600);
    await h.click([41, 231], 800);
    await h.wait(900);
    await h.drag([41, 255], [700, 380], 1500);
    await h.wait(2200);

    await h.caption(2, "Le point est créé : on complète sa fiche");
    await h.click([700, 364], 800);
    await h.wait(1300);
    await h.click(page.getByRole("button", { name: "Modifier" }).first(), 700);
    await h.wait(1200);
    await h.click(page.getByRole("button", { name: "Suivant" }).first(), 800);
    await h.wait(900);
    await h.click("input[placeholder='Entrez le titre du pin']", 700);
    await page.keyboard.press("Control+A");
    await h.type("Extincteur CO₂ n° 204", 70);
    await h.click("textarea[placeholder='Entrez la description du pin']", 700);
    await page.keyboard.press("Control+A");
    await h.type("Posé près du poste de retouche, à intégrer à la ronde mensuelle.", 35);
    await h.wait(400);
    await h.click(page.getByRole("button", { name: "Actif", exact: true }).first(), 800);
    await h.wait(700);
    await h.click(page.getByRole("button", { name: "Enregistrer" }).first(), 800);
    await h.wait(2000);

    await h.caption(3, "La fiche est à jour, visible de tous");
    await h.click([700, 364], 800);
    await h.wait(3000);
    await h.click(".close-infowindow:visible", 700);
    await h.wait(800);
  },
};
