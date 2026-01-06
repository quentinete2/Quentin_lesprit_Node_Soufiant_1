const { PostComment } = require('../models');

exports.getAllComments = async (req, res) => {
    try {
        const comments = await PostComment.findAll({
            include: ['post', 'author']
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCommentById = async (req, res) => {
    try {
        const comment = await PostComment.findByPk(req.params.id, {
            include: ['post', 'author']
        });
        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé' });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const { post_id, user_id, content } = req.body;
        const comment = await PostComment.create({
            post_id,
            user_id,
            content
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const comment = await PostComment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé' });
        }
        await comment.update(req.body);
        res.status(200).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await PostComment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé' });
        }
        await comment.destroy();
        res.status(200).json({ message: 'Commentaire supprimé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
