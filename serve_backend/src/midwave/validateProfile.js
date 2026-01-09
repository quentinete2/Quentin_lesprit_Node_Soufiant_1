const { checkSchema, validationResult } = require('express-validator');

// Middleware de validation pour la création d'un profil
const validateProfileCreate = async (req, res, next) => {
    // Vérifier les champs requis pour créer un profil
    await checkSchema({
        user_id: {
            // Vérifier que l'ID utilisateur est fourni et est un entier
            notEmpty: { errorMessage: 'User ID is required' },
            isInt: { errorMessage: 'User ID must be an integer' }
        },
        first_name: {
            // Vérifier que le prénom est fourni et a au moins 2 caractères
            notEmpty: { errorMessage: 'First name is required' },
            isLength: { options: { min: 2 }, errorMessage: 'First name must be at least 2 characters' }
        },
        last_name: {
            // Vérifier que le nom est fourni et a au moins 2 caractères
            notEmpty: { errorMessage: 'Last name is required' },
            isLength: { options: { min: 2 }, errorMessage: 'Last name must be at least 2 characters' }
        },
        phone: {
            // Le téléphone est optionnel, mais s'il est fourni, doit être valide
            optional: true,
            isMobilePhone: { errorMessage: 'Invalid phone number' }
        },
        address: {
            // L'adresse est optionnel
            optional: true
        },
        birthdate: {
            // La date de naissance est optionnelle, mais si fournie, doit être au format ISO
            optional: true,
            isISO8601: { errorMessage: 'Invalid date format' }
        }
    }).run(req);
    
    // Récupérer les résultats de la validation
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        // Retourner les erreurs de validation
        return res.status(400).json({
            message: 'Validation error',
            errors: validation.array()
        });
    }
    // Continuer au contrôleur suivant si la validation est correcte
    next();
};

// Middleware de validation pour la mise à jour d'un profil
const validateProfileUpdate = async (req, res, next) => {
    // Vérifier les champs optionnels pour mettre à jour un profil
    await checkSchema({
        first_name: {
            // Le prénom est optionnel, mais s'il est fourni, doit avoir au moins 2 caractères
            optional: true,
            isLength: { options: { min: 2 }, errorMessage: 'First name must be at least 2 characters' }
        },
        last_name: {
            // Le nom est optionnel, mais s'il est fourni, doit avoir au moins 2 caractères
            optional: true,
            isLength: { options: { min: 2 }, errorMessage: 'Last name must be at least 2 characters' }
        },
        phone: {
            // Le téléphone est optionnel, mais s'il est fourni, doit être valide
            optional: true,
            isMobilePhone: { errorMessage: 'Invalid phone number' }
        },
        address: {
            // L'adresse est optionnel
            optional: true
        },
        birthdate: {
            // La date de naissance est optionnelle, mais si fournie, doit être au format ISO
            optional: true,
            isISO8601: { errorMessage: 'Invalid date format' }
        }
    }).run(req);
    
    // Récupérer les résultats de la validation
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        // Retourner les erreurs de validation
        return res.status(400).json({
            message: 'Validation error',
            errors: validation.array()
        });
    }
    // Continuer au contrôleur suivant si la validation est correcte
    next();
};

module.exports = {
    validateProfileCreate,
    validateProfileUpdate
};
