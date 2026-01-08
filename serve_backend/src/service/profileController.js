const { Profile } = require('../models');
const { sequelize } = require('../models');

// Récupérer tous les profils avec les données de l'utilisateur associé
exports.getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.findAll({
            include: ['user']
        });
        if (!profiles || profiles.length === 0) {
            return res.status(404).json({
                message: "Aucun profil trouvé"
            });
        }
        res.status(200).json({
            message: "Liste de tous les profils",
            data: profiles
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des profils",
            error: error.message
        });
    }
};

// Récupérer un profil spécifique par ID
exports.getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findByPk(req.params.id, {
            include: ['user']
        });
        if (!profile) {
            return res.status(404).json({
                message: "Profil non trouvé"
            });
        }
        res.status(200).json({
            message: "Détail d'un profil",
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération du profil",
            error: error.message
        });
    }
};

// Créer un nouveau profil avec transaction
exports.createProfile = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { user_id, first_name, last_name, birthdate, phone, address, bio } = req.body;
        const profile = await Profile.create({
            user_id,
            first_name,
            last_name,
            birthdate,
            phone,
            address,
            bio
        }, { transaction });
        await transaction.commit();
        res.status(201).json({
            message: "Profil créé avec succès",
            data: profile
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la création du profil",
            error: error.message
        });
    }
};

// Mettre à jour un profil existant avec transaction
exports.updateProfile = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const profile = await Profile.findByPk(req.params.id, { transaction });
        if (!profile) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Profil non trouvé"
            });
        }
        await profile.update(req.body, { transaction });
        await transaction.commit();
        res.status(200).json({
            message: "Profil mis à jour avec succès",
            data: profile
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la mise à jour du profil",
            error: error.message
        });
    }
};

// Supprimer un profil avec transaction
exports.deleteProfile = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const profile = await Profile.findByPk(req.params.id, { transaction });
        if (!profile) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Profil non trouvé"
            });
        }
        await profile.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({
            message: "Profil supprimé avec succès",
            data: profile
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la suppression du profil",
            error: error.message
        });
    }
};
