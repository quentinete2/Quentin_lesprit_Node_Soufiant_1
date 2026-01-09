const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Profile, Post, PostComment, Role } = require('../models');
const { sequelize } = require('../models');
const { mailer } = require('../utils/mailer');
require('dotenv').config();

// Contrôleur pour créer un nouvel utilisateur avec hachage du mot de passe
const register = async (req, res) => {
    // Démarrer une transaction pour assurer la cohérence des données
    const transaction = await sequelize.transaction();
    try {
        // Extraire les données de la requête
        const { username, email, password } = req.body;
        // Hasher le mot de passe avec bcrypt
        const hashedpassword = await bcrypt.hash(password, parseInt(process.env.SALT));
        // Créer l'utilisateur dans la base de données
        const user = await User.create({
            username,
            email,
            password: hashedpassword
        }, { transaction });

        // Envoyer un email au l'administrateur pour notifier la création
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
        // Confirmer la transaction
        await transaction.commit();
        return res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: user.clean()
        })
    } catch(error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        const errormsg = (error.name === 'SequelizeDatabaseError') ? error.parent.sqlMessage : error;
        return res.status(400).json({
            message: "Erreur lors de la création de l'utilisateur",
            error: errormsg
        })
    }
}

// Contrôleur pour connecter un utilisateur
const login = async (req, res) => {
    try {
        // Extraire les données de la requête
        const { username, password } = req.body;

        // Chercher l'utilisateur par nom d'utilisateur
        const user = await User.findOne({
            where: { username }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Vérifier que le mot de passe est correct
        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) return res.status(401).json({ message: 'Unauthorized !'});

        // Générer un JWT valide pendant 1 heure
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // Sauvegarder le token dans la base de données
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

// Contrôleur pour déconnecter un utilisateur
const logout = async (req, res) => {
    try {
        // Le token a déjà été validé par le middleware validateAuthentication
        // et l'utilisateur est disponible dans req.user
        const user = req.user;
        
        // Supprimer le token pour invalider la session
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

// Contrôleur pour supprimer un utilisateur avec ses données associées
const deleteUser = async (req, res) => {
    // Démarrer une transaction pour supprimer en cascade les données associées
    const transaction = await sequelize.transaction();
    try {
        // Récupérer l'ID de l'utilisateur à supprimer (par paramètre ou de l'utilisateur connecté)
        const userId = req.params.id || req.user.id;
        const user = await User.findByPk(userId);
        
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Utilisateur non trouvé"
            });
        }

        // Supprimer les données associées en premier (en raison des clés étrangères)
        // Supprimer tous les commentaires de l'utilisateur
        await PostComment.destroy({ where: { user_id: userId }, transaction });
        // Supprimer tous les posts de l'utilisateur
        await Post.destroy({ where: { user_id: userId }, transaction });
        // Supprimer le profil de l'utilisateur
        await Profile.destroy({ where: { user_id: userId }, transaction });

        // Supprimer l'utilisateur
        await user.destroy({ transaction });

        // Envoyer une notification au l'administrateur
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
        
        // Confirmer la transaction
        await transaction.commit();
        res.status(200).json({
            message: "Utilisateur supprimé avec succès"
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        const errorMsg = (error.name === 'SequelizeDatabaseError') ? error.parent.sqlMessage : error.message;
        res.status(500).json({
            message: "Erreur lors de la suppression de l'utilisateur",
            error: errorMsg
        });
    }
};

// Contrôleur pour récupérer tous les utilisateurs avec leurs profils et rôles
const getAllUsers = async (req, res) => {
    try {
        // Récupérer tous les utilisateurs avec leurs données associées
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

// Contrôleur pour récupérer un utilisateur spécifique par ID
const getUserById = async (req, res) => {
    try {
        // Chercher l'utilisateur par ID avec ses données associées
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