const { connectMongo, connectRedis, getMongoDb, getRedisClient, closeConnections } = require('./db');

(async () => {
  try {
    console.log('🔄 Tentative de connexion à MongoDB...');
    const mongoDb = await connectMongo();
    console.log('✅ Connexion à MongoDB réussie !');

    // Test de MongoDB : Lister les collections
    const collections = await mongoDb.listCollections().toArray();
    console.log('📂 Collections MongoDB existantes :', collections.map(c => c.name));

    console.log('🔄 Tentative de connexion à Redis...');
    const redisClient = await connectRedis();
    console.log('✅ Connexion à Redis réussie !');

    // Test de Redis : Enregistrer et récupérer une clé
    await redisClient.set('test-key', 'Hello, Redis!');
    const value = await redisClient.get('test-key');
    console.log('🔑 Valeur testée dans Redis :', value);

    console.log('✅ Tests des connexions réussis !');
  } catch (error) {
    console.error('❌ Une erreur s\'est produite pendant les tests :', error);
  } finally {
    console.log('🛑 Fermeture des connexions...');
    await closeConnections();
    console.log('✅ Connexions fermées proprement.');
  }
})();
