const express = require('express');
const router = express.Router();

// Importer la fonction d'assignation des permissions aux rôles
const { assignPermissionToRole } = require('../service/roleController');

// Route pour assigner une permission à un rôle
router.post('/', assignPermissionToRole);

module.exports = router;
