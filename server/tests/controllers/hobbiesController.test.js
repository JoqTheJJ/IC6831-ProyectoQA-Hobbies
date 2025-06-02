const request = require('supertest');
const express = require('express');
const hobbiesController = require('../../controllers/hobbiesController');
const app = express();

app.use(express.json());
app.post('/hobbies/getHobbies', hobbiesController.getHobbies);
app.post('/hobbies/getRecommendations', hobbiesController.getRecommendations);
app.post('/hobbies/getLikesByUser', hobbiesController.getLikesByUser);
app.post('/hobbies/getDislikesByUser', hobbiesController.getDislikesByUser);

// Mock de Neo4j
const mockSession = {
  run: jest.fn(),
  close: jest.fn()
};

jest.mock('../../db/neo4j.js', () => ({
  session: () => mockSession
}));

describe('Controlador de hobbies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /hobbies/getHobbies', () => {
    it('debe retornar 200 con una lista de hobbies', async () => {
      mockSession.run.mockResolvedValueOnce({
        records: [
          { get: () => ({ properties: { nombre: 'Leer' } }) },
          { get: () => ({ properties: { nombre: 'Bailar' } }) }
        ]
      });

      const res = await request(app).post('/hobbies/getHobbies').send({ username: 'user1' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        { nombre: 'Leer' },
        { nombre: 'Bailar' }
      ]);
    });

    it('debe manejar errores internos', async () => {
      mockSession.run.mockRejectedValueOnce(new Error('Error simulado'));

      const res = await request(app).post('/hobbies/getHobbies').send({ username: 'user1' });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: 'Error al obtener hobbies' });
    });
  });

  describe('POST /hobbies/getRecommendations', () => {
    it('debe retornar recomendaciones con puntaje', async () => {
      mockSession.run.mockResolvedValueOnce({
        records: [
          {
            get: jest.fn((key) =>
              key === 'recomendation'
                ? { properties: { nombre: 'Cocinar' } }
                : { low: 3 }
            )
          }
        ]
      });

      const res = await request(app).post('/hobbies/getRecommendations').send({ username: 'user1' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        { nombre: 'Cocinar', score: 3 }
      ]);
    });

    it('debe manejar errores internos en recomendaciones', async () => {
      mockSession.run.mockRejectedValueOnce(new Error('Error simulado'));

      const res = await request(app).post('/hobbies/getRecommendations').send({ username: 'user1' });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: 'Error al obtener recomendaciones' });
    });
  });

  describe('POST /hobbies/getLikesByUser', () => {
    it('debe retornar hobbies con like del usuario', async () => {
      mockSession.run.mockResolvedValueOnce({
        records: [
          { get: () => ({ properties: { nombre: 'Dibujar' } }) }
        ]
      });

      const res = await request(app).post('/hobbies/getLikesByUser').send({ username: 'user1' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ nombre: 'Dibujar' }]);
    });

    it('debe manejar error al obtener likes', async () => {
      mockSession.run.mockRejectedValueOnce(new Error('Fallo'));

      const res = await request(app).post('/hobbies/getLikesByUser').send({ username: 'user1' });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: 'Error al obtener hobbies del usuario' });
    });
  });

  describe('POST /hobbies/getDislikesByUser', () => {
    it('debe retornar hobbies con dislike del usuario', async () => {
      mockSession.run.mockResolvedValueOnce({
        records: [
          { get: () => ({ properties: { nombre: 'Pescar' } }) }
        ]
      });

      const res = await request(app).post('/hobbies/getDislikesByUser').send({ username: 'user1' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ nombre: 'Pescar' }]);
    });

    it('debe manejar error al obtener dislikes', async () => {
      mockSession.run.mockRejectedValueOnce(new Error('Fallo'));

      const res = await request(app).post('/hobbies/getDislikesByUser').send({ username: 'user1' });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: 'Error al obtener dislikes del usuario' });
    });
  });
});
