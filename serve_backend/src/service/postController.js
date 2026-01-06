const { Post, PostComment } = require('../models');
const { sequelize } = require('../models');

// Récupérer tous les articles avec leurs commentaires
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: ['comments']
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer un article spécifique par ID avec ses commentaires
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: ['comments']
        });
        if (!post) {
            return res.status(404).json({ message: 'Post non trouvé' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Créer un nouvel article avec transaction
exports.createPost = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { title, description } = req.body;
        const post = await Post.create({
            title,
            description
        }, { transaction });
        await transaction.commit();
        res.status(201).json(post);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour un article existant avec transaction
exports.updatePost = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const post = await Post.findByPk(req.params.id, { transaction });
        if (!post) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Post non trouvé' });
        }
        await post.update(req.body, { transaction });
        await transaction.commit();
        res.status(200).json(post);
    } catch (error) {
        await transaction.rollback();
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un article avec transaction (en cascade avec ses commentaires)
exports.deletePost = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const post = await Post.findByPk(req.params.id, { transaction });
        if (!post) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Post non trouvé' });
        }
        await post.destroy({ transaction });
        await transaction.commit();
        res.status(200).json({ message: 'Post supprimé' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les commentaires d'un article spécifique
exports.getPostComments = async (req, res) => {
    try {
        const comments = await PostComment.findAll({
            where: { post_id: req.params.id },
            include: ['author']
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
