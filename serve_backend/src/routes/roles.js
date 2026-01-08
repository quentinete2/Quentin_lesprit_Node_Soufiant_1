const express = require('express');
const router = express.Router();

// Importer les middlewares
const { validateAuthentication } = require('../midwave/auth');
const {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} = require('../service/roleController');

// Routes des rôles
router.get('/', validateAuthentication, getAllRoles);
router.get('/:id', validateAuthentication, getRoleById);
router.post('/', validateAuthentication, createRole);
router.put('/:id', validateAuthentication, updateRole);
router.delete('/:id', validateAuthentication, deleteRole);

module.exports = router;
