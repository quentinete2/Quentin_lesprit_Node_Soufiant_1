const express = require('express');
const { getAllUsers, getUserById, deleteUser } = require('../service/userController');
const { validateAuthentication } = require('../midwave/auth');

const router = express.Router();

// GET all users
router.get('/', validateAuthentication, getAllUsers);

// GET user by ID
router.get('/:id', validateAuthentication, getUserById);

// DELETE user by ID
router.delete('/:id', validateAuthentication, deleteUser);

module.exports = router;
