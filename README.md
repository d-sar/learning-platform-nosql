

Installation et lancement :
npm install
npm start

Structure du projet :
db.js : Gère les connexions aux bases de données MongoDB et Redis.
env.js : Contient les variables d'environnement.
routes/ : Contient les routes de l'application.
controllers/ : Gère la logique des requêtes.
services/ : Contient les services métier.

Choix techniques :
Utilisation de MongoDB et Redis pour leur complémentarité (NoSQL + cache).
Séparation des responsabilités dans des modules dédiés.
Gestion centralisée des erreurs et des connexions.

![Capture d'écran 2025-01-12 212828](https://github.com/user-attachments/assets/579404cc-7018-4f0c-a861-2c9457f7c426)
