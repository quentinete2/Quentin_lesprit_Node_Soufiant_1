const { Post, PostComment } = require('../models');
const { sequelize } = require('../models');

// Contrôleur pour récupérer tous les articles avec leurs commentaires
exports.getAllPosts = async (req, res) => {
    try {
        // Chercher tous les posts avec leurs commentaires associés
        const posts = await Post.findAll({
            include: ['comments']
        });
        if (!posts || posts.length === 0) {
            return res.status(404).json({
                message: "Aucun post trouvé"
            });
        }
        res.status(200).json({
            message: "Liste de tous les posts",
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des posts",
            error: error.message
        });
    }
};

// Contrôleur pour récupérer un article spécifique par ID avec ses commentaires
exports.getPostById = async (req, res) => {
    try {
        // Chercher le post par ID avec ses commentaires
        const post = await Post.findByPk(req.params.id, {
            include: ['comments']
        });
        if (!post) {
            return res.status(404).json({
                message: "Post non trouvé"
            });
        }
        res.status(200).json({
            message: "Détail d'un post",
            data: post
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération du post",
            error: error.message
        });
    }
};

// Contrôleur pour créer un nouvel article avec transaction
exports.createPost = async (req, res) => {
    // Démarrer une transaction pour assurer la cohérence
    const transaction = await sequelize.transaction();
    try {
        // Extraire les données de la requête
        const { title, slug, content, status } = req.body;
        // Utiliser l'ID de l'utilisateur connecté
        const user_id = req.user.id;
        // Créer le post avec le statut par défaut 'draft'
        const post = await Post.create({
            user_id,
            title,
            slug,
            content,
            status: status || 'draft'
        }, { transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(201).json({
            message: "Post créé avec succès",
            data: post
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la création du post",
            error: error.message
        });
    }
};

// Contrôleur pour mettre à jour un article existant avec transaction
exports.updatePost = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Chercher le post par ID
        const post = await Post.findByPk(req.params.id, { transaction });
        if (!post) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Post non trouvé"
            });
        }
        // Vérifier que seul le propriétaire du post peut le modifier
        if (post.user_id !== req.user.id) {
            await transaction.rollback();
            return res.status(403).json({
                message: "Vous ne pouvez modifier que vos propres posts"
            });
        }
        // Mettre à jour le post avec les nouvelles données
        await post.update(req.body, { transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(200).json({
            message: "Post mis à jour avec succès",
            data: post
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la mise à jour du post",
            error: error.message
        });
    }
};

// Contrôleur pour supprimer un article avec transaction (en cascade avec ses commentaires)
exports.deletePost = async (req, res) => {
    // Démarrer une transaction
    const transaction = await sequelize.transaction();
    try {
        // Chercher le post par ID
        const post = await Post.findByPk(req.params.id, { transaction });
        if (!post) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Post non trouvé"
            });
        }
        // Vérifier que seul le propriétaire du post peut le supprimer
        if (post.user_id !== req.user.id) {
            await transaction.rollback();
            return res.status(403).json({
                message: "Vous ne pouvez supprimer que vos propres posts"
            });
        }
        // Supprimer le post (les commentaires seront supprimés en cascade)
        await post.destroy({ transaction });
        // Confirmer la transaction
        await transaction.commit();
        res.status(200).json({
            message: "Post supprimé avec succès",
            data: post
        });
    } catch (error) {
        // Annuler la transaction en cas d'erreur
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la suppression du post",
            error: error.message
        });
    }
};

// Contrôleur pour récupérer tous les commentaires d'un article spécifique
exports.getPostComments = async (req, res) => {
    try {
        // Chercher tous les commentaires du post avec l'auteur
        const comments = await PostComment.findAll({
            where: { post_id: req.params.id },
            include: ['author']
        });
        if (!comments || comments.length === 0) {
            return res.status(404).json({
                message: "Aucun commentaire trouvé pour ce post"
            });
        }
        res.status(200).json({
            message: "Liste des commentaires du post",
            data: comments
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des commentaires",
            error: error.message
        });
    }
};
