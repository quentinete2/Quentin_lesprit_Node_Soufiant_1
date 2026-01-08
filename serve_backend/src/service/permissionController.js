const { Permission } = require('../models');
const { sequelize } = require('../models');

// Récupérer toutes les permissions avec les rôles associés
exports.getAllPermissions = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const permissions = await Permission.findAll({
            include: ['roles']
        }, { transaction });
        if (!permissions || permissions.length === 0) {
            await transaction.commit();
            return res.status(404).json({
                message: "Aucune permission trouvée"
            });
        }
        await transaction.commit();
        res.status(200).json({
            message: "Liste de toutes les permissions",
            data: permissions
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la récupération des permissions",
            error: error.message
        });
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
            return res.status(404).json({
                message: "Permission non trouvée"
            });
        }
        await transaction.commit();
        res.status(200).json({
            message: "Détail d'une permission",
            data: permission
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la récupération de la permission",
            error: error.message
        });
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
        res.status(201).json({
            message: "Permission créée avec succès",
            data: permission
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la création de la permission",
            error: error.message
        });
    }
};

// Mettre à jour une permission existante avec transaction
exports.updatePermission = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const permission = await Permission.findByPk(req.params.id, { transaction });
        if (!permission) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Permission non trouvée"
            });
        }
        await permission.update(req.body, { transaction });
        await transaction.commit();
        res.status(200).json({
            message: "Permission mise à jour avec succès",
            data: permission
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la mise à jour de la permission",
            error: error.message
        });
    }
};

// Supprimer une permission avec transaction
exports.deletePermission = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const permission = await Permission.findByPk(req.params.id, { transaction });
        if (!permission) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Permission non trouvée"
            });
        }
        await permission.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({
            message: "Permission supprimée avec succès",
            data: permission
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la suppression de la permission",
            error: error.message
        });
    }
};
