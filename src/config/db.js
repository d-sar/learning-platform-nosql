// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : Maintenabilité : Toute modification liée à la gestion des bases de données peut être effectuée en un seul endroit.
// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : mongoClient.close() et redisClient.quit()).

const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

async function connectMongo() {
  try {
    console.log('Connecting to MongoDB...');
    mongoClient = new MongoClient(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoClient.connect();
    db = mongoClient.db(config.mongodb.dbName);  // Assurez-vous d'assigner l'objet db ici
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
}

async function connectRedis() {
  try {
    redisClient = redis.createClient({ url: config.REDIS_URI });
    redisClient.on('error', (err) => console.error('❌ Redis Error:', err));
    await redisClient.connect();
    console.log('✅ Connected to Redis');
  } catch (error) {
    console.error('❌ Error connecting to Redis:', error);
    process.exit(1);
  }
}

function getMongoDb() {
  if (!db) {
    throw new Error('MongoDB connection is not established yet.');
  }
  return db;
}

async function closeConnections() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log('✅ MongoDB connection closed');
    }
    if (redisClient) {
      await redisClient.quit();
      console.log('✅ Redis connection closed');
    }
  } catch (error) {
    console.error('❌ Error during connection closure:', error);
  }
}

// Exporting the functions
module.exports = {
  connectMongo,
  connectRedis,
  getMongoDb,
  closeConnections,
};
