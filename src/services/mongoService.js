// Question: Pourquoi créer des services séparés ?
// Réponse: 
const { ObjectId } = require('mongodb');
const db = require('../config/db'); // Assurez-vous que le chemin d'import est correct

async function insertOne(collectionName, document) {
  try {
    const dbInstance = db.getMongoDb();  // Utilisez la fonction getMongoDb pour obtenir l'instance DB
    const result = await dbInstance.collection(collectionName).insertOne(document);
    return result;
  } catch (error) {
    console.error('❌ Error during MongoDB insert:', error);
    throw error;
  }
}

// Recherche d'un document par ID
// Recherche d'un document par ID


// Recherche d'un document par ID
async function findOneById(collectionName, id) {
  try {
    const dbInstance = db.getMongoDb();  // Utilisez la fonction getMongoDb pour obtenir l'instance DB
    // Utilisez 'new ObjectId(id)' pour créer une instance d'ObjectId
    return await dbInstance.collection(collectionName).findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('❌ Error during MongoDB findOne:', error);
    throw error;
  }
}
// Nouvelle méthode pour récupérer les statistiques des cours
async function getCourseStats() {
  try {
    const dbInstance = db.getMongoDb();
    const totalCourses = await dbInstance.collection('courses').countDocuments();
    const averageDuration = await dbInstance.collection('courses').aggregate([
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$duration" }
        }
      }
    ]).toArray();

    return {
      totalCourses,
      averageDuration: averageDuration.length > 0 ? averageDuration[0].avgDuration : 0,
    };
  } catch (error) {
    console.error('❌ Error during MongoDB getCourseStats:', error);
    throw error;
  }
}




module.exports = {
  insertOne,
  findOneById,
  getCourseStats,

};
