module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const comments = [
        {
          post_id: 1,
          user_id: 3,
          content: 'Excellent tutoriel! J\'ai enfin compris comment Express gère les middleware. Les exemples pratiques sont vraiment utiles.',
          created_at: new Date('2026-01-01T12:00:00'),
          updated_at: new Date('2026-01-01T12:00:00')
        },
        {
          post_id: 1,
          user_id: 4,
          content: 'Merci pour cette introduction claire. Auriez-vous des recommandations pour la sécurité dans Express?',
          created_at: new Date('2026-01-01T14:30:00'),
          updated_at: new Date('2026-01-01T14:30:00')
        },
        {
          post_id: 1,
          user_id: 6,
          content: 'Parfait pour quelqu\'un qui débute en Node.js. J\'attends vos prochains posts sur les bases de données!',
          created_at: new Date('2026-01-02T09:15:00'),
          updated_at: new Date('2026-01-02T09:15:00')
        },
        {
          post_id: 2,
          user_id: 4,
          content: 'Les principes SOLID sont vraiment fondamentaux. Trop de développeurs les ignorent et le résultat est un code difficile à maintenir.',
          created_at: new Date('2026-01-02T16:45:00'),
          updated_at: new Date('2026-01-02T16:45:00')
        },
        {
          post_id: 2,
          user_id: 5,
          content: 'Post très complet! J\'aimerais un article approfondi sur le Single Responsibility Principle avec des exemples réels.',
          created_at: new Date('2026-01-03T11:20:00'),
          updated_at: new Date('2026-01-03T11:20:00')
        },
        {
          post_id: 3,
          user_id: 2,
          content: 'La storytelling est effectivement un art. C\'est inspirant de lire des réflexions sur comment raconter des histoires authentiques.',
          created_at: new Date('2026-01-04T10:00:00'),
          updated_at: new Date('2026-01-04T10:00:00')
        },
        {
          post_id: 3,
          user_id: 6,
          content: 'J\'utilise ces techniques dans mes blogs et ça change vraiment l\'engagement. Merci pour ce partage!',
          created_at: new Date('2026-01-04T13:30:00'),
          updated_at: new Date('2026-01-04T13:30:00')
        },
        {
          post_id: 5,
          user_id: 2,
          content: 'Magnifique breakdown du design system. Les composants réutilisables c\'est vraiment la clé pour scale une équipe.',
          created_at: new Date('2026-01-05T15:45:00'),
          updated_at: new Date('2026-01-05T15:45:00')
        },
        {
          post_id: 5,
          user_id: 3,
          content: 'Pouvez-vous élaborer sur comment gérer les évolutions du design system quand on a déjà des applications en production?',
          created_at: new Date('2026-01-05T17:20:00'),
          updated_at: new Date('2026-01-05T17:20:00')
        },
        {
          post_id: 6,
          user_id: 2,
          content: 'Guide très pratique. Le point sur le MVP est crucial - trop de gens essaient de faire parfait avant de lancer.',
          created_at: new Date('2026-01-06T09:50:00'),
          updated_at: new Date('2026-01-06T09:50:00')
        },
        {
          post_id: 6,
          user_id: 4,
          content: 'Avez-vous des conseils spécifiques sur la validation du marché? Comment savoir si on suit la bonne direction?',
          created_at: new Date('2026-01-06T12:15:00'),
          updated_at: new Date('2026-01-06T12:15:00')
        }
      ];

      await queryInterface.bulkInsert('post_comments', comments, { transaction });
      await transaction.commit();
      console.log('Comments seeded successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Error seeding comments:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('post_comments', null, {});
      console.log('Comments removed successfully');
    } catch (error) {
      console.error('Error removing comments:', error);
      throw error;
    }
  }
};
