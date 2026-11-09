# Page contact

`app/contact/page.tsx` affiche les coordonnées d’Odyssée Kréyol, un lien et un bouton `mailto:`, les sujets de contact et la localisation. Le bouton ouvre la messagerie du visiteur, sans formulaire ni stockage de message.

La page reste un composant serveur et conserve la palette existante, l’e-mail, l’adresse et le lien « Ouvrir dans Google Maps ».

## Carte intégrée

La carte utilise directement l’iframe partagée par le développeur, avec une source `https://www.google.com/maps/embed?pb=…`. L’URL complète est conservée dans la page.
Aucune clé API ni configuration Google Cloud n’est nécessaire pour cette intégration.
L’iframe déclare une largeur de 800 px et une hauteur de 400 px ; le CSS adapte sa largeur au conteneur et conserve une hauteur de 400 px.
Elle possède un titre descriptif, `loading="lazy"`, `allowFullScreen` et `referrerPolicy="strict-origin-when-cross-origin"`.
Le lien externe vers Google Maps reste disponible indépendamment de la carte.

## Vérifications restantes

Aucun test, lint, build ou contrôle dans le navigateur n’a été lancé pour cette modification. L’affichage mobile, la messagerie, le lien externe et la carte restent à vérifier visuellement plus tard.
Le libellé de l’URL fournie mentionne « 16 Rue Chevalier de la Barre, 59800 Lille », tandis que l’adresse textuelle reste « 16 rue Chevalier de la Barre, 59260 Hellemmes ». La cohérence du repère est à vérifier, sans modifier l’adresse affichée.
