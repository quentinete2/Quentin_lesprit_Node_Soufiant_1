const { Profile } = require('../models');
const { sequelize } = require('../models');

// Récupérer tous les profils avec les données de l'utilisateur associé
exports.getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.findAll({
            include: ['user']
        });
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer un profil spécifique par ID
exports.getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findByPk(req.params.id, {
            include: ['user']
        });
        if (!profile) {
            return res.status(404).json({ message: 'Profil non trouvé' });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Créer un nouveau profil avec transaction
exports.createProfile = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { user_id, first_name, last_name, birthdate, phone, address } = req.body;
        const profile = await Profile.create({
            user_id,
            first_name,
            last_name,
            birthdate,
            phone,
            address
        }, { transaction });
        await transaction.commit();
        res.status(201).json(profile);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour un profil existant avec transaction
exports.updateProfile = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const profile = await Profile.findByPk(req.params.id, { transaction });
        if (!profile) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Profil non trouvé' });
        }
        await profile.update(req.body, { transaction });
        await transaction.commit();
        res.status(200).json(profile);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un profil avec transaction
exports.deleteProfile = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const profile = await Profile.findByPk(req.params.id, { transaction });
        if (!profile) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Profil non trouvé' });
        }
        await profile.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Profil supprimé' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};
