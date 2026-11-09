import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Aucun appel réseau : les actions et les pages utilisent un client simulé.
const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chargerModule = createRequire(path.join(racine, "package.json"));
const ts = chargerModule("typescript");
const React = chargerModule("react");
const { renderToStaticMarkup } = chargerModule("react-dom/server");

function charger(fichier, remplacements = {}) {
  const filename = path.join(racine, fichier);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  const moduleCompile = { exports: {} };
  const lireModule = (nom) => Object.hasOwn(remplacements, nom)
    ? remplacements[nom]
    : chargerModule(nom);
  new Function("require", "module", "exports", "console", outputText)(
    lireModule, moduleCompile, moduleCompile.exports, { error() {} },
  );
  return moduleCompile.exports;
}

const outils = charger("src/lib/articles.ts");
const auteur = "11111111-1111-4111-8111-111111111111";
const articleId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const articleExistant = {
  id: articleId,
  title: "Titre initial",
  excerpt: "Résumé initial",
  slug: "adresse-existante",
  content: outils.texteVersDocument("Premier paragraphe.\nSecond paragraphe."),
  status: "published",
};
const etatInitial = { message: "", valeurs: { titre: "", resume: "", contenu: "" } };

function environnement(options = {}) {
  const evenements = [];
  const filtres = [];
  const mutations = [];
  const resultat = {
    data: Object.hasOwn(options, "article") ? options.article : articleExistant,
    error: options.erreur || null,
  };
  const requete = {
    schema(nom) { evenements.push(["schema", nom]); return this; },
    from(nom) { evenements.push(["table", nom]); return this; },
    select(champs) { evenements.push(["select", champs]); return this; },
    eq(champ, valeur) { filtres.push([champ, valeur]); return this; },
    order() { return this; },
    update(valeurs) { mutations.push(["update", valeurs]); return this; },
    delete() { mutations.push(["delete"]); return this; },
    async insert(valeurs) {
      mutations.push(["insert", valeurs]);
      if (options.exception) throw new Error("réseau indisponible");
      return { error: options.erreur || null };
    },
    async maybeSingle() {
      if (options.exception) throw new Error("réseau indisponible");
      return resultat;
    },
    then(resolve, reject) {
      return Promise.resolve({
        data: options.articles || [],
        error: options.erreur || null,
      }).then(resolve, reject);
    },
  };
  const client = {
    schema: requete.schema.bind(requete),
    auth: {
      async getUser() {
        return {
          data: { user: options.sansSession ? null : { id: auteur } },
          error: options.erreurSession || null,
        };
      },
    },
  };
  const mocks = {
    "@/src/lib/articles": outils,
    "@/src/lib/supabase/server": { async createClient() { return client; } },
    "next/cache": {
      revalidatePath(url) { evenements.push(["revalidate", url]); },
    },
    "next/navigation": {
      redirect(destination) {
        evenements.push(["redirect", destination]);
        throw Object.assign(new Error("REDIRECT"), { code: "REDIRECT", destination });
      },
      notFound() {
        throw Object.assign(new Error("NOT_FOUND"), { code: "NOT_FOUND" });
      },
    },
    "next/link": function Link({ children, ...props }) {
      return React.createElement("a", props, children);
    },
    "@/app/mes-articles/actions": {
      async modifierArticle() { return etatInitial; },
    },
    "@/components/formulaire-article": function Formulaire({ valeursInitiales }) {
      return React.createElement("textarea", { defaultValue: valeursInitiales.contenu });
    },
    "@/components/confirmation-suppression-article": function Confirmation() {
      return React.createElement("form", { "data-confirmation": "oui" });
    },
  };
  return { mocks, mutations, filtres, evenements };
}

function formulaire(valeurs = {}) {
  const donnees = new FormData();
  for (const [nom, valeur] of Object.entries({
    titre: "  Nouveau titre  ",
    resume: "  Nouveau résumé  ",
    contenu: "Premier texte.\n\nSecond texte.",
    ...valeurs,
  })) donnees.set(nom, valeur);
  return donnees;
}

const actions = (env) => charger("app/mes-articles/actions.ts", env.mocks);
const rendu = async (fichier, env, props) =>
  renderToStaticMarkup(await charger(fichier, env.mocks).default(props));
const redirigeVers = (url) => (erreur) =>
  erreur.code === "REDIRECT" && erreur.destination === url;
