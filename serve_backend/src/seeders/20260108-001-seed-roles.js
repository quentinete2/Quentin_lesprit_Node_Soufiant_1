module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const roles = [
        {
          name: 'admin',
          description: 'Administrateur système avec tous les droits',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'moderator',
          description: 'Modérateur - Gère les contenus et utilisateurs',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'editor',
          description: 'Éditeur - Peut créer et modifier ses propres contenus',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'user',
          description: 'Utilisateur standard avec permissions basiques',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await queryInterface.bulkInsert('roles', roles, { transaction });
      await transaction.commit();
      console.log('Roles seeded successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Error seeding roles:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('roles', null, {});
      console.log('Roles removed successfully');
    } catch (error) {
      console.error('Error removing roles:', error);
      throw error;
    }
  }
};
