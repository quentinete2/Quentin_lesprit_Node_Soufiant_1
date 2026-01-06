const express = require('express');

// Importer tous les routeurs spécialisés
const utilisateurRoutes = require('./utilisateurs');
const usersRoutes = require('./users');
const profilesRoutes = require('./profiles');
const postsRoutes = require('./posts');
const commentsRoutes = require('./comments');
const rolesRoutes = require('./roles');
const permissionsRoutes = require('./permissions');
const userRolesRoutes = require('./userRoles');
const rolePermissionsRoutes = require('./rolePermissions');

// Fonction pour initialiser toutes les routes de l'application
const initRoutes = (app) => {
    // Route de santé pour vérifier que le serveur est actif
    app.get('/home', (req, res, next) => {
        res.status(200).json({
            message: "hello world"
        });
    });

    // Montage des routes par domaine
    app.use('/api/users', usersRoutes);
    app.use('/api/profiles', profilesRoutes);
    app.use('/api/posts', postsRoutes);
    app.use('/api/comments', commentsRoutes);
    app.use('/api/roles', rolesRoutes);
    app.use('/api/permissions', permissionsRoutes);
    app.use('/api/user-roles', userRolesRoutes);
    app.use('/api/role-permissions', rolePermissionsRoutes);
    app.use('/utilisateurs', utilisateurRoutes);
}

module.exports = initRoutes;