const sansSucces = (env) =>
  assert.ok(!env.evenements.some(([nom]) => ["redirect", "revalidate"].includes(nom)));

test("création et lecture partagent le même format JSON de paragraphes", () => {
  const texte = "  Bonjour\r\n\r\nLa Guadeloupe\rDernier paragraphe";
  assert.deepEqual(outils.lireParagraphes(outils.texteVersDocument(texte)), [
    "Bonjour", "La Guadeloupe", "Dernier paragraphe",
  ]);
  assert.deepEqual(outils.lireParagraphes({ type: "doc", content: [{ type: "paragraph" }] }), [""]);
});

test("le lecteur refuse les documents inconnus sans afficher un contenu partiel", () => {
  for (const valeur of [null, 42, "texte", [], {}, { type: "doc", content: "texte" }]) {
    assert.equal(outils.lireParagraphes(valeur), null);
  }
  assert.equal(outils.lireParagraphes({
    type: "doc", content: [
      { type: "paragraph", content: [{ type: "text", text: "Début" }] },
      { type: "image" },
    ],
  }), null);
});

test("un texte HTML reste du texte dans le rendu React", () => {
  const [texte] = outils.lireParagraphes(outils.texteVersDocument("<script>alert(1)</script>"));
  const html = renderToStaticMarkup(React.createElement("p", null, texte));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(!html.includes("<script>"));
});

test("les valeurs obligatoires, les fichiers et les longueurs sont validés côté serveur", () => {
  assert.ok(outils.validerArticle(outils.lireValeursArticle(new FormData())));
  assert.ok(outils.validerArticle(outils.lireValeursArticle(formulaire({ titre: "  " }))));
  assert.ok(outils.validerArticle(outils.lireValeursArticle(formulaire({ contenu: new Blob(["texte"]) }))));
  for (const champ of ["titre", "resume", "contenu"]) {
    const valeurs = outils.lireValeursArticle(formulaire({
      [champ]: "a".repeat(outils.LIMITES_ARTICLE[champ] + 1),
    }));
    assert.ok(outils.validerArticle(valeurs));
  }
});

test("une publication garde l'auteur serveur et actualise les deux listes", async () => {
  const env = environnement();
  const publier = charger("app/articles/ecrire/actions.ts", env.mocks).publierArticle;
  await assert.rejects(
    () => publier(etatInitial, formulaire({ author_id: "intrus", status: "draft" })),
    (erreur) => erreur.code === "REDIRECT",
  );
  const article = env.mutations[0][1];
  assert.equal(article.author_id, auteur);
  assert.equal(article.status, "published");
  assert.match(article.slug, /^nouveau-titre-[a-f0-9-]{36}$/);
  assert.ok(env.evenements.some(([nom, url]) => nom === "revalidate" && url === "/mes-articles"));
  assert.ok(env.evenements.some(([nom, url]) => nom === "revalidate" && url === "/articles"));
});

test("deux publications portant le même titre ont des slugs distincts", async () => {
  const slugs = [];
  for (let i = 0; i < 2; i++) {
    const env = environnement();
    const publier = charger("app/articles/ecrire/actions.ts", env.mocks).publierArticle;
    await assert.rejects(() => publier(etatInitial, formulaire()), (e) => e.code === "REDIRECT");
    slugs.push(env.mutations[0][1].slug);
  }
  assert.notEqual(slugs[0], slugs[1]);
});

test("une modification ne transmet ni auteur ni slug ni statut à UPDATE", async () => {
  const env = environnement();
  await assert.rejects(
    () => actions(env).modifierArticle(articleId, etatInitial, formulaire({
      author_id: "intrus", slug: "nouvelle-adresse", status: "draft",
    })),
    redirigeVers("/mes-articles?resultat=modifie"),
  );
  const valeurs = env.mutations[0][1];
  assert.deepEqual(Object.keys(valeurs).sort(), ["content", "excerpt", "title"]);
  assert.equal(valeurs.title, "Nouveau titre");
  assert.equal(valeurs.excerpt, "Nouveau résumé");
  assert.deepEqual(outils.lireParagraphes(valeurs.content), ["Premier texte.", "Second texte."]);
  assert.ok(env.filtres.some(([nom, valeur]) => nom === "id" && valeur === articleId));
  assert.ok(env.filtres.some(([nom, valeur]) => nom === "author_id" && valeur === auteur));
  assert.ok(env.evenements.some(([nom, url]) => nom === "revalidate" && url === "/articles/adresse-existante"));
  assert.ok(env.evenements.some(([nom, url]) => nom === "revalidate" && url === "/mes-articles/" + articleId + "/supprimer"));
});

