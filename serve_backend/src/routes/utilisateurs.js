const express = require('express');
const router = express.Router();
const validateUtilisateur = require('../midwave/validationutilisateur');
const {
    getAllUtilisateurs,
    getUtilisateurById,
    createUtilisateur,
    updateUtilisateur,
    deleteUtilisateur
} = require('../service/utilisateurController');

router.get('/', getAllUtilisateurs);
router.get('/:id', getUtilisateurById);
router.post('/', validateUtilisateur, createUtilisateur);
router.put('/:id', validateUtilisateur, updateUtilisateur);
router.delete('/:id', deleteUtilisateur);

module.exports = router;
