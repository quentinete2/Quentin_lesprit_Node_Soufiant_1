const express = require('express');
const router = express.Router();

// Importer les middlewares de validation et d'authentification
const { validateAuthentication } = require('../midwave/auth');
const { checkPermissionMiddleware, checkMultipleRolesMiddleware } = require('../midwave/role');
// Importer les contrôleurs
const {
    getAllPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission
} = require('../service/permissionController');

// Routes des permissions (accès administrateur requis)
// Récupérer toutes les permissions - Requiert le rôle admin et la permission read_permission
router.get('/', validateAuthentication, checkMultipleRolesMiddleware('admin'), checkPermissionMiddleware('read_permission'), getAllPermissions);
// Récupérer une permission spécifique par ID - Requiert le rôle admin et la permission read_permission
router.get('/:id', validateAuthentication, checkMultipleRolesMiddleware('admin'), checkPermissionMiddleware('read_permission'), getPermissionById);
// Créer une nouvelle permission - Requiert le rôle admin et la permission create_permission
router.post('/', validateAuthentication, checkMultipleRolesMiddleware('admin'), checkPermissionMiddleware('create_permission'), createPermission);
// Mettre à jour une permission - Requiert le rôle admin et la permission update_permission
router.put('/:id', validateAuthentication, checkMultipleRolesMiddleware('admin'), checkPermissionMiddleware('update_permission'), updatePermission);
// Supprimer une permission - Requiert le rôle admin et la permission delete_permission
router.delete('/:id', validateAuthentication, checkMultipleRolesMiddleware('admin'), checkPermissionMiddleware('delete_permission'), deletePermission);
module.exports = router;
