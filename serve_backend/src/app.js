// Charger les variables d'environnement
require('dotenv').config();

const express = require('express');
const { sequelize } = require('./models');
const app = express();
const initRoutes = require('./routes');
const PORT = process.env.SERVER_PORT;

// Middleware pour parser le JSON
app.use(express.json());

// Initialiser les routes de l'API
initRoutes(app);

// Démarrer le serveur Express uniquement en mode non-test
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Serveur running on port ${PORT}`);
    });
}

module.exports = app;