test("un identifiant invalide ou un champ vide ne lance pas UPDATE", async () => {
  for (const [id, donnees] of [["invalide", formulaire()], [articleId, formulaire({ contenu: " " })]]) {
    const env = environnement();
    const resultat = await actions(env).modifierArticle(id, etatInitial, donnees);
    assert.ok(resultat.message);
    assert.equal(env.mutations.length, 0);
    sansSucces(env);
  }
});

test("une session absente ou invalide bloque la modification", async () => {
  for (const options of [{ sansSession: true }, { erreurSession: { message: "expirée" } }]) {
    const env = environnement(options);
    const resultat = await actions(env).modifierArticle(articleId, etatInitial, formulaire());
    assert.ok(resultat.message);
    assert.equal(env.mutations.length, 0);
    sansSucces(env);
  }
});

test("une modification sans ligne autorisée ne produit pas un faux succès", async () => {
  const env = environnement({ article: null });
  const resultat = await actions(env).modifierArticle(articleId, etatInitial, formulaire());
  assert.ok(resultat.message.includes("introuvable"));
  sansSucces(env);
});

test("les erreurs de modification conservent les champs sans redirection", async () => {
  for (const options of [{ erreur: { code: "42501" } }, { exception: true }]) {
    const env = environnement(options);
    const resultat = await actions(env).modifierArticle(articleId, etatInitial, formulaire());
    assert.ok(resultat.message);
    assert.equal(resultat.valeurs.titre, "  Nouveau titre  ");
    sansSucces(env);
  }
});

test("la confirmation de suppression est aussi exigée par le serveur", async () => {
  for (const valeur of [undefined, "", "non"]) {
    const env = environnement();
    const donnees = new FormData();
    if (valeur !== undefined) donnees.set("confirmation", valeur);
    const resultat = await actions(env).supprimerArticle(articleId, { message: "" }, donnees);
    assert.ok(resultat.message.includes("confirmation"));
    assert.equal(env.mutations.length, 0);
    sansSucces(env);
  }
});

test("une suppression confirmée cible l'auteur et invalide l'ancien détail", async () => {
  const env = environnement();
  await assert.rejects(
    () => actions(env).supprimerArticle(articleId, { message: "" }, formulaire({ confirmation: "oui" })),
    redirigeVers("/mes-articles?resultat=supprime"),
  );
  assert.deepEqual(env.mutations, [["delete"]]);
  assert.ok(env.filtres.some(([nom, valeur]) => nom === "author_id" && valeur === auteur));
  assert.ok(env.filtres.some(([nom, valeur]) => nom === "id" && valeur === articleId));
  assert.ok(env.evenements.some(([nom, url]) => nom === "revalidate" && url === "/articles/adresse-existante"));
  assert.ok(env.evenements.some(([nom, url]) => nom === "revalidate" && url === "/mes-articles"));
});

test("une session absente bloque aussi une suppression confirmée", async () => {
  const env = environnement({ sansSession: true });
  const resultat = await actions(env).supprimerArticle(articleId, { message: "" }, formulaire({ confirmation: "oui" }));
  assert.ok(resultat.message);
  assert.equal(env.mutations.length, 0);
});

test("une suppression inexistante, refusée ou interrompue ne simule pas un succès", async () => {
  for (const options of [{ article: null }, { erreur: { code: "42501" } }, { exception: true }]) {
    const env = environnement(options);
    const resultat = await actions(env).supprimerArticle(articleId, { message: "" }, formulaire({ confirmation: "oui" }));
    assert.ok(resultat.message);
    sansSucces(env);
  }
});

test("Mes articles exige une connexion et filtre sur l'auteur vérifié", async () => {
  const visiteur = environnement({ sansSession: true });
  await assert.rejects(
    () => rendu("app/mes-articles/page.tsx", visiteur, { searchParams: Promise.resolve({}) }),
    redirigeVers("/connexion"),
  );
  const membre = environnement({ articles: [articleExistant] });
  const html = await rendu("app/mes-articles/page.tsx", membre, { searchParams: Promise.resolve({}) });
  assert.ok(membre.filtres.some(([nom, valeur]) => nom === "author_id" && valeur === auteur));
  assert.ok(html.includes("/mes-articles/" + articleId + "/modifier"));
  assert.ok(html.includes("/mes-articles/" + articleId + "/supprimer"));
});

