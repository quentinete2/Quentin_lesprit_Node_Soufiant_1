const { checkSchema, validationResult } = require('express-validator');
const { User, Role, Permission } = require('../models');

/**
 * Fonction pour vérifier si un utilisateur a un rôle spécifique
@param {number} userId
@param {string} roleName
@returns {Promise<boolean>}
 */
const checkUserRole = async (userId, roleName) => {
    try {
        const user = await User.findByPk(userId, {
            include: [{
                model: Role,
                as: 'roles',
                through: { attributes: [] }
            }]
        });
        if (!user) {
            return false;
        }
        return user.roles.some(role => role.name === roleName);
    } catch (error) {
        console.error('Erreur lors de la vérification du rôle:', error);
        return false;
    }
};

/**
 * Middleware pour vérifier si un utilisateur a un rôle spécifique
@param {string} requiredRole
@returns {Function}
 */
const checkRoleMiddleware = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Utilisateur non authentifié' });
            }
            const hasRole = await checkUserRole(userId, requiredRole);
            if (!hasRole) {
                return res.status(403).json({ message: `Accès refusé. Rôle requis: ${requiredRole}` });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la vérification du rôle' });
        }
    };
};

/**
 * Fonction pour vérifier si un utilisateur a une permission spécifique
 * @param {number} userId
 * @param {string} permissionName
 * @returns {Promise<boolean>}
 */
const checkUserPermission = async (userId, permissionName) => {
    try {
        const user = await User.findByPk(userId, {
            include: [{
                model: Role,
                as: 'roles',
                include: [{
                    model: Permission,
                    as: 'permissions',
                    through: { attributes: [] }
                }],
                through: { attributes: [] }
            }]
        });
        if (!user) {
            return false;
        }
        // Vérifier si l'utilisateur a au moins une permission avec ce nom
        return user.roles.some(role =>
            role.permissions.some(permission => permission.name === permissionName)
        );
    } catch (error) {
        console.error('Erreur lors de la vérification de la permission:', error);
        return false;
    }
};

/**
 * Middleware pour vérifier si un utilisateur a une permission spécifique
 * @param {string} requiredPermission
 * @returns {Function}
 */
const checkPermissionMiddleware = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Utilisateur non authentifié' });
            }
            const hasPermission = await checkUserPermission(userId, requiredPermission);
            if (!hasPermission) {
                return res.status(403).json({ message: `Accès refusé. Permission requise: ${requiredPermission}` });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la vérification de la permission' });
        }
    };
};

/**
 * Middleware pour vérifier si un utilisateur a au moins un des rôles requis
 * @param {string|string[]} requiredRoles - Un rôle (string) ou plusieurs rôles (array)
 * @returns {Function}
 */
const checkMultipleRolesMiddleware = (requiredRoles) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Utilisateur non authentifié' });
            }
            
            // Convertir string en array si nécessaire
            const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
            
            const user = await User.findByPk(userId, {
                include: [{
                    model: Role,
                    as: 'roles',
                    through: { attributes: [] }
                }]
            });
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' });
            }
            
            // Vérifier si l'utilisateur a au moins un des rôles requis
            const hasRequiredRole = user.roles.some(role =>
                rolesArray.includes(role.name)
            );
            if (!hasRequiredRole) {
                return res.status(403).json({
                    message: `Accès refusé. Rôles requis: ${rolesArray.join(', ')}`
                });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la vérification du rôle' });
        }
    };
};

/**
 * Middleware pour vérifier si un utilisateur a au moins une des permissions requises
 * @param {string|string[]} requiredPermissions - Une permission (string) ou plusieurs (array)
 * @returns {Function}
 */
const checkMultiplePermissionsMiddleware = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Utilisateur non authentifié' });
            }
            
            // Convertir string en array si nécessaire
            const permissionsArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
            
            const user = await User.findByPk(userId, {
                include: [{
                    model: Role,
                    as: 'roles',
                    include: [{
                        model: Permission,
                        as: 'permissions',
                        through: { attributes: [] }
                    }],
                    through: { attributes: [] }
                }]
            });
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' });
            }
            
            // Vérifier si l'utilisateur a au moins une des permissions requises
            const hasRequiredPermission = user.roles.some(role =>
                role.permissions.some(permission =>
                    permissionsArray.includes(permission.name)
                )
            );
            if (!hasRequiredPermission) {
                return res.status(403).json({
                    message: `Accès refusé. Permissions requises: ${permissionsArray.join(', ')}`
                });
            }
            next();
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la vérification de la permission' });
        }
    };
};

module.exports = {
    checkUserRole,
    checkRoleMiddleware,
    checkUserPermission,
    checkPermissionMiddleware,
    checkMultipleRolesMiddleware,
    checkMultiplePermissionsMiddleware
};