const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur profils
const {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile
} = require('../service/profileController');

// Routes CRUD pour les profils
router.get('/', getAllProfiles);
router.get('/:id', getProfileById);
router.post('/', createProfile);
router.put('/:id', updateProfile);
router.delete('/:id', deleteProfile);

module.exports = router;
