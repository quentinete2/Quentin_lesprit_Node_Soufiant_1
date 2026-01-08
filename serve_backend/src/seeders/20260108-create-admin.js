const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // This seeder is kept for backward compatibility
    // All data is now seeded through the individual seeder files:
    // - 20260108-seed-roles.js
    // - 20260108-seed-permissions.js
    // - 20260108-seed-users.js
    // - 20260108-seed-profiles.js
    // - 20260108-seed-posts.js
    // - 20260108-seed-post-comments.js
    // - 20260108-seed-user-roles.js
    // - 20260108-seed-role-permissions.js
    console.log('Admin seeder: Data initialization is handled by individual seeders');
  },

  down: async (queryInterface, Sequelize) => {
    console.log('Admin seeder: Rollback is handled by individual seeders');
  }
};
