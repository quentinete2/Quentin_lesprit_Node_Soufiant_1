const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur utilisateur
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserRoles,
    assignRoleToUser,
    removeRoleFromUser
} = require('../service/userController');

// Routes CRUD pour les utilisateurs
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Routes pour gérer les rôles d'un utilisateur
router.get('/:id/roles', getUserRoles);
router.delete('/:userId/roles/:roleId', removeRoleFromUser);

module.exports = router;
