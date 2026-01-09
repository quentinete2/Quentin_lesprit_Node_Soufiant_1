// Charger les variables d'environnement
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../../config/config.js');

const db = {};
const basename = path.basename(__filename);

// Récupérer la configuration selon l'environnement
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialiser la connexion Sequelize à MariaDB
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect
    }
);

// Charger tous les modèles du répertoire
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Exécuter les associations entre modèles
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;