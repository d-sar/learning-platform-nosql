// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse:Une route est utilisée pour définir les URL accessibles dans l'application et les méthodes HTTP associées (GET, POST, PUT, DELETE). Le contrôleur, en revanche, contient la logique métier qui gère les requêtes associées aux routes. En d'autres termes, une route connecte une URL à une fonction spécifique dans le contrôleur.
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse :Séparer la logique métier permet de garder le code plus organisé et maintenable. Cela facilite également le test unitaire, car les fonctions du contrôleur peuvent être testées indépendamment des routes. En outre, cela favorise la réutilisabilité, car la même logique métier peut être utilisée dans différents contextes.

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createCourse(req, res) {
  try {
    // Récupération des données du corps de la requête
    const { title, description, instructor, duration } = req.body;

    // Validation des données
    if (!title || !description || !instructor || !duration) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Création du document pour MongoDB
    const newCourse = {
      title,
      description,
      instructor,
      duration,
      createdAt: new Date(),
    };

    // Sauvegarde dans MongoDB via le service
    const result = await mongoService.insertOne('courses', newCourse);
    if (!result.insertedId) {
      return res.status(500).json({ error: 'Failed to create course in MongoDB.' });
    }

   /* // Mise en cache du cours dans Redis pour un accès rapide
    const redisKey = `course:${result.insertedId}`;
    const cachedCourse = await redisService.get(redisKey);
    
    // Vérification si le cours est déjà en cache
    if (!cachedCourse) {
      await redisService.set(redisKey, JSON.stringify(newCourse));
      console.log('✅ Course cached in Redis');
    } else {
      console.log('⚠️ Course already cached in Redis');
    }*/

    // Réponse réussie avec le nouvel ID du cours
    res.status(201).json({
      message: 'Course created successfully.',
      courseId: result.insertedId,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}


// Récupérer un cours par son ID
async function getCourse(req, res) {
  try {
    const { id } = req.params;

    // Vérifier si l'ID est au bon format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    // Récupérer le cours avec l'ID validé
    const course = await mongoService.findOneById('courses', id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Réponse réussie avec les détails du cours
    res.status(200).json(course);
  } catch (error) {
    console.error('Error retrieving course:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
}

// Récupérer les statistiques des cours
async function getCourseStats(req, res) {
  try {
    const stats = await mongoService.getCourseStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error retrieving course statistics:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
}

// Export des contrôleurs
module.exports = {
  createCourse,
  getCourse,
  getCourseStats,

};
