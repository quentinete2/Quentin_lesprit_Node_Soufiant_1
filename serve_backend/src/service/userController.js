const { User, Profile, Post, PostComment, Role } = require('../models');

// USERS
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

exports.createUser = async (req, res) => {
    try {
        const { username, email, password_hash, post_id } = req.body;
        const user = await User.create({
            username,
            email,
            password_hash,
            post_id
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        await user.update(req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        await user.destroy();
        res.status(200).json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// USER ROLES
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

exports.assignRoleToUser = async (req, res) => {
    try {
        const { user_id, role_id } = req.body;
        const user = await User.findByPk(user_id);
        const role = await Role.findByPk(role_id);
        
        if (!user || !role) {
            return res.status(404).json({ message: 'Utilisateur ou rôle non trouvé' });
        }
        
        await user.addRole(role);
        res.status(201).json({ message: 'Rôle assigné à l\'utilisateur' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.removeRoleFromUser = async (req, res) => {
    try {
        const { userId, roleId } = req.params;
        const user = await User.findByPk(userId);
        const role = await Role.findByPk(roleId);
        
        if (!user || !role) {
            return res.status(404).json({ message: 'Utilisateur ou rôle non trouvé' });
        }
        
        await user.removeRole(role);
        res.status(200).json({ message: 'Rôle retiré de l\'utilisateur' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
