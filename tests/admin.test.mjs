import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Les utilisateurs et les réponses Auth sont simulés ; aucun appel réseau.
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
  const lireModule = (nom) => {
    if (nom === "server-only") return {};
    return Object.hasOwn(remplacements, nom)
      ? remplacements[nom]
      : chargerModule(nom);
  };
  new Function("require", "module", "exports", "console", outputText)(
    lireModule, moduleCompile, moduleCompile.exports, { error() {} },
  );
  return moduleCompile.exports;
}

const membre = {
  id: "utilisateur-simule",
  email: "prive@example.invalid",
  role: "authenticated",
  app_metadata: { provider: "email" },
  user_metadata: { role: "admin", information: "METADONNEES_PRIVEES_SIMULEES" },
};
const administrateur = {
  ...membre,
  app_metadata: { ...membre.app_metadata, role: "admin" },
};
const reponseAuth = (utilisateur, error = null) => ({
  data: { user: utilisateur },
  error,
});

function sessionSimulee(reponses, { exceptionCreation = false } = {}) {
  const appels = { getUser: 0, getClaims: 0, getSession: 0 };
  const client = {
    auth: {
      async getUser() {
        const indice = Math.min(appels.getUser++, reponses.length - 1);
        const reponse = reponses[indice];
        if (reponse instanceof Error) throw reponse;
        return reponse;
      },
      async getClaims() {
        appels.getClaims++;
        throw new Error("Les claims ne remplacent pas la lecture Auth.");
      },
      async getSession() {
        appels.getSession++;
        throw new Error("La session stockée ne constitue pas une autorisation.");
      },
    },
  };
  const { obtenirSession } = charger("src/lib/session.ts", {
    "@/src/lib/supabase/server": {
      async createClient() {
        if (exceptionCreation) throw exceptionCreation;
        return client;
      },
    },
  });
  return { obtenirSession, appels };
}

function Link({ children, ...props }) {
  return React.createElement("a", props, children);
}

const navigation = {
  redirect(destination) {
    throw Object.assign(new Error("REDIRECT"), { code: "REDIRECT", destination });
  },
  notFound() {
    throw Object.assign(new Error("NOT_FOUND"), { code: "NOT_FOUND" });
  },
};

function pageAdmin(session, { articles = [], erreur = null, appels = [] } = {}) {
  const requete = {
    schema(nom) { appels.push(["schema", nom]); return this; },
    from(nom) { appels.push(["from", nom]); return this; },
    select(champs) { appels.push(["select", champs]); return this; },
    eq(champ, valeur) { appels.push(["eq", champ, valeur]); return this; },
    order(champ, options) { appels.push(["order", champ, options]); return this; },
    then(resolve, reject) {
      return Promise.resolve({
        data: erreur ? null : articles,
        error: erreur,
      }).then(resolve, reject);
    },
  };
  return charger("app/admin/page.tsx", {
    "@/src/lib/session": { async obtenirSession() { return session; } },
    "@/src/lib/supabase/server": {
      async createClient() {
        appels.push(["createClient"]);
        return requete;
      },
    },
    "next/navigation": navigation,
    "next/link": Link,
  }).default;
}

const mocksMenu = {
  "next/link": Link,
  "@/components/bouton-deconnexion": function Deconnexion() {
    return React.createElement("button", { type: "button" }, "Déconnexion simulée");
  },
};

test("seul le rôle applicatif obtenu par getUser accorde l'administration", async () => {
  const env = sessionSimulee([reponseAuth(administrateur)]);
  assert.deepEqual(await env.obtenirSession(), {
    utilisateur: administrateur,
    administrateur: true,
  });
  assert.deepEqual(env.appels, { getUser: 1, getClaims: 0, getSession: 0 });

  const tentative = sessionSimulee([{
    data: { user: { ...membre, role: "admin" }, role: "admin" },
    error: null,
  }]);
  const session = await tentative.obtenirSession();
  assert.equal(session.administrateur, false);
  assert.equal(session.utilisateur.id, membre.id);
  assert.equal(tentative.appels.getUser, 1);
  assert.equal(tentative.appels.getClaims + tentative.appels.getSession, 0);
});

test("un rôle absent, mal typé ou différent de la chaîne admin est refusé", async () => {
  for (const role of [undefined, null, "membre", "ADMIN", true, 1, ["admin"], {}]) {
    const utilisateur = {
      ...membre,
      app_metadata: role === undefined ? {} : { role },
    };
    const env = sessionSimulee([reponseAuth(utilisateur)]);
    const session = await env.obtenirSession();
    assert.equal(session.administrateur, false, `Rôle refusé : ${JSON.stringify(role)}`);
    assert.equal(session.utilisateur.id, membre.id);
  }
});

test("une session absente ou une erreur Auth ne laisse aucune autorisation résiduelle", async () => {
  for (const reponse of [
    reponseAuth(null),
    reponseAuth(null, { message: "Session expirée" }),
    reponseAuth(administrateur, { message: "Utilisateur non vérifié" }),
  ]) {
    const env = sessionSimulee([reponse]);
    assert.deepEqual(await env.obtenirSession(), {
      utilisateur: null,
      administrateur: false,
    });
  }
});

test("une exception de lecture Auth ferme aussi l'accès", async () => {
  const env = sessionSimulee([new Error("Auth indisponible")]);
  assert.deepEqual(await env.obtenirSession(), {
    utilisateur: null,
    administrateur: false,
  });
});

