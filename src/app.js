// Question: Comment organiser le point d'entrée de l'application ?
// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?
const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');
//const studentRoutes = require('./routes/studentRoutes');

const app = express();

async function startServer() {
  try {
    // Initialisation des connexions aux bases de données
    console.log('Connecting to MongoDB...');
    await db.connectMongo(); // Connexion à MongoDB

    console.log('Connecting to Redis...');
    await db.connectRedis(); // Connexion à Redis
    
    // Configuration des middlewares Express
    app.use(express.json());

    // Monter les routes
    console.log('Mounting routes...');
    app.use('/api/courses', courseRoutes); // Routes pour les cours
    
    // Démarrer le serveur
    app.listen(config.port, () => {
      console.log(`✅ Server is running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Quitter en cas d'erreur critique
  }
}

// Gestion propre de l'arrêt
async function gracefulShutdown(signal) {
  console.log(`${signal} signal received. Closing application...`);
  try {
    await db.disconnectMongo(); // Fermer la connexion MongoDB
    await db.disconnectRedis(); // Fermer la connexion Redis
    console.log('✅ All connections closed. Exiting process.');
    process.exit(0); // Sortie propre
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1); // Sortie avec erreur
  }
}

// Écoute des signaux système pour un arrêt propre
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Démarrer l'application
startServer();
