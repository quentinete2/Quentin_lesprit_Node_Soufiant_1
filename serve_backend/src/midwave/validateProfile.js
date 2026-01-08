const { checkSchema, validationResult } = require('express-validator');

// Middleware de validation pour la création d'un profil
const validateProfileCreate = async (req, res, next) => {
    await checkSchema({
        user_id: {
            notEmpty: { errorMessage: 'User ID is required' },
            isInt: { errorMessage: 'User ID must be an integer' }
        },
        first_name: {
            notEmpty: { errorMessage: 'First name is required' },
            isLength: { options: { min: 2 }, errorMessage: 'First name must be at least 2 characters' }
        },
        last_name: {
            notEmpty: { errorMessage: 'Last name is required' },
            isLength: { options: { min: 2 }, errorMessage: 'Last name must be at least 2 characters' }
        },
        phone: {
            optional: true,
            isMobilePhone: { errorMessage: 'Invalid phone number' }
        },
        address: {
            optional: true
        },
        birthdate: {
            optional: true,
            isISO8601: { errorMessage: 'Invalid date format' }
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

// Middleware de validation pour la mise à jour d'un profil
const validateProfileUpdate = async (req, res, next) => {
    await checkSchema({
        first_name: {
            optional: true,
            isLength: { options: { min: 2 }, errorMessage: 'First name must be at least 2 characters' }
        },
        last_name: {
            optional: true,
            isLength: { options: { min: 2 }, errorMessage: 'Last name must be at least 2 characters' }
        },
        phone: {
            optional: true,
            isMobilePhone: { errorMessage: 'Invalid phone number' }
        },
        address: {
            optional: true
        },
        birthdate: {
            optional: true,
            isISO8601: { errorMessage: 'Invalid date format' }
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
    validateProfileCreate,
    validateProfileUpdate
};
