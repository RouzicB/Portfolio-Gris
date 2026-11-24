/* eslint-disable @typescript-eslint/no-require-imports -- script Node en CommonJS, hors du site */
// MeetSign · Créer une campagne : l'assistant en quatre étapes, jusqu'au lancement
const { BASE, cookies, accent } = require("./meetsign-shared.cjs");

module.exports = {
  project: "meetsign",
  name: "meetsign-campagne",
  url: `${BASE}/campagnes`,
  cookies,
  accent,
  poster: 26000,
  async prepare(page) {
    await page.getByText("Port des EPI").first().waitFor({ timeout: 120000 });
    await page.waitForTimeout(1500);
  },
  async run(page, h) {
    await h.caption(1, "Les campagnes de signature et leur avancement");
    await h.move(700, 420, 900);
    await h.move(1100, 600, 900);
    await h.wait(900);
    await h.click(page.getByRole("button", { name: "Nouvelle campagne" }), 900);
    await h.wait(1800);

    await h.caption(2, "Nouvelle campagne : titre, dates, type");
    await h.click("input[placeholder='Kit de reprise']", 800);
    await h.type("Accueil sécurité — atelier Montage", 55);
    await h.click(page.getByRole("button", { name: "Début" }), 700);
    await h.wait(500);
    await h.click([304, 791], 600);
    await h.wait(400);
    await h.click(page.getByRole("button", { name: "Fin" }), 700);
    await h.wait(500);
    await h.click([1179, 562], 600);
    await h.wait(400);
    await h.click(page.getByRole("button", { name: "18", exact: true }), 600);
    await h.wait(400);
    await h.click(page.getByRole("button", { name: "Sélectionner" }), 700);
    await h.wait(600);
    await h.click(page.getByText("Accueil sécurité").last(), 600);
    await h.wait(400);
    await h.move(900, 700, 500);
    await h.wheel(400, 6);
    await h.wait(400);
    await h.click("textarea", 700);
    await h.type("Consignes de circulation et EPI obligatoires dans l'atelier Montage.", 30);
    await h.wait(400);
    await h.click(page.getByRole("button", { name: "Continuer" }), 800);
    await h.wait(1600);

    await h.caption(3, "Le périmètre : un département entier, et une entreprise extérieure");
    await h.click([1523, 599], 800);
    await h.wait(1000);
    await h.click([344, 732], 700);
    await h.wait(1000);
    await h.click(page.getByRole("button", { name: "Externe" }), 800);
    await h.wait(1000);
    await h.click([304, 555], 700);
    await h.wait(1600);
    await h.click(page.getByRole("button", { name: "Continuer" }), 800);
    await h.wait(1500);

    await h.caption(4, "Les documents à lire avant de signer");
    const [chooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      h.click(page.getByRole("button", { name: "Parcourir" }).first(), 800),
    ]);
    await chooser.setFiles(process.env.MEETSIGN_DEMO_PDF);
    await h.wait(1800);
    await h.click(page.getByRole("button", { name: "Continuer" }), 800);
    await h.wait(1500);

    await h.caption(5, "Le récapitulatif, puis le lancement");
    await h.move(1100, 700, 700);
    await h.wheel(700, 8);
    await h.wait(1200);
    await h.click(page.getByRole("button", { name: "Confirmer" }), 900);
    await h.wait(3500);
  },
};