test("le signal de rendu dynamique de Next traverse la création du client", async () => {
  const interruption = Object.assign(new Error("Dynamic server usage"), {
    digest: "DYNAMIC_SERVER_USAGE",
  });
  const env = sessionSimulee([reponseAuth(administrateur)], {
    exceptionCreation: interruption,
  });
  await assert.rejects(() => env.obtenirSession(), (erreur) => erreur === interruption);
  assert.deepEqual(env.appels, { getUser: 0, getClaims: 0, getSession: 0 });
});

test("une nouvelle lecture Auth prend en compte le retrait du rôle admin", async () => {
  const env = sessionSimulee([reponseAuth(administrateur), reponseAuth(membre)]);
  // React.cache ne mémorise pas ces appels directs hors d'un rendu serveur React.
  assert.equal((await env.obtenirSession()).administrateur, true);
  assert.equal((await env.obtenirSession()).administrateur, false);
  assert.deepEqual(env.appels, { getUser: 2, getClaims: 0, getSession: 0 });
});

test("l'accès direct à admin refuse visiteurs et membres malgré des paramètres falsifiés", async () => {
  const props = {
    searchParams: Promise.resolve({ role: "admin", administrateur: "true" }),
    utilisateur: administrateur,
    administrateur: true,
  };
  const appelsVisiteur = [];
  const visiteur = pageAdmin(
    { utilisateur: null, administrateur: false },
    { appels: appelsVisiteur },
  );
  await assert.rejects(
    () => visiteur(props),
    (erreur) => erreur.code === "REDIRECT" && erreur.destination === "/connexion",
  );
  assert.deepEqual(appelsVisiteur, []);
  const appelsMembre = [];
  const pageMembre = pageAdmin(
    { utilisateur: membre, administrateur: false },
    { appels: appelsMembre },
  );
  await assert.rejects(() => pageMembre(props), (erreur) => erreur.code === "NOT_FOUND");
  assert.deepEqual(appelsMembre, []);
});

test("un administrateur vérifié peut afficher la page avec une liste vide ou une erreur", async () => {
  const session = { utilisateur: administrateur, administrateur: true };
  const appels = [];
  const page = pageAdmin(session, { appels });
  const html = renderToStaticMarkup(await page({ searchParams: Promise.resolve({}) }));
  assert.match(html, /<h1\b[^>]*>[^<]*administration[^<]*<\/h1>/i);
  assert.ok(html.includes("Aucun article publié pour le moment."));
  assert.ok(appels.some(([nom, champ, valeur]) =>
    nom === "eq" && champ === "status" && valeur === "published"));

  const pageEnErreur = pageAdmin(session, { erreur: { message: "Service indisponible" } });
  const htmlErreur = renderToStaticMarkup(await pageEnErreur({
    searchParams: Promise.resolve({}),
  }));
  assert.ok(htmlErreur.includes("Impossible de charger les articles pour le moment."));
  assert.ok(!htmlErreur.includes("Aucun article publié pour le moment."));
});

test("le lien Administration exige à la fois une connexion et le rôle admin", () => {
  const MenuNavigation = charger("components/layout/menu-navigation.tsx", mocksMenu).default;
  for (const connecte of [false, true]) {
    for (const administrateur of [false, true]) {
      const html = renderToStaticMarkup(React.createElement(MenuNavigation, {
        connecte,
        administrateur,
      }));
      assert.equal(html.includes('href="/admin"'), connecte && administrateur);
      assert.equal(html.includes('href="/mes-articles"'), connecte);
      assert.equal(html.includes('href="/connexion"'), !connecte);
    }
  }
});

test("le lien Administration ferme aussi le menu mobile", () => {
  const changements = [];
  const MenuNavigation = charger("components/layout/menu-navigation.tsx", {
    ...mocksMenu,
    react: {
      ...React,
      useState() { return [true, (valeur) => changements.push(valeur)]; },
      useRef() { return { current: null }; },
    },
  }).default;
  function trouverLien(element) {
    if (!element || typeof element !== "object") return null;
    if (element.type === Link && element.props.href === "/admin") return element;
    const enfants = element.props?.children;
    for (const enfant of Array.isArray(enfants) ? enfants : [enfants]) {
      const lien = trouverLien(enfant);
      if (lien) return lien;
    }
    return null;
  }
  const lien = trouverLien(MenuNavigation({ connecte: true, administrateur: true }));
  assert.ok(lien, "Le lien admin doit être présent dans le menu connecté.");
  assert.equal(typeof lien.props.onClick, "function");
  lien.props.onClick();
  assert.deepEqual(changements, [false]);
});

test("la navbar ne transmet au composant client que les deux booléens nécessaires", async () => {
  for (const session of [
    { utilisateur: null, administrateur: false },
    { utilisateur: membre, administrateur: false },
    { utilisateur: administrateur, administrateur: true },
  ]) {
    const recus = [];
    const Navbar = charger("components/layout/navabar.tsx", {
      "@/src/lib/session": { async obtenirSession() { return session; } },
      "next/link": Link,
      "./menu-navigation": function Menu(props) {
        recus.push(props);
        return React.createElement("span", { "data-menu-simule": "oui" });
      },
    }).default;
    const html = renderToStaticMarkup(await Navbar());
    assert.deepEqual(recus, [{
      connecte: Boolean(session.utilisateur),
      administrateur: session.administrateur,
    }]);
    assert.ok(!html.includes(membre.id));
    assert.ok(!html.includes(membre.email));
    assert.ok(!html.includes(membre.user_metadata.information));
  }
});
