const express = require('express');
const router = express.Router();

// Importer le middleware de validation et les fonctions du contrôleur
const validateUtilisateur = require('../midwave/validationutilisateur');
const {
    getAllUtilisateurs,
    getUtilisateurById,
    createUtilisateur,
    updateUtilisateur,
    deleteUtilisateur
} = require('../service/utilisateurController');

// Routes CRUD pour les utilisateurs avec validation
router.get('/', getAllUtilisateurs);
router.get('/:id', getUtilisateurById);
router.post('/', validateUtilisateur, createUtilisateur);
router.put('/:id', validateUtilisateur, updateUtilisateur);
router.delete('/:id', deleteUtilisateur);

module.exports = router;
