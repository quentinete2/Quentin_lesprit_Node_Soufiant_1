module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const userRoles = [
        // User 1 (Admin) gets admin role
        {
          user_id: 1,
          role_id: 1,
          assigned_at: new Date()
        },
        // User 2 (Alice) gets editor role
        {
          user_id: 2,
          role_id: 3,
          assigned_at: new Date()
        },
        // User 3 (Bob) gets editor role
        {
          user_id: 3,
          role_id: 3,
          assigned_at: new Date()
        },
        // User 4 (Carol) gets moderator role
        {
          user_id: 4,
          role_id: 2,
          assigned_at: new Date()
        },
        // User 5 (David) gets editor role
        {
          user_id: 5,
          role_id: 3,
          assigned_at: new Date()
        },
        // User 6 (Emma) gets user role
        {
          user_id: 6,
          role_id: 4,
          assigned_at: new Date()
        }
      ];

      await queryInterface.bulkInsert('user_roles', userRoles, { transaction });
      await transaction.commit();
      console.log('User roles seeded successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Error seeding user roles:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('user_roles', null, {});
      console.log('User roles removed successfully');
    } catch (error) {
      console.error('Error removing user roles:', error);
      throw error;
    }
  }
};
