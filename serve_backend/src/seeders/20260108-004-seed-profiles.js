module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const profiles = [
        {
          user_id: 1,
          first_name: 'Admin',
          last_name: 'System',
          birthdate: '1990-01-15',
          phone: '+33612345678',
          address: '123 Rue de l\'Administration, 75000 Paris',
          bio: 'Administrateur système responsable de la plateforme',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          user_id: 2,
          first_name: 'Alice',
          last_name: 'Dupont',
          birthdate: '1995-03-22',
          phone: '+33612345679',
          address: '456 Avenue des Développeurs, 75001 Paris',
          bio: 'Développeuse passionnée par les nouvelles technologies et l\'innovation',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          user_id: 3,
          first_name: 'Bob',
          last_name: 'Martin',
          birthdate: '1988-07-10',
          phone: '+33612345680',
          address: '789 Boulevard de la Création, 75002 Paris',
          bio: 'Écrivain et créateur de contenu avec 10 ans d\'expérience',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          user_id: 4,
          first_name: 'Carol',
          last_name: 'Smith',
          birthdate: '1992-11-30',
          phone: '+33612345681',
          address: '321 Rue de la Technologie, 75003 Paris',
          bio: 'Experte en cybersécurité et architecture système',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          user_id: 5,
          first_name: 'David',
          last_name: 'Chen',
          birthdate: '1998-05-18',
          phone: '+33612345682',
          address: '654 Avenue de l\'Art, 75004 Paris',
          bio: 'Créateur multimédia et designer UX/UI innovant',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          user_id: 6,
          first_name: 'Emma',
          last_name: 'Garcia',
          birthdate: '1996-09-25',
          phone: '+33612345683',
          address: '987 Boulevard des Idées, 75005 Paris',
          bio: 'Blogueuse spécialisée dans le développement personnel et l\'entrepreneuriat',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await queryInterface.bulkInsert('profiles', profiles, { transaction });
      await transaction.commit();
      console.log('Profiles seeded successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Error seeding profiles:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('profiles', null, {});
      console.log('Profiles removed successfully');
    } catch (error) {
      console.error('Error removing profiles:', error);
      throw error;
    }
  }
};
