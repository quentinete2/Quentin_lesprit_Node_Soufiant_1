/**
 * Jest Setup File
 * Configuration initiale pour les tests
 */

// Configuration des variables d'environnement pour les tests
process.env.NODE_ENV = 'test';
process.env.SERVER_PORT = 3001;
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = 3306;
process.env.DB_NAME = 'soufiant_test';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = '';

// Augmenter le timeout pour les tests d'intégration
jest.setTimeout(10000);

// Nettoyer les ressources après les tests
afterAll(async () => {
  // Fermer les connexions à la base de données
  const { sequelize } = require('../src/models');
  if (sequelize) {
    await sequelize.close();
  }
});
