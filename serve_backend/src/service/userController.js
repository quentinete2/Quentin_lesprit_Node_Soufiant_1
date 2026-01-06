const { User, Profile, Post, PostComment, Role } = require('../models');
const { sequelize } = require('../models');

// CRUD UTILISATEURS
// Récupérer tous les utilisateurs avec leurs profils et rôles
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: ['profile', 'roles']
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer un utilisateur spécifique par ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: ['profile', 'comments', 'roles']
        });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Créer un nouvel utilisateur avec transaction
exports.createUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { username, email, password_hash, post_id } = req.body;
        const user = await User.create({
            username,
            email,
            password_hash,
            post_id
        }, { transaction });
        await transaction.commit();
        res.status(201).json(user);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour un utilisateur existant avec transaction
exports.updateUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const user = await User.findByPk(req.params.id, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        await user.update(req.body, { transaction });
        await transaction.commit();
        res.status(200).json(user);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un utilisateur avec transaction (en cascade)
exports.deleteUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const user = await User.findByPk(req.params.id, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        await user.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};

// GESTION DES RÔLES POUR UN UTILISATEUR
// Récupérer tous les rôles d'un utilisateur
exports.getUserRoles = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: ['roles']
        });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json(user.roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Assigner un rôle à un utilisateur avec transaction
exports.assignRoleToUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { user_id, role_id } = req.body;
        const user = await User.findByPk(user_id, { transaction });
        const role = await Role.findByPk(role_id, { transaction });
        
        if (!user || !role) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Utilisateur ou rôle non trouvé' });
        }
        
        await user.addRole(role, { transaction });
        await transaction.commit();
        res.status(201).json({ message: 'Rôle assigné à l\'utilisateur' });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Retirer un rôle d'un utilisateur avec transaction
exports.removeRoleFromUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { userId, roleId } = req.params;
        const user = await User.findByPk(userId, { transaction });
        const role = await Role.findByPk(roleId, { transaction });
        
        if (!user || !role) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Utilisateur ou rôle non trouvé' });
        }
        
        await user.removeRole(role, { transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Rôle retiré de l\'utilisateur' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};
