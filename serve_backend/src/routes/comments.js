const express = require('express');
const router = express.Router();

// Importer les middlewares
const { validateAuthentication } = require('../midwave/auth');
const { validateCommentCreate, validateCommentUpdate } = require('../midwave/validateComment');
const {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
} = require('../service/commentController');

// Routes des commentaires
router.get('/', validateAuthentication, getAllComments);
router.get('/:id', validateAuthentication, getCommentById);
router.post('/', validateAuthentication, validateCommentCreate, createComment);
router.put('/:id', validateAuthentication, validateCommentUpdate, updateComment);
router.delete('/:id', validateAuthentication, deleteComment);

module.exports = router;
