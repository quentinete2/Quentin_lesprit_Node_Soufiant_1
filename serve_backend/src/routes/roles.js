const express = require('express');
const router = express.Router();

// Importer les middlewares de validation et d'authentification
const { validateAuthentication } = require('../midwave/auth');
const { checkPermissionMiddleware, checkMultipleRolesMiddleware } = require('../midwave/role');
// Importer les contrôleurs
const {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} = require('../service/roleController');

// Routes des rôles (accès administrateur requis)
// Récupérer tous les rôles - Requiert le rôle admin et la permission manage_roles
router.get('/', validateAuthentication, checkMultipleRolesMiddleware('admin'), checkPermissionMiddleware('manage_roles'), getAllRoles);
// Récupérer un rôle spécifique par ID - Requiert le rôle admin et la permission manage_roles
router.get('/:id', validateAuthentication, checkMultipleRolesMiddleware('admin'), checkPermissionMiddleware('manage_roles'), getRoleById);
// Créer un nouveau rôle - Requiert le rôle admin et la permission manage_roles
router.post('/', validateAuthentication, checkMultipleRolesMiddleware('admin'), checkPermissionMiddleware('manage_roles'), createRole);
// Mettre à jour un rôle - Requiert le rôle admin et la permission manage_roles
router.put('/:id', validateAuthentication, checkMultipleRolesMiddleware('admin'), checkPermissionMiddleware('manage_roles'), updateRole);
// Supprimer un rôle - Requiert le rôle admin et la permission manage_roles
router.delete('/:id', validateAuthentication, checkMultipleRolesMiddleware('admin'), checkPermissionMiddleware('manage_roles'), deleteRole);
module.exports = router;