test("la liste distingue une erreur d'une liste vide et limite les messages de résultat", async () => {
  const erreur = await rendu("app/mes-articles/page.tsx", environnement({ erreur: { message: "réseau" } }), {
    searchParams: Promise.resolve({}),
  });
  assert.ok(erreur.includes("Impossible de charger"));
  assert.ok(!erreur.includes("Tu n’as pas encore"));
  const vide = await rendu("app/mes-articles/page.tsx", environnement(), {
    searchParams: Promise.resolve({ resultat: "<script>intrus</script>" }),
  });
  assert.ok(vide.includes("Tu n’as pas encore"));
  assert.ok(!vide.includes("intrus"));
  const succes = await rendu("app/mes-articles/page.tsx", environnement(), {
    searchParams: Promise.resolve({ resultat: "modifie" }),
  });
  assert.ok(succes.includes("Ton article a été modifié."));
});

test("la page de modification préremplit le texte et filtre l'auteur", async () => {
  const env = environnement();
  const html = await rendu("app/mes-articles/[id]/modifier/page.tsx", env, {
    params: Promise.resolve({ id: articleId }),
  });
  assert.ok(html.includes("Premier paragraphe.\nSecond paragraphe."));
  assert.ok(env.filtres.some(([nom, valeur]) => nom === "author_id" && valeur === auteur));
  assert.equal(env.mutations.length, 0);
});

test("les pages d'édition et suppression refusent l'article d'un autre membre", async () => {
  for (const operation of ["modifier", "supprimer"]) {
    const env = environnement({ article: null });
    await assert.rejects(
      () => rendu("app/mes-articles/[id]/" + operation + "/page.tsx", env, {
        params: Promise.resolve({ id: articleId }),
      }),
      (e) => e.code === "NOT_FOUND",
    );
    assert.equal(env.mutations.length, 0);
  }
});

test("ouvrir la confirmation ne supprime rien", async () => {
  const env = environnement();
  const html = await rendu("app/mes-articles/[id]/supprimer/page.tsx", env, {
    params: Promise.resolve({ id: articleId }),
  });
  assert.ok(html.includes("Cette suppression est définitive."));
  assert.ok(html.includes('data-confirmation="oui"'));
  assert.equal(env.mutations.length, 0);
});

test("un document inconnu ne peut pas être écrasé par le formulaire simple", async () => {
  const env = environnement({ article: { ...articleExistant, content: { type: "inconnu" } } });
  const html = await rendu("app/mes-articles/[id]/modifier/page.tsx", env, {
    params: Promise.resolve({ id: articleId }),
  });
  assert.ok(!html.includes("<textarea"));
  assert.ok(html.includes("n’est pas encore pris en charge"));
});

test("l'édition refuse aussi de perdre les marques d'un ancien document enrichi", () => {
  const document = {
    type: "doc",
    content: [{
      type: "paragraph",
      content: [{ type: "text", text: "Texte en gras", marks: [{ type: "bold" }] }],
    }],
  };
  assert.deepEqual(outils.lireParagraphes(document), ["Texte en gras"]);
  assert.equal(outils.textePourEdition(document), null);
  assert.equal(outils.textePourEdition(outils.texteVersDocument("Bonjour\nSuite")), "Bonjour\nSuite");
});

test("le détail public conserve le contenu, les métadonnées et la 404", async () => {
  const env = environnement();
  const page = charger("app/articles/[slug]/page.tsx", env.mocks);
  const props = { params: Promise.resolve({ slug: "adresse-existante" }) };
  const meta = await page.generateMetadata(props);
  assert.equal(meta.description, "Résumé initial");
  const html = renderToStaticMarkup(await page.default(props));
  assert.ok(html.includes("Premier paragraphe."));
  assert.ok(env.filtres.some(([nom, valeur]) => nom === "status" && valeur === "published"));
  const absent = charger("app/articles/[slug]/page.tsx", environnement({ article: null }).mocks);
  await assert.rejects(() => absent.default(props), (e) => e.code === "NOT_FOUND");
});
