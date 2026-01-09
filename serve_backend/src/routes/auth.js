const express = require('express');
const router = express.Router();
const { dbInstance, User } = require("../models");
require('dotenv').config();

// Importer les middlewares de validation et d'authentification
const { validateRegister, validateLogin } = require('../midwave/validationutilisateur');
const { validateAuthentication } = require('../midwave/auth');
const { checkPermissionMiddleware, checkMultipleRolesMiddleware } = require('../midwave/role');
const {
    register,
    login,
    logout
} = require('../service/userController');

// Routes d'authentification (sans protection)
// Route pour l'enregistrement d'un nouvel utilisateur
router.post('/register', validateRegister, register);
// Route pour la connexion d'un utilisateur
router.post('/login', validateLogin, login);
// Route pour la déconnexion (requiert l'authentification)
router.post('/logout', validateAuthentication, logout);

module.exports = router;