// Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
// Réponse : Valider les variables d'environnement garantit que l'application dispose de toutes les informations nécessaires pour fonctionner correctement ; D'éviter des erreurs imprévues pendant l'exécution (e.g., accès à une base de données avec une URL incorrecte ou inexistante).
// Question: Que se passe-t-il si une variable requise est manquante ?
// Réponse : , l'application risque de rencontrer des erreurs critiques, comme : Une erreur de connexion aux services externes (exemple : MongoDB ou Redis).

const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

// Validation des variables d'environnement
function validateEnv() {
  // TODO: Implémenter la validation
  // Si une variable manque, lever une erreur explicative
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`❌ Les variables d'environnement suivantes sont manquantes : ${missingVars.join(', ')}.`);
  }

  console.log('✅ Toutes les variables d\'environnement nécessaires sont présentes.');

}

validateEnv();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000
};