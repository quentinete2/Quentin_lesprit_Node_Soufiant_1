const { checkSchema, validationResult } = require('express-validator');

// Middleware de validation pour la création d'un post
const validatePostCreate = async (req, res, next) => {
    await checkSchema({
        title: {
            notEmpty: { errorMessage: 'Title is required' },
            isLength: { options: { min: 5 }, errorMessage: 'Title must be at least 5 characters' }
        },
        content: {
            notEmpty: { errorMessage: 'Content is required' },
            isLength: { options: { min: 10 }, errorMessage: 'Content must be at least 10 characters' }
        },
        user_id: {
            notEmpty: { errorMessage: 'User ID is required' },
            isInt: { errorMessage: 'User ID must be an integer' }
        }
    }).run(req);
    
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        return res.status(400).json({
            message: 'Validation error',
            errors: validation.array()
        });
    }
    next();
};

// Middleware de validation pour la mise à jour d'un post
const validatePostUpdate = async (req, res, next) => {
    await checkSchema({
        title: {
            optional: true,
            isLength: { options: { min: 5 }, errorMessage: 'Title must be at least 5 characters' }
        },
        content: {
            optional: true,
            isLength: { options: { min: 10 }, errorMessage: 'Content must be at least 10 characters' }
        }
    }).run(req);
    
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        return res.status(400).json({
            message: 'Validation error',
            errors: validation.array()
        });
    }
    next();
};

module.exports = {
    validatePostCreate,
    validatePostUpdate
};
