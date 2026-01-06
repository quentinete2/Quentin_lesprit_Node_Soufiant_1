const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur permissions
const {
    getAllPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission
} = require('../service/permissionController');

// Routes CRUD pour les permissions
router.get('/', getAllPermissions);
router.get('/:id', getPermissionById);
router.post('/', createPermission);
router.put('/:id', updatePermission);
router.delete('/:id', deletePermission);

module.exports = router;
