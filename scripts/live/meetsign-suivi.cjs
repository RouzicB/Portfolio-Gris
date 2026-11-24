/* eslint-disable @typescript-eslint/no-require-imports -- script Node en CommonJS, hors du site */
// MeetSign · Suivre les signatures : détail d'une campagne, tableau de bord, traçabilité
const { BASE, cookies, accent } = require("./meetsign-shared.cjs");

module.exports = {
  project: "meetsign",
  name: "meetsign-suivi",
  url: `${BASE}/campagnes`,
  cookies,
  accent,
  poster: 22000,
  async prepare(page) {
    await page.getByText("Port des EPI").first().waitFor({ timeout: 120000 });
    await page.waitForTimeout(1500);
  },
  async run(page, h) {
    await h.caption(1, "Le détail d'une campagne : la progression, équipe par équipe");
    await h.click(page.getByText("Port des EPI — Département Montage").first(), 1000);
    await h.wait(2200);
    await h.move(590, 452, 700);
    await h.move(590, 536, 900);
    await h.wait(800);

    await h.caption(2, "Qui a signé, qui reste à relancer");
    await h.click(page.getByRole("button", { name: /Direction de l'usine/ }).first(), 900);
    await h.wait(1200);
    await h.click(page.getByRole("button", { name: /Département Montage/ }).first(), 800);
    await h.wait(1800);
    await h.move(1180, 560, 600);
    await h.wheel(500, 8);
    await h.wait(2200);

    await h.caption(3, "Le tableau de bord, toutes campagnes confondues");
    await h.click(page.getByRole("button", { name: "Tableau de bord" }).first(), 900);
    await h.wait(3000);
    await h.click(page.getByRole("button", { name: "Classement" }), 800);
    await h.wait(2400);
    await h.click(page.getByRole("button", { name: "Anneau" }), 800);
    await h.wait(2600);

    await h.caption(4, "La traçabilité : chaque signature, sa date, son opérateur");
    await h.click(page.getByRole("button", { name: "Traçabilité" }).first(), 900);
    await h.wait(3000);
    await h.move(900, 600, 700);
    await h.wheel(400, 6);
    await h.wait(2000);
  },
};
