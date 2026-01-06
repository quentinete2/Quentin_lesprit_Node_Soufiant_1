const { Permission } = require('../models');

exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.findAll({
            include: ['roles']
        });
        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPermissionById = async (req, res) => {
    try {
        const permission = await Permission.findByPk(req.params.id, {
            include: ['roles']
        });
        if (!permission) {
            return res.status(404).json({ message: 'Permission non trouvée' });
        }
        res.status(200).json(permission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPermission = async (req, res) => {
    try {
        const { name, description } = req.body;
        const permission = await Permission.create({
            name,
            description
        });
        res.status(201).json(permission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updatePermission = async (req, res) => {
    try {
        const permission = await Permission.findByPk(req.params.id);
        if (!permission) {
            return res.status(404).json({ message: 'Permission non trouvée' });
        }
        await permission.update(req.body);
        res.status(200).json(permission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletePermission = async (req, res) => {
    try {
        const permission = await Permission.findByPk(req.params.id);
        if (!permission) {
            return res.status(404).json({ message: 'Permission non trouvée' });
        }
        await permission.destroy();
        res.status(200).json({ message: 'Permission supprimée' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
