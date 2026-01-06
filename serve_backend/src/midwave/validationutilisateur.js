const { checkSchema, validationResult } = require('express-validator');

const validateUtilisateur = async (req, res, next) => {
    await checkSchema({
        nom: { notEmpty: true },
        email: { isEmail: true },
        telephone: { notEmpty: true }
    }).run(req);
    
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        return res.status(400).json({
            errors: validation.array()
        });
    }
    console.log("utilisateur validé");
    next();
};

module.exports = validateUtilisateur;
