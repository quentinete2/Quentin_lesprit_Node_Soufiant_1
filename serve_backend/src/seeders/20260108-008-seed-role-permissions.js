module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const rolePermissions = [
        // Admin role: all permissions
        { role_id: 1, permission_id: 1 },   // create_user
        { role_id: 1, permission_id: 2 },   // read_user
        { role_id: 1, permission_id: 3 },   // update_user
        { role_id: 1, permission_id: 4 },   // delete_user
        { role_id: 1, permission_id: 5 },   // create_post
        { role_id: 1, permission_id: 6 },   // read_post
        { role_id: 1, permission_id: 7 },   // update_post
        { role_id: 1, permission_id: 8 },   // delete_post
        { role_id: 1, permission_id: 9 },   // create_comment
        { role_id: 1, permission_id: 10 },  // read_comment
        { role_id: 1, permission_id: 11 },  // update_comment
        { role_id: 1, permission_id: 12 },  // delete_comment
        { role_id: 1, permission_id: 13 },  // manage_roles
        { role_id: 1, permission_id: 14 },  // manage_permissions
        { role_id: 1, permission_id: 15 },  // moderate_content

        // Moderator role
        { role_id: 2, permission_id: 2 },   // read_user
        { role_id: 2, permission_id: 3 },   // update_user
        { role_id: 2, permission_id: 6 },   // read_post
        { role_id: 2, permission_id: 7 },   // update_post
        { role_id: 2, permission_id: 8 },   // delete_post
        { role_id: 2, permission_id: 10 },  // read_comment
        { role_id: 2, permission_id: 11 },  // update_comment
        { role_id: 2, permission_id: 12 },  // delete_comment
        { role_id: 2, permission_id: 15 },  // moderate_content

        // Editor role
        { role_id: 3, permission_id: 2 },   // read_user
        { role_id: 3, permission_id: 5 },   // create_post
        { role_id: 3, permission_id: 6 },   // read_post
        { role_id: 3, permission_id: 7 },   // update_post
        { role_id: 3, permission_id: 8 },   // delete_post
        { role_id: 3, permission_id: 9 },   // create_comment
        { role_id: 3, permission_id: 10 },  // read_comment
        { role_id: 3, permission_id: 11 },  // update_comment
        { role_id: 3, permission_id: 12 },  // delete_comment

        // User role (basic)
        { role_id: 4, permission_id: 2 },   // read_user
        { role_id: 4, permission_id: 6 },   // read_post
        { role_id: 4, permission_id: 9 },   // create_comment
        { role_id: 4, permission_id: 10 },  // read_comment
        { role_id: 4, permission_id: 11 }   // update_comment (own comments)
      ];

      await queryInterface.bulkInsert('role_permissions', rolePermissions, { transaction });
      await transaction.commit();
      console.log('Role permissions seeded successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Error seeding role permissions:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('role_permissions', null, {});
      console.log('Role permissions removed successfully');
    } catch (error) {
      console.error('Error removing role permissions:', error);
      throw error;
    }
  }
};
