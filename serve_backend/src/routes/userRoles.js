const express = require('express');
const router = express.Router();

// Importer les fonctions d'assignation des rôles
const { assignRoleToUser } = require('../service/userController');
const { assignPermissionToRole } = require('../service/roleController');

// Route pour assigner un rôle à un utilisateur
router.post('/', assignRoleToUser);

module.exports = router;
