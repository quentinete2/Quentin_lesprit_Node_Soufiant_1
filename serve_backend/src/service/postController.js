const { Post, PostComment } = require('../models');

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

exports.createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const post = await Post.create({
            title,
            description
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post non trouvé' });
        }
        await post.update(req.body);
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post non trouvé' });
        }
        await post.destroy();
        res.status(200).json({ message: 'Post supprimé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
