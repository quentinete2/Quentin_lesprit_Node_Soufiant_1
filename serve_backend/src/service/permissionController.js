const { Permission } = require('../models');
const { sequelize } = require('../models');

// Contrôleur pour récupérer toutes les permissions avec les rôles associés
exports.getAllPermissions = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Récupérer toutes les permissions avec leurs rôles associés
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

// Contrôleur pour récupérer une permission spécifique par ID
exports.getPermissionById = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Chercher la permission par ID avec ses rôles associés
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

// Contrôleur pour créer une nouvelle permission avec transaction
exports.createPermission = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Extraire les données de la requête
        const { name, description } = req.body;
        // Créer la permission
        const permission = await Permission.create({
            name,
            description
        }, { transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(201).json({
            message: "Permission créée avec succès",
            data: permission
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la création de la permission",
            error: error.message
        });
    }
};

// Contrôleur pour mettre à jour une permission existante avec transaction
exports.updatePermission = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Chercher la permission par ID
        const permission = await Permission.findByPk(req.params.id, { transaction });
        if (!permission) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Permission non trouvée"
            });
        }
        // Mettre à jour la permission avec les nouvelles données
        await permission.update(req.body, { transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(200).json({
            message: "Permission mise à jour avec succès",
            data: permission
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la mise à jour de la permission",
            error: error.message
        });
    }
};

// Contrôleur pour supprimer une permission avec transaction
exports.deletePermission = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Chercher la permission par ID
        const permission = await Permission.findByPk(req.params.id, { transaction });
        if (!permission) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Permission non trouvée"
            });
        }
        // Supprimer la permission
        await permission.destroy({ transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(200).json({
            message: "Permission supprimée avec succès",
            data: permission
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la suppression de la permission",
            error: error.message
        });
    }
};
