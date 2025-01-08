// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : Maintenabilité : Toute modification liée à la gestion des bases de données peut être effectuée en un seul endroit.
// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : mongoClient.close() et redisClient.quit()).

const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

async function connectMongo() {
  // TODO: Implémenter la connexion MongoDB
  // Gérer les erreurs et les retries
  try {
    mongoClient = new MongoClient(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await mongoClient.connect();
    console.log('✅ MongoDB connecté avec succès');
    db = mongoClient.db(config.MONGO_DB_NAME); // Sélection de la base de données
    return db;
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB :', error);
    process.exit(1); // Quitter si la connexion échoue
  }
}

async function connectRedis() {
  // TODO: Implémenter la connexion Redis
  // Gérer les erreurs et les retries
  try {
    redisClient = redis.createClient({ url: config.REDIS_URI });
    redisClient.on('error', (err) => console.error('❌ Erreur Redis :', err));
    await redisClient.connect();
    console.log('✅ Redis connecté avec succès');
    return redisClient;
  } catch (error) {
    console.error('❌ Erreur de connexion à Redis :', error);
    process.exit(1);
  }
}

// Gestion de la fermeture des connexions
async function closeConnections() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log('✅ Connexion MongoDB fermée');
    }
    if (redisClient) {
      await redisClient.quit();
      console.log('✅ Connexion Redis fermée');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la fermeture des connexions :', error);
  }
}

// Événements pour gérer les signaux du processus
process.on('SIGINT', async () => {
  console.log('🛑 Signal SIGINT reçu. Fermeture des connexions...');
  await closeConnections();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Signal SIGTERM reçu. Fermeture des connexions...');
  await closeConnections();
  process.exit(0);
});

// Export des fonctions et clients
module.exports = {
  // TODO: Exporter les clients et fonctions utiles
  connectMongo,
  connectRedis,
  getMongoDb: () => db, // Fonction pour récupérer la base MongoDB
  getRedisClient: () => redisClient, // Fonction pour récupérer le client Redis
  closeConnections,
};