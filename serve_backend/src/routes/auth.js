const express = require('express');
const router = express.Router();
const { dbInstance, User } = require("../models");
require('dotenv').config();

// Importer les middlewares de validation et d'authentification
const { validateRegister, validateLogin } = require('../midwave/validationutilisateur');
const { validateAuthentication } = require('../midwave/auth');
const {
    register,
    login,
    logout
} = require('../service/userController');

// Routes d'authentification (sans protection)
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', validateAuthentication, logout);

module.exports = router;