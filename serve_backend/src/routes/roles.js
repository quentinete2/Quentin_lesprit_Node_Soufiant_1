const express = require('express');
const router = express.Router();

// Importer les fonctions du contrôleur rôles
const {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    getRolePermissions,
    assignPermissionToRole,
    removePermissionFromRole
} = require('../service/roleController');

// Routes CRUD pour les rôles
router.get('/', getAllRoles);
router.get('/:id', getRoleById);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

// Routes pour gérer les permissions d'un rôle
router.get('/:id/permissions', getRolePermissions);
router.delete('/:roleId/permissions/:permissionId', removePermissionFromRole);

module.exports = router;
