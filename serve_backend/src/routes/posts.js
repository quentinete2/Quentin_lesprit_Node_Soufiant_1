const express = require('express');
const router = express.Router();

// Importer les middlewares
const { validateAuthentication } = require('../midwave/auth');
const { validatePostCreate, validatePostUpdate } = require('../midwave/validatePost');
const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
} = require('../service/postController');

// Routes des posts
router.get('/', validateAuthentication, getAllPosts);
router.get('/:id', validateAuthentication, getPostById);
router.post('/', validateAuthentication, validatePostCreate, createPost);
router.put('/:id', validateAuthentication, validatePostUpdate, updatePost);
router.delete('/:id', validateAuthentication, deletePost);

module.exports = router;
