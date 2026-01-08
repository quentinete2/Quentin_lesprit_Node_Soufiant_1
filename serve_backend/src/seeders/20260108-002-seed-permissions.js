module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const permissions = [
        // User Management
        {
          name: 'create_user',
          description: 'Créer un nouvel utilisateur',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'read_user',
          description: 'Voir les détails des utilisateurs',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'update_user',
          description: 'Modifier les informations utilisateur',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'delete_user',
          description: 'Supprimer un utilisateur',
          created_at: new Date(),
          updated_at: new Date()
        },
        // Post Management
        {
          name: 'create_post',
          description: 'Créer un nouveau post',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'read_post',
          description: 'Lire les posts',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'update_post',
          description: 'Modifier un post',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'delete_post',
          description: 'Supprimer un post',
          created_at: new Date(),
          updated_at: new Date()
        },
        // Comment Management
        {
          name: 'create_comment',
          description: 'Créer un commentaire',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'read_comment',
          description: 'Lire les commentaires',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'update_comment',
          description: 'Modifier un commentaire',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'delete_comment',
          description: 'Supprimer un commentaire',
          created_at: new Date(),
          updated_at: new Date()
        },
        // Role Management
        {
          name: 'manage_roles',
          description: 'Gérer les rôles',
          created_at: new Date(),
          updated_at: new Date()
        },
        // Permission Management
        {
          name: 'manage_permissions',
          description: 'Gérer les permissions',
          created_at: new Date(),
          updated_at: new Date()
        },
        // Moderation
        {
          name: 'moderate_content',
          description: 'Modérer le contenu',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await queryInterface.bulkInsert('permissions', permissions, { transaction });
      await transaction.commit();
      console.log('Permissions seeded successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Error seeding permissions:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('permissions', null, {});
      console.log('Permissions removed successfully');
    } catch (error) {
      console.error('Error removing permissions:', error);
      throw error;
    }
  }
};
