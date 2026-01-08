module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const posts = [
        {
          user_id: 2,
          title: 'Introduction à Node.js et Express',
          slug: 'introduction-nodejs-express',
          content: 'Node.js est une plateforme d\'exécution JavaScript côté serveur qui révolutionne le développement web. Dans ce guide complet, nous explorerons les bases de Node.js, comment installer Express, et comment construire votre première application serveur robuste.\n\n## Pourquoi Node.js?\n\nNode.js permet aux développeurs d\'utiliser JavaScript pour écrire des applications serveur performantes. Avec npm et un écosystème riche de packages, vous pouvez développer rapidement.\n\n## Démarrer avec Express\n\nExpress est un framework minimaliste mais puissant qui facilite la création de serveurs web. Voici les étapes pour commencer...',
          status: 'published',
          created_at: new Date('2026-01-01'),
          updated_at: new Date('2026-01-01')
        },
        {
          user_id: 2,
          title: 'Les meilleures pratiques de code propre',
          slug: 'meilleures-pratiques-code-propre',
          content: 'Le code propre est essentiel pour la maintenance et la collaboration. Dans ce post, nous discuterons des principes SOLID, du nommage significatif, et de comment structurer votre code pour la lisibilité maximale.\n\n## Principes SOLID\n\n- Single Responsibility Principle\n- Open/Closed Principle\n- Liskov Substitution Principle\n- Interface Segregation Principle\n- Dependency Inversion Principle\n\nCes principes forment la base d\'une architecture logicielle robuste...',
          status: 'published',
          created_at: new Date('2026-01-02'),
          updated_at: new Date('2026-01-02')
        },
        {
          user_id: 3,
          title: 'Voyage au cœur de la storytelling digital',
          slug: 'storytelling-digital',
          content: 'La narration numérique a transformé la manière dont nous communiquons nos idées. Découvrez comment capturer l\'attention de votre audience avec des histoires authentiques et engageantes.\n\n## L\'importance de l\'authenticité\n\nLes auditeurs peuvent sentir la différence entre une histoire authentique et une histoire forcée. Partager vos expériences réelles crée une connexion émotionnelle puissante.\n\n## Techniques de narration efficace\n\nUtilisez le arc narratif classique: exposition, action montante, point culminant, action descendante, et résolution.',
          status: 'published',
          created_at: new Date('2026-01-03'),
          updated_at: new Date('2026-01-03')
        },
        {
          user_id: 4,
          title: 'Sécurité des applications web: les fondamentaux',
          slug: 'securite-web-fondamentaux',
          content: 'La sécurité est une responsabilité partagée entre développeurs et administrateurs. Découvrez les menaces courantes et comment les prévenir.\n\n## Menaces courantes\n\n- SQL Injection\n- Cross-Site Scripting (XSS)\n- Cross-Site Request Forgery (CSRF)\n- Authentification faible\n- Gestion inadéquate des sessions\n\n## Bonnes pratiques de sécurité\n\n1. Validez toutes les entrées utilisateur\n2. Utilisez des requêtes paramétrées\n3. Implémentez une authentification forte\n4. Chiffrez les données sensibles',
          status: 'draft',
          created_at: new Date('2026-01-04'),
          updated_at: new Date('2026-01-04')
        },
        {
          user_id: 5,
          title: 'Design System: Créer une interface cohérente',
          slug: 'design-system-coherence',
          content: 'Un design system est la fondation d\'une expérience utilisateur cohérente. Apprenez comment créer et maintenir un design system efficace pour votre organisation.\n\n## Composants du Design System\n\n- Style guide avec palette de couleurs\n- Typographie\n- Système de grille\n- Composants réutilisables\n- Patterns d\'interaction\n\nUn bon design system réduit la redondance et assure la cohérence à travers tous les produits.',
          status: 'published',
          created_at: new Date('2026-01-05'),
          updated_at: new Date('2026-01-05')
        },
        {
          user_id: 6,
          title: 'Construire son entreprise en ligne: Guide complet',
          slug: 'guide-entreprise-ligne',
          content: 'L\'entrepreneuriat digital offre des opportunités sans précédent. Voici un guide complet pour lancer et développer votre entreprise en ligne.\n\n## Étapes essentielles\n\n1. Trouver votre niche et valeur unique\n2. Valider votre idée auprès du marché\n3. Créer un MVP (Minimum Viable Product)\n4. Construire votre audience\n5. Monétiser votre solution\n\n## Erreurs courantes à éviter\n\n- Viser trop large au démarrage\n- Négliger la recherche de marché\n- Passer trop de temps en perfectionnement avant le lancement\n- Ignorer le feedback client',
          status: 'published',
          created_at: new Date('2026-01-06'),
          updated_at: new Date('2026-01-06')
        },
        {
          user_id: 3,
          title: 'Créativité et productivité: harmoniser les deux',
          slug: 'creativite-productivite',
          content: 'Comment être à la fois créatif et productif? Découvrez les stratégies pour maximiser votre performance créative.\n\n## La nature de la créativité\n\nLa créativité ne surgit pas du néant. Elle résulte de l\'intersection entre la connaissance, l\'expérience et la liberté d\'exploration.\n\n## Techniques de productivité créative\n\n- Bloquer des plages horaires dédiées à la création\n- Créer un environnement propice à la créativité\n- Pratiquer la méditation et la pleine conscience\n- Collaborer avec d\'autres créatifs\n- Accepter l\'expérimentation et l\'échec comme part du processus',
          status: 'archived',
          created_at: new Date('2025-12-20'),
          updated_at: new Date('2025-12-25')
        }
      ];

      await queryInterface.bulkInsert('posts', posts, { transaction });
      await transaction.commit();
      console.log('Posts seeded successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Error seeding posts:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('posts', null, {});
      console.log('Posts removed successfully');
    } catch (error) {
      console.error('Error removing posts:', error);
      throw error;
    }
  }
};
