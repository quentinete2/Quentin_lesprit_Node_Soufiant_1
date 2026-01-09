const { Role, Permission } = require('../models');
const { sequelize } = require('../models');

// OPÉRATIONS CRUD POUR LES RÔLES
// Contrôleur pour récupérer tous les rôles avec leurs permissions
exports.getAllRoles = async (req, res) => {
    try {
        // Récupérer tous les rôles avec leurs permissions associées
        const roles = await Role.findAll({
            include: ['permissions']
        });
        if (!roles || roles.length === 0) {
            return res.status(404).json({
                message: "Aucun rôle trouvé"
            });
        }
        res.status(200).json({
            message: "Liste de tous les rôles",
            data: roles
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des rôles",
            error: error.message
        });
    }
};

// Contrôleur pour récupérer un rôle spécifique par ID avec ses permissions et utilisateurs
exports.getRoleById = async (req, res) => {
    try {
        // Chercher le rôle par ID avec ses permissions et utilisateurs
        const role = await Role.findByPk(req.params.id, {
            include: ['permissions', 'users']
        });
        if (!role) {
            return res.status(404).json({
                message: "Rôle non trouvé"
            });
        }
        res.status(200).json({
            message: "Détail d'un rôle",
            data: role
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération du rôle",
            error: error.message
        });
    }
};

// Contrôleur pour créer un nouveau rôle avec transaction
exports.createRole = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Extraire les données de la requête
        const { name, description } = req.body;
        // Créer le rôle
        const role = await Role.create({
            name,
            description
        }, { transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(201).json({
            message: "Rôle créé avec succès",
            data: role
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la création du rôle",
            error: error.message
        });
    }
};

// Contrôleur pour mettre à jour un rôle existant avec transaction
exports.updateRole = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Chercher le rôle par ID
        const role = await Role.findByPk(req.params.id, { transaction });
        if (!role) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Rôle non trouvé"
            });
        }
        // Mettre à jour le rôle avec les nouvelles données
        await role.update(req.body, { transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(200).json({
            message: "Rôle mis à jour avec succès",
            data: role
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la mise à jour du rôle",
            error: error.message
        });
    }
};

// Contrôleur pour supprimer un rôle avec transaction
exports.deleteRole = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Chercher le rôle par ID
        const role = await Role.findByPk(req.params.id, { transaction });
        if (!role) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Rôle non trouvé"
            });
        }
        // Supprimer le rôle
        await role.destroy({ transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(200).json({
            message: "Rôle supprimé avec succès",
            data: role
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la suppression du rôle",
            error: error.message
        });
    }
};

// OPÉRATIONS DE GESTION DES PERMISSIONS POUR UN RÔLE
// Contrôleur pour récupérer toutes les permissions d'un rôle
exports.getRolePermissions = async (req, res) => {
    try {
        // Chercher le rôle avec ses permissions
        const role = await Role.findByPk(req.params.id, {
            include: ['permissions']
        });
        if (!role) {
            return res.status(404).json({
                message: "Rôle non trouvé"
            });
        }
        if (!role.permissions || role.permissions.length === 0) {
            return res.status(404).json({
                message: "Aucune permission trouvée pour ce rôle"
            });
        }
        res.status(200).json({
            message: "Liste des permissions du rôle",
            data: role.permissions
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des permissions",
            error: error.message
        });
    }
};

// Contrôleur pour assigner une permission à un rôle avec transaction
exports.assignPermissionToRole = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Extraire les IDs du rôle et de la permission
        const { role_id, permission_id } = req.body;
        // Chercher le rôle et la permission
        const role = await Role.findByPk(role_id, { transaction });
        const permission = await Permission.findByPk(permission_id, { transaction });
        
        if (!role || !permission) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Rôle ou permission non trouvé"
            });
        }
        
        // Assigner la permission au rôle
        await role.addPermission(permission, { transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(201).json({
            message: "Permission assignée au rôle avec succès"
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de l'assignation de la permission",
            error: error.message
        });
    }
};

// Contrôleur pour retirer une permission d'un rôle avec transaction
exports.removePermissionFromRole = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Extraire les IDs du rôle et de la permission
        const { roleId, permissionId } = req.params;
        // Chercher le rôle et la permission
        const role = await Role.findByPk(roleId, { transaction });
        const permission = await Permission.findByPk(permissionId, { transaction });
        
        if (!role || !permission) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Rôle ou permission non trouvé"
            });
        }
        
        // Retirer la permission du rôle
        await role.removePermission(permission, { transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(200).json({
            message: "Permission retirée du rôle avec succès"
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors du retrait de la permission",
            error: error.message
        });
    }
};
