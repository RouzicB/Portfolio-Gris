/* eslint-disable @typescript-eslint/no-require-imports -- script Node en CommonJS, hors du site */
// Lokali · Explorer le site : vue d'ensemble, zoom sur un bâtiment, fiche d'un point, recherche, liste
const { URL, cookies, mapReady, accent } = require("./lokali-shared.cjs");

module.exports = {
  project: "lokali",
  name: "lokali-explorer",
  url: URL,
  cookies,
  accent,
  poster: 9000,
  prepare: mapReady,
  async run(page, h) {
    await h.caption(1, "Vue d'ensemble de l'usine : les points regroupés par bâtiment");
    await h.move(1150, 650, 900);
    await h.wait(1600);
    await h.click([996, 423], 900);
    await h.wait(2600);

    await h.caption(2, "Chaque point porte la couleur de son statut");
    await h.click([778, 502], 900);
    await h.wait(3000);
    await h.click(".close-infowindow:visible", 700);
    await h.wait(700);

    await h.caption(3, "Rechercher un équipement, et ouvrir sa fiche");
    await h.click("input[placeholder='Rechercher…']", 900);
    await h.wait(300);
    await h.type("Compres", 110);
    await h.wait(1200);
    await h.click(page.getByText("Compresseur d'air CP-04").first(), 800);
    await h.wait(3200);
    await h.click(".close-infowindow:visible", 700);
    await h.wait(500);

    await h.caption(4, "La liste des points visibles, avec leur statut");
    await h.click("button[aria-label='Liste des pins visibles']", 900);
    await h.wait(1800);
    await h.move(1400, 520, 700);
    await h.wheel(420, 8);
    await h.wait(1800);
  },
};
