# Correctif Prisma — 3 novembre 2026

Les trois entrées élevées remontent la même chaîne Prisma/config/deepmerge-ts,
avis [GHSA-ggr8-5vv4-36mx](https://github.com/advisories/GHSA-ggr8-5vv4-36mx) :
fusion de graphes cycliques entraînant un débordement de pile. Un JSON simple
ne produit pas seul ces cycles.

Prisma et son client restent en 6.19.3 ; seul @prisma/config reçoit un override
deepmerge-ts 8.0.2, déjà utilisé dans Assistant. Les changements majeurs v8 ont
été relus et le chargement réel de configuration est testé. Ce n'est pas une
migration vers Prisma 7 ni vers le driver MongoDB natif ; aucun schéma, compte,
email ou rattachement d'organisation n'est modifié.

Validation dans un dossier et un MongoDB éphémères : trois tests test:prisma,
Prisma validate/generate, lint, typage et build réussis. Le test vérifie les
fichiers réellement installés et le graphe cyclique de l'avis. Aucun email réel,
appel IA ou seed de démonstration exécuté. Installation effectuée, tests physiques
réussis : zéro vulnérabilité de production. L'override devra être retiré après correction de
la dépendance officielle dans la version Prisma retenue.

Les traces serveur Next n'incluent pas deepmerge-ts ni @prisma/config, employés
par la CLI. Installation du seul paquet corrigé sans scripts ; build actif et
client Prisma inchangés, donc pas de redémarrage PM2 requis pour ce lot.

Problème préexistant relevé pendant le build : Better Auth signale user.image
absent du schéma Prisma. Ce champ était déjà absent avant l'override et la
version Better Auth n'a pas changé. Le build aboutit, mais ce diagnostic et la
recette de connexion restent à traiter séparément ; ne pas prétendre que ce
correctif de dépendance valide toute l'authentification de l'application.

Sources : https://github.com/RebeccaStevens/deepmerge-ts/releases/tag/v8.0.0
