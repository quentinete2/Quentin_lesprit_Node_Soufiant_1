const express = require('express');
const router = express.Router();

// Importer les middlewares
const { validateAuthentication } = require('../midwave/auth');
const { RolePermission, Role, Permission } = require('../models');
const { sequelize } = require('../models');

// Récupérer toutes les associations role-permission
router.get('/', validateAuthentication, async (req, res) => {
    try {
        const rolePermissions = await RolePermission.findAll({
            include: [
                { model: Role, attributes: ['id', 'name', 'description'] },
                { model: Permission, attributes: ['id', 'name', 'description'] }
            ]
        });
        res.status(200).json({
            message: "Liste de toutes les associations role-permission",
            data: rolePermissions
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des associations",
            error: error.message
        });
    }
});

// Récupérer les permissions d'un rôle spécifique
router.get('/role/:roleId', validateAuthentication, async (req, res) => {
    try {
        const rolePermissions = await RolePermission.findAll({
            where: { role_id: req.params.roleId },
            include: [{ model: Permission, attributes: ['id', 'name', 'description'] }]
        });
        if (!rolePermissions || rolePermissions.length === 0) {
            return res.status(404).json({
                message: "Aucune permission trouvée pour ce rôle"
            });
        }
        res.status(200).json({
            message: "Permissions du rôle",
            data: rolePermissions
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des permissions",
            error: error.message
        });
    }
});

// Assigner une permission à un rôle
router.post('/', validateAuthentication, async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { role_id, permission_id } = req.body;

        // Validation
        if (!role_id || !permission_id) {
            await transaction.rollback();
            return res.status(400).json({
                message: "role_id et permission_id sont requis"
            });
        }

        // Vérifier que le rôle existe
        const role = await Role.findByPk(role_id, { transaction });
        if (!role) {
            await transaction.rollback();
            return res.status(404).json({ message: "Rôle non trouvé" });
        }

        // Vérifier que la permission existe
        const permission = await Permission.findByPk(permission_id, { transaction });
        if (!permission) {
            await transaction.rollback();
            return res.status(404).json({ message: "Permission non trouvée" });
        }

        // Vérifier que l'association n'existe pas déjà
        const existing = await RolePermission.findOne({
            where: { role_id, permission_id },
            transaction
        });
        if (existing) {
            await transaction.rollback();
            return res.status(400).json({
                message: "Ce rôle a déjà cette permission"
            });
        }

        const rolePermission = await RolePermission.create({
            role_id,
            permission_id
        }, { transaction });

        await transaction.commit();
        res.status(201).json({
            message: "Permission assignée avec succès",
            data: rolePermission
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de l'assignation de la permission",
            error: error.message
        });
    }
});

// Retirer une permission d'un rôle
router.delete('/:roleId/:permissionId', validateAuthentication, async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { roleId, permissionId } = req.params;

        const rolePermission = await RolePermission.findOne({
            where: { role_id: roleId, permission_id: permissionId },
            transaction
        });

        if (!rolePermission) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Association role-permission non trouvée"
            });
        }

        await rolePermission.destroy({ transaction });
        await transaction.commit();

        res.status(200).json({
            message: "Permission retirée avec succès"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors du retrait de la permission",
            error: error.message
        });
    }
});

module.exports = router;
