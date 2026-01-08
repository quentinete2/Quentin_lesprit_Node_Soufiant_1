const express = require('express');
const router = express.Router();

// Importer les middlewares
const { validateAuthentication } = require('../midwave/auth');
const { UserRole, User, Role } = require('../models');
const { sequelize } = require('../models');

// Récupérer toutes les associations user-role
router.get('/', validateAuthentication, async (req, res) => {
    try {
        const userRoles = await UserRole.findAll({
            include: [
                { model: User, attributes: ['id', 'username', 'email'] },
                { model: Role, attributes: ['id', 'name', 'description'] }
            ]
        });
        res.status(200).json({
            message: "Liste de toutes les associations user-role",
            data: userRoles
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des associations",
            error: error.message
        });
    }
});

// Récupérer les rôles d'un utilisateur spécifique
router.get('/user/:userId', validateAuthentication, async (req, res) => {
    try {
        const userRoles = await UserRole.findAll({
            where: { user_id: req.params.userId },
            include: [{ model: Role, attributes: ['id', 'name', 'description'] }]
        });
        if (!userRoles || userRoles.length === 0) {
            return res.status(404).json({
                message: "Aucun rôle trouvé pour cet utilisateur"
            });
        }
        res.status(200).json({
            message: "Rôles de l'utilisateur",
            data: userRoles
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des rôles",
            error: error.message
        });
    }
});

// Assigner un rôle à un utilisateur
router.post('/', validateAuthentication, async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { user_id, role_id } = req.body;

        // Validation
        if (!user_id || !role_id) {
            await transaction.rollback();
            return res.status(400).json({
                message: "user_id et role_id sont requis"
            });
        }

        // Vérifier que l'utilisateur existe
        const user = await User.findByPk(user_id, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier que le rôle existe
        const role = await Role.findByPk(role_id, { transaction });
        if (!role) {
            await transaction.rollback();
            return res.status(404).json({ message: "Rôle non trouvé" });
        }

        // Vérifier que l'association n'existe pas déjà
        const existing = await UserRole.findOne({
            where: { user_id, role_id },
            transaction
        });
        if (existing) {
            await transaction.rollback();
            return res.status(400).json({
                message: "Cet utilisateur a déjà ce rôle"
            });
        }

        const userRole = await UserRole.create({
            user_id,
            role_id
        }, { transaction });

        await transaction.commit();
        res.status(201).json({
            message: "Rôle assigné avec succès",
            data: userRole
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de l'assignation du rôle",
            error: error.message
        });
    }
});

// Retirer un rôle d'un utilisateur
router.delete('/:userId/:roleId', validateAuthentication, async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { userId, roleId } = req.params;

        const userRole = await UserRole.findOne({
            where: { user_id: userId, role_id: roleId },
            transaction
        });

        if (!userRole) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Association user-role non trouvée"
            });
        }

        await userRole.destroy({ transaction });
        await transaction.commit();

        res.status(200).json({
            message: "Rôle retiré avec succès"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors du retrait du rôle",
            error: error.message
        });
    }
});

module.exports = router;
