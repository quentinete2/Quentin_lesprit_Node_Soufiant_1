const express = require('express');
const { getAllUsers, getUserById, deleteUser } = require('../service/userController');
const { validateAuthentication } = require('../midwave/auth');
const { checkPermissionMiddleware, checkMultipleRolesMiddleware } = require('../midwave/role');

const router = express.Router();

// Récupérer tous les utilisateurs - Requiert le rôle admin et la permission manage_users
router.get('/', validateAuthentication, checkMultipleRolesMiddleware('admin'), checkPermissionMiddleware('manage_users'), getAllUsers);

// Récupérer un utilisateur par ID - Requiert l'authentification (les utilisateurs ne peuvent accéder qu'à leur propre profil)
router.get('/:id', validateAuthentication, getUserById);

// Supprimer un utilisateur par ID - Requiert le rôle admin et la permission manage_users
router.delete('/:id', validateAuthentication, checkMultipleRolesMiddleware('admin'), checkPermissionMiddleware('manage_users'), deleteUser);

module.exports = router;
