const { Post, PostComment } = require('../models');
const { sequelize } = require('../models');

// Récupérer tous les articles avec leurs commentaires
exports.getAllPosts = async (req, res) => {
    try {
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

// Récupérer un article spécifique par ID avec ses commentaires
exports.getPostById = async (req, res) => {
    try {
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

// Créer un nouvel article avec transaction
exports.createPost = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { title, slug, content, status } = req.body;
        const user_id = req.user.id;
        const post = await Post.create({
            user_id,
            title,
            slug,
            content,
            status: status || 'draft'
        }, { transaction });
        await transaction.commit();
        res.status(201).json({
            message: "Post créé avec succès",
            data: post
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la création du post",
            error: error.message
        });
    }
};

// Mettre à jour un article existant avec transaction
exports.updatePost = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const post = await Post.findByPk(req.params.id, { transaction });
        if (!post) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Post non trouvé"
            });
        }
        await post.update(req.body, { transaction });
        await transaction.commit();
        res.status(200).json({
            message: "Post mis à jour avec succès",
            data: post
        });
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({
            message: "Erreur lors de la mise à jour du post",
            error: error.message
        });
    }
};

// Supprimer un article avec transaction (en cascade avec ses commentaires)
exports.deletePost = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const post = await Post.findByPk(req.params.id, { transaction });
        if (!post) {
            await transaction.rollback();
            return res.status(404).json({
                message: "Post non trouvé"
            });
        }
        await post.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({
            message: "Post supprimé avec succès",
            data: post
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: "Erreur lors de la suppression du post",
            error: error.message
        });
    }
};

// Récupérer tous les commentaires d'un article spécifique
exports.getPostComments = async (req, res) => {
    try {
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
