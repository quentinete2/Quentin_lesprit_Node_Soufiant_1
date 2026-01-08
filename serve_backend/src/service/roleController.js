const { Role, Permission } = require('../models');
const { sequelize } = require('../models');

// CRUD RÔLES
// Récupérer tous les rôles avec leurs permissions
exports.getAllRoles = async (req, res) => {
    try {
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

// Récupérer un rôle spécifique par ID avec ses permissions et utilisateurs
exports.getRoleById = async (req, res) => {
    try {
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

// Créer un nouveau rôle avec transaction
exports.createRole = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, description } = req.body;
        const role = await Role.create({
            name,
            description
        }, { transaction });
        await transaction.commit();
        res.status(201).json({
            message: "Rôle créé avec succès",
            data: role
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la création du rôle",
            error: error.message
        });
    }
};

// Mettre à jour un rôle existant avec transaction
exports.updateRole = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const role = await Role.findByPk(req.params.id, { transaction });
        if (!role) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Rôle non trouvé"
            });
        }
        await role.update(req.body, { transaction });
        await transaction.commit();
        res.status(200).json({
            message: "Rôle mis à jour avec succès",
            data: role
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la mise à jour du rôle",
            error: error.message
        });
    }
};

// Supprimer un rôle avec transaction
exports.deleteRole = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const role = await Role.findByPk(req.params.id, { transaction });
        if (!role) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Rôle non trouvé"
            });
        }
        await role.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({
            message: "Rôle supprimé avec succès",
            data: role
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la suppression du rôle",
            error: error.message
        });
    }
};

// GESTION DES PERMISSIONS POUR UN RÔLE
// Récupérer toutes les permissions d'un rôle
exports.getRolePermissions = async (req, res) => {
    try {
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

// Assigner une permission à un rôle avec transaction
exports.assignPermissionToRole = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { role_id, permission_id } = req.body;
        const role = await Role.findByPk(role_id, { transaction });
        const permission = await Permission.findByPk(permission_id, { transaction });
        
        if (!role || !permission) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Rôle ou permission non trouvé"
            });
        }
        
        await role.addPermission(permission, { transaction });
        await transaction.commit();
        res.status(201).json({
            message: "Permission assignée au rôle avec succès"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de l'assignation de la permission",
            error: error.message
        });
    }
};

// Retirer une permission d'un rôle avec transaction
exports.removePermissionFromRole = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { roleId, permissionId } = req.params;
        const role = await Role.findByPk(roleId, { transaction });
        const permission = await Permission.findByPk(permissionId, { transaction });
        
        if (!role || !permission) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Rôle ou permission non trouvé"
            });
        }
        
        await role.removePermission(permission, { transaction });
        await transaction.commit();
        res.status(200).json({
            message: "Permission retirée du rôle avec succès"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors du retrait de la permission",
            error: error.message
        });
    }
};
