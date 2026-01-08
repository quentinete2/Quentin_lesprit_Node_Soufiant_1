const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Profile, Post, PostComment, Role } = require('../models');
const { sequelize } = require('../models');
const { mailer } = require('../utils/mailer');
require('dotenv').config();

const register = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { username, email, password } = req.body;
        const hashedpassword = await bcrypt.hash(password, parseInt(process.env.SALT));
        const user = await User.create({
            username,
            email,
            password: hashedpassword
        }, { transaction });

        try {
            const info = await mailer( 
                process.env.ADMIN_EMAIL,
                "Nouveau utilisateur créé",
                `Un nouvel utilisateur a été créé : ${username} (${email})`,
                `<p>Un nouvel utilisateur a été créé :</p><ul><li>Nom d'utilisateur : ${username}</li><li>Email : ${email}</li></ul>`
            );
            console.log("Email envoyé:", info);
        } catch (emailError) {
            console.error("Erreur lors de l'envoi du mail:", emailError.message);
        };
        await transaction.commit();
        return res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: user.clean()
        })
    } catch(error) {
        await transaction.rollback();
        const errormsg = (error.name === 'SequelizeDatabaseError') ? error.parent.sqlMessage : error;
        return res.status(400).json({
            message: "Erreur lors de la création de l'utilisateur",
            error: errormsg
        })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            where: { username }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) return res.status(401).json({ message: 'Unauthorized !'});

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

        user.token = token;
        await user.save();

        return res.status(200).json({
            user: user.clean(),
            token
        })
    } catch(error) {
        console.error('Login error:', error);
        return res.status(400).json({
            message: "Erreur lors de l'authentification",
            error: error.message
        })
    }
}

const logout = async (req, res) => {
    try {
        // Le token a déjà été validé par le middleware validateAuthentication
        // et l'utilisateur est disponible dans req.user
        const user = req.user;
        
        user.token = null;
        await user.save();
        
        res.status(200).json({ 
            message: 'Logout successful!' 
        });
    } catch(error) {
        console.error('Logout error:', error);
        return res.status(400).json({
            message: "Erreur lors de la déconnexion",
            error: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.params.id || req.user.id;
        const user = await User.findByPk(userId);
        
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Utilisateur non trouvé"
            });
        }

        // Delete associated data first (due to foreign keys)
        await PostComment.destroy({ where: { user_id: userId }, transaction });
        await Post.destroy({ where: { user_id: userId }, transaction });
        await Profile.destroy({ where: { user_id: userId }, transaction });

        // Delete user
        await user.destroy({ transaction });

        try {
            const info = await mailer(
                process.env.ADMIN_EMAIL,
                "Utilisateur supprimé",
                `L'utilisateur ${user.username} (${user.email}) a été supprimé.`,
                `<p>L'utilisateur suivant a été supprimé :</p><ul><li>Nom d'utilisateur : ${user.username}</li><li>Email : ${user.email}</li></ul>`
            );
            console.log("Email envoyé:", info);
        } catch (emailError) {
            console.error("Erreur lors de l'envoi du mail:", emailError.message);
        }
        
        await transaction.commit();
        res.status(200).json({
            message: "Utilisateur supprimé avec succès"
        });
    } catch (error) {
        await transaction.rollback();
        const errorMsg = (error.name === 'SequelizeDatabaseError') ? error.parent.sqlMessage : error.message;
        res.status(500).json({
            message: "Erreur lors de la suppression de l'utilisateur",
            error: errorMsg
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [
                {
                    model: Profile,
                    as: 'profile',
                    attributes: ['first_name', 'last_name', 'bio', 'phone', 'address']
                },
                {
                    model: Role,
                    as: 'roles',
                    attributes: ['id', 'name', 'description'],
                    through: { attributes: [] }
                }
            ],
            attributes: { exclude: ['password', 'token'] }
        });

        res.status(200).json({
            message: "Utilisateurs récupérés avec succès",
            count: users.length,
            users: users.map(user => user.clean ? user.clean() : user)
        });
    } catch (error) {
        const errorMsg = (error.name === 'SequelizeDatabaseError') ? error.parent.sqlMessage : error.message;
        res.status(500).json({
            message: "Erreur lors de la récupération des utilisateurs",
            error: errorMsg
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [
                {
                    model: Profile,
                    as: 'profile',
                    attributes: ['first_name', 'last_name', 'bio', 'phone', 'address', 'birthdate']
                },
                {
                    model: Role,
                    as: 'roles',
                    attributes: ['id', 'name', 'description'],
                    through: { attributes: [] }
                }
            ],
            attributes: { exclude: ['password', 'token'] }
        });

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur non trouvé"
            });
        }

        res.status(200).json({
            message: "Utilisateur récupéré avec succès",
            user: user.clean ? user.clean() : user
        });
    } catch (error) {
        const errorMsg = (error.name === 'SequelizeDatabaseError') ? error.parent.sqlMessage : error.message;
        res.status(500).json({
            message: "Erreur lors de la récupération de l'utilisateur",
            error: errorMsg
        });
    }
};



module.exports = {
    register,
    login,
    logout,
    deleteUser,
    getAllUsers,
    getUserById
}