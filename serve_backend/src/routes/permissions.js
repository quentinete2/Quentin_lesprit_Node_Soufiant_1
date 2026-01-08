const express = require('express');
const router = express.Router();

// Importer les middlewares
const { validateAuthentication } = require('../midwave/auth');
const {
    getAllPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission
} = require('../service/permissionController');

// Routes des permissions
router.get('/', validateAuthentication, getAllPermissions);
router.get('/:id', validateAuthentication, getPermissionById);
router.post('/', validateAuthentication, createPermission);
router.put('/:id', validateAuthentication, updatePermission);
router.delete('/:id', validateAuthentication, deletePermission);

module.exports = router;
