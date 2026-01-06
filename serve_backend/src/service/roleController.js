const { Role, Permission } = require('../models');
const { sequelize } = require('../models');

// CRUD RÔLES
// Récupérer tous les rôles avec leurs permissions
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll({
            include: ['permissions']
        });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer un rôle spécifique par ID avec ses permissions et utilisateurs
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id, {
            include: ['permissions', 'users']
        });
        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(201).json(role);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour un rôle existant avec transaction
exports.updateRole = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const role = await Role.findByPk(req.params.id, { transaction });
        if (!role) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        await role.update(req.body, { transaction });
        await transaction.commit();
        res.status(200).json(role);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un rôle avec transaction
exports.deleteRole = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const role = await Role.findByPk(req.params.id, { transaction });
        if (!role) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        await role.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Rôle supprimé' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
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
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        res.status(200).json(role.permissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
            return res.status(404).json({ message: 'Rôle ou permission non trouvé' });
        }
        
        await role.addPermission(permission, { transaction });
        await transaction.commit();
        res.status(201).json({ message: 'Permission assignée au rôle' });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
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
            return res.status(404).json({ message: 'Rôle ou permission non trouvé' });
        }
        
        await role.removePermission(permission, { transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Permission retirée du rôle' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};
