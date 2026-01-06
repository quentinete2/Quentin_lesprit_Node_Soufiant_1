const { Profile } = require('../models');

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

exports.createProfile = async (req, res) => {
    try {
        const { user_id, first_name, last_name, birthdate, phone, address } = req.body;
        const profile = await Profile.create({
            user_id,
            first_name,
            last_name,
            birthdate,
            phone,
            address
        });
        res.status(201).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const profile = await Profile.findByPk(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profil non trouvé' });
        }
        await profile.update(req.body);
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const profile = await Profile.findByPk(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profil non trouvé' });
        }
        await profile.destroy();
        res.status(200).json({ message: 'Profil supprimé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
