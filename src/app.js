// Question: Comment organiser le point d'entrée de l'application ?
// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?

const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

async function startServer() {
  try {
    // TODO: Initialiser les connexions aux bases de données
    console.log('Connecting to MongoDB...');
    await db.connectMongo(); // Connexion à MongoDB

    console.log('Connecting to Redis...');
    await db.connectRedis(); // Connexion à Redis

    // Démarrage du serveur
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
    
    // TODO: Configurer les middlewares Express
    // TODO: Monter les routes
    // TODO: Démarrer le serveur
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Closing application...');
  try {
    await db.disconnectMongo(); // Fermer la connexion MongoDB
    await db.disconnectRedis(); // Fermer la connexion Redis
    console.log('Connections closed. Exiting process.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Gestion du signal d'interruption (CTRL+C)
process.on('SIGINT', async () => {
  console.log('SIGINT signal received. Closing application...');
  try {
    await db.disconnectMongo();
    await db.disconnectRedis();
    console.log('Connections closed. Exiting process.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();