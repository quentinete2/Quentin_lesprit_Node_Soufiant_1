const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Hash passwords
      const adminPassword = await bcrypt.hash('admin123', 10);
      const userPassword = await bcrypt.hash('user123', 10);

      const users = [
        {
          username: 'admin',
          email: 'admin@example.com',
          password: adminPassword,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          username: 'alice_dev',
          email: 'alice@example.com',
          password: userPassword,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          username: 'bob_writer',
          email: 'bob@example.com',
          password: userPassword,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          username: 'carol_tech',
          email: 'carol@example.com',
          password: userPassword,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          username: 'david_creator',
          email: 'david@example.com',
          password: userPassword,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          username: 'emma_blogger',
          email: 'emma@example.com',
          password: userPassword,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await queryInterface.bulkInsert('users', users, { transaction });
      await transaction.commit();
      console.log('Users seeded successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Error seeding users:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('users', null, {});
      console.log('Users removed successfully');
    } catch (error) {
      console.error('Error removing users:', error);
      throw error;
    }
  }
};
