import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Odyssée Kréyol",
  description: "Informations sur les données personnelles utilisées par Odyssée Kréyol.",
};

export default function PolitiqueConfidentialite() {
  return (
    <main className="mx-auto w-full max-w-3xl text-(--odyssey-ocean)">
      <h1 className="text-3xl font-semibold sm:text-4xl">Politique de confidentialité</h1>
      <p className="mt-4 leading-relaxed">
        Cette politique est en cours de préparation. Les informations signalées
        comme restant à préciser doivent être complétées avant l’ouverture publique.
      </p>

      <section className="mt-8" aria-labelledby="responsable">
        <h2 id="responsable" className="text-xl font-semibold">Responsable et contact</h2>
        <p className="mt-3 leading-relaxed">
          Le responsable du site est Borys MARESTER, entrepreneur individuel (EI),
          domicilié au 16 rue Chevalier de la Barre, 59260 Hellemmes. Pour toute
          question concernant vos données personnelles, écrivez à{" "}
          <a className="underline" href="mailto:b.marester@gmail.com">b.marester@gmail.com</a>.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="donnees-utilisees">
        <h2 id="donnees-utilisees" className="text-xl font-semibold">Données utilisées et finalités</h2>
        <div className="mt-3 space-y-3 leading-relaxed">
          <p>
            La création d’un compte demande une adresse e-mail et un mot de passe.
            Le service d’authentification Supabase gère le compte et la connexion.
            Ces informations servent à permettre l’accès aux fonctions réservées aux membres.
          </p>
          <p>
            Lorsqu’un membre publie un article, son titre, son résumé et son contenu
            sont enregistrés avec une référence à son compte. Les articles publiés
            sont accessibles aux visiteurs ; leur contenu peut contenir des données
            personnelles si l’auteur en partage.
          </p>
          <p>
            Lorsqu’une personne nous écrit par e-mail, son adresse et le contenu de
            son message sont utilisés pour traiter sa demande.
          </p>
          <p>À préciser avant la mise en ligne : les bases légales et les données techniques traitées pour chaque finalité.</p>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="destinataires">
        <h2 id="destinataires" className="text-xl font-semibold">Accès aux données et prestataires</h2>
        <div className="mt-3 space-y-3 leading-relaxed">
          <p>
            L’administration du site permet à l’administrateur de gérer les comptes
            et les articles publiés. Supabase est utilisé pour l’authentification et
            le stockage des données de l’application. Vercel est l’hébergeur prévu.
          </p>
          <p>
            À préciser avant la mise en ligne : la liste définitive des prestataires,
            les lieux de traitement, ainsi que les éventuels transferts hors de l’Espace
            économique européen et leurs garanties.
          </p>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="conservation">
        <h2 id="conservation" className="text-xl font-semibold">Conservation et suppression</h2>
        <div className="mt-3 space-y-3 leading-relaxed">
          <p>
            À préciser avant la mise en ligne : les durées de conservation ou les
            critères permettant de les déterminer pour les comptes, articles, messages,
            journaux et sauvegardes.
          </p>
          <p>
            Lorsqu’un compte est supprimé par l’administration, ses articles sont
            conservés et ne sont plus associés à ce compte. Leur contenu peut
            néanmoins identifier leur ancien auteur. Une demande concernant un
            article peut être adressée à l’adresse e-mail indiquée ci-dessus.
          </p>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="cookies">
        <h2 id="cookies" className="text-xl font-semibold">Cookies et carte Google Maps</h2>
        <div className="mt-3 space-y-3 leading-relaxed">
          <p>
            Des informations de session sont utilisées notamment pour maintenir la
            connexion des membres et contribuer à sa sécurité.
          </p>
          <p>
            La page Contact intègre une carte Google Maps. Lors de son chargement,
            le navigateur contacte Google, qui peut recevoir notamment l’adresse IP
            et des informations techniques. Les éventuels traceurs utilisés et les
            modalités de consentement applicables restent à vérifier avant la mise en ligne.
          </p>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="droits">
        <h2 id="droits" className="text-xl font-semibold">Vos droits</h2>
        <div className="mt-3 space-y-3 leading-relaxed">
          <p>
            Selon les conditions applicables, vous pouvez demander l’accès à vos
            données, leur rectification ou leur effacement, la limitation du traitement,
            vous y opposer ou demander leur portabilité. Lorsque le traitement repose
            sur votre consentement, vous pouvez le retirer.
          </p>
          <p>
            Pour exercer vos droits, contactez-nous à{" "}
            <a className="underline" href="mailto:b.marester@gmail.com">b.marester@gmail.com</a>.
            Vous pouvez également adresser une réclamation à la{" "}
            <a className="underline" href="https://www.cnil.fr/fr/plaintes">CNIL</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
