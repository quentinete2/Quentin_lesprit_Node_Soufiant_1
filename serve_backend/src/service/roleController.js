const { Role, Permission } = require('../models');

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

exports.createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const role = await Role.create({
            name,
            description
        });
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        await role.update(req.body);
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        await role.destroy();
        res.status(200).json({ message: 'Rôle supprimé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ROLE PERMISSIONS
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

exports.assignPermissionToRole = async (req, res) => {
    try {
        const { role_id, permission_id } = req.body;
        const role = await Role.findByPk(role_id);
        const permission = await Permission.findByPk(permission_id);
        
        if (!role || !permission) {
            return res.status(404).json({ message: 'Rôle ou permission non trouvé' });
        }
        
        await role.addPermission(permission);
        res.status(201).json({ message: 'Permission assignée au rôle' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.removePermissionFromRole = async (req, res) => {
    try {
        const { roleId, permissionId } = req.params;
        const role = await Role.findByPk(roleId);
        const permission = await Permission.findByPk(permissionId);
        
        if (!role || !permission) {
            return res.status(404).json({ message: 'Rôle ou permission non trouvé' });
        }
        
        await role.removePermission(permission);
        res.status(200).json({ message: 'Permission retirée du rôle' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
