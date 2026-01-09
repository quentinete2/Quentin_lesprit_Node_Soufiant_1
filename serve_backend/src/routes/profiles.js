const express = require('express');
const router = express.Router();

// Importer les middlewares de validation et d'authentification
const { validateAuthentication } = require('../midwave/auth');
const { validateProfileCreate, validateProfileUpdate } = require('../midwave/validateProfile');
const { checkPermissionMiddleware, checkMultipleRolesMiddleware } = require('../midwave/role');
// Importer les contrôleurs
const {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile
} = require('../service/profileController');

// Routes des profils
// Récupérer tous les profils - Requiert l'authentification
router.get('/', validateAuthentication, getAllProfiles);
// Récupérer un profil spécifique par ID - Requiert l'authentification
router.get('/:id', validateAuthentication, getProfileById);
// Créer un nouveau profil - Requiert l'authentification
router.post('/', validateAuthentication, validateProfileCreate, createProfile);
// Mettre à jour un profil - Requiert l'authentification
router.put('/:id', validateAuthentication, validateProfileUpdate, updateProfile);
// Supprimer un profil - Requiert l'authentification
router.delete('/:id', validateAuthentication, deleteProfile);

module.exports = router;
