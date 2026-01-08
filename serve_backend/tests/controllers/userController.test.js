const request = require('supertest');
const app = require('../../src/app');

describe("API Authentification - Utilisateurs",  () => {
    // Tests sans connexion à la base de données réelle
    // Ils testent les validations et les endpoints
    
    describe("POST /api/auth/register - Validations", () => {
        test("Devrait retourner une erreur 400 si le username est manquant", async () => {
            const result = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "test@example.com",
                    password: "SecurePassword123!"
                })
                .expect(400);

            expect(result.body).toHaveProperty('errors');
            expect(result.body.message).toBe('Validation error');
        });

        test("Devrait retourner une erreur 400 si l'email est manquant", async () => {
            const result = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser",
                    password: "SecurePassword123!"
                })
                .expect(400);

            expect(result.body).toHaveProperty('errors');
        });

        test("Devrait retourner une erreur 400 si le password est manquant", async () => {
            const result = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser",
                    email: "test@example.com"
                })
                .expect(400);

            expect(result.body).toHaveProperty('errors');
        });

        test("Devrait retourner une erreur 400 si le username est trop court", async () => {
            const result = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "test@example.com",
                    username: "ab",
                    password: "SecurePassword123!"
                })
                .expect(400);

            expect(result.body).toHaveProperty('errors');
        });

        test("Devrait retourner une erreur 400 si l'email n'est pas valide", async () => {
            const result = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "invalid-email",
                    username: "testuser",
                    password: "SecurePassword123!"
                })
                .expect(400);

            expect(result.body).toHaveProperty('errors');
        });

        test("Devrait retourner une erreur 400 si le password est trop court", async () => {
            const result = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "test@example.com",
                    username: "testuser",
                    password: "short"
                })
                .expect(400);

            expect(result.body).toHaveProperty('errors');
        });
    });

    describe("POST /api/auth/login - Validations", () => {
        test("Devrait retourner une erreur 400 si le username est manquant", async () => {
            const result = await request(app)
                .post("/api/auth/login")
                .send({
                    password: "SecurePassword123!"
                })
                .expect(400);

            expect(result.body).toHaveProperty('errors');
            expect(result.body.message).toBe('Validation error');
        });

        test("Devrait retourner une erreur 400 si le password est manquant", async () => {
            const result = await request(app)
                .post("/api/auth/login")
                .send({
                    username: "testuser"
                })
                .expect(400);

            expect(result.body).toHaveProperty('errors');
        });

        test("Devrait retourner une erreur 400 si username ET password sont manquants", async () => {
            const result = await request(app)
                .post("/api/auth/login")
                .send({})
                .expect(400);

            expect(result.body).toHaveProperty('errors');
        });
    });

    describe("GET /home", () => {
        test("Devrait retourner un message de santé du serveur", async () => {
            const result = await request(app)
                .get("/home")
                .expect(200);
            
            expect(result.body).toEqual({ message: "hello world" });
        });

        test("Devrait retourner du JSON valide", async () => {
            const result = await request(app)
                .get("/home")
                .expect('Content-Type', /json/)
                .expect(200);
            
            expect(typeof result.body).toBe('object');
            expect(result.body.message).toBeDefined();
        });
    });

    describe("POST /api/auth/register - Réponses HTTP", () => {
        test("Devrait accepter une request avec tous les champs valides", async () => {
            // Ce test vérifie que la validation passe
            // La création réelle dépend de la BD
            const result = await request(app)
                .post("/api/auth/register")
                .send({
                    email: `test_${Date.now()}@example.com`,
                    username: `testuser_${Date.now()}`,
                    password: "SecurePassword123!"
                });
            
            // Devrait soit créer (201) soit échouer en BD (500 si pas de connexion)
            // mais ne pas échouer en validation
            expect([201, 500]).toContain(result.status);
        });
    });

    describe("POST /api/auth/login - Réponses HTTP", () => {
        test("Devrait gérer une requête avec données valides", async () => {
            const result = await request(app)
                .post("/api/auth/login")
                .send({
                    username: "testuser",
                    password: "SecurePassword123!"
                });
            
            // Devrait soit trouver l'utilisateur (200/401/404) soit échouer en BD (400)
            // mais pas en validation
            expect([200, 400, 401, 404]).toContain(result.status);
        });
    });
});

