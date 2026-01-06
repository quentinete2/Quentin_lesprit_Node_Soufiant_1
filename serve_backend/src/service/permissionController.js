const { Permission } = require('../models');
const { sequelize } = require('../models');

// Récupérer toutes les permissions avec les rôles associés
exports.getAllPermissions = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const permissions = await Permission.findAll({
            include: ['roles']
        }, { transaction });
        await transaction.commit();
        res.status(200).json(permissions);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};

// Récupérer une permission spécifique par ID
exports.getPermissionById = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const permission = await Permission.findByPk(req.params.id, {
            include: ['roles']
        }, { transaction });
        if (!permission) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Permission non trouvée' });
        }
        await transaction.commit();
        res.status(200).json(permission);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};

// Créer une nouvelle permission avec transaction
exports.createPermission = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, description } = req.body;
        const permission = await Permission.create({
            name,
            description
        }, { transaction });
        await transaction.commit();
        res.status(201).json(permission);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour une permission existante avec transaction
exports.updatePermission = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const permission = await Permission.findByPk(req.params.id, { transaction });
        if (!permission) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Permission non trouvée' });
        }
        await permission.update(req.body, { transaction });
        await transaction.commit();
        res.status(200).json(permission);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Supprimer une permission avec transaction
exports.deletePermission = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const permission = await Permission.findByPk(req.params.id, { transaction });
        if (!permission) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Permission non trouvée' });
        }
        await permission.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Permission supprimée' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};
