const express = require('express');
const router = express.Router();

// Importer les middlewares
const { validateAuthentication } = require('../midwave/auth');
const { validateProfileCreate, validateProfileUpdate } = require('../midwave/validateProfile');
const {
    getAllProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile
} = require('../service/profileController');

// Routes des profils
router.get('/', validateAuthentication, getAllProfiles);
router.get('/:id', validateAuthentication, getProfileById);
router.post('/', validateAuthentication, validateProfileCreate, createProfile);
router.put('/:id', validateAuthentication, validateProfileUpdate, updateProfile);
router.delete('/:id', validateAuthentication, deleteProfile);

module.exports = router;
