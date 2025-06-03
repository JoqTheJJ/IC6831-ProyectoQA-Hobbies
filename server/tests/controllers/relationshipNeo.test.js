const request = require('supertest');
const express = require('express');
const relationshipController = require('../../controllers/relationshipNeo');

const app = express();
app.use(express.json());
app.post('/relationshipNeo/like', relationshipController.like);
app.post('/relationshipNeo/dislike', relationshipController.dislike);
app.post('/relationshipNeo/deleteLike', relationshipController.deleteLike);
app.post('/relationshipNeo/deleteDislike', relationshipController.deleteDislike);

const mockSession = {
  run: jest.fn(),
  close: jest.fn()
};

jest.mock('../../db/neo4j', () => ({
  session: () => mockSession
}));

describe('Relationship Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const endpoints = [
    { route: '/relationshipNeo/like', method: 'like', successMsg: 'Like registrado exitosamente.', delete: false },
    { route: '/relationshipNeo/dislike', method: 'dislike', successMsg: 'Dislike registrado exitosamente.', delete: false },
    { route: '/relationshipNeo/deleteLike', method: 'deleteLike', successMsg: 'Like eliminado exitosamente.', delete: true },
    { route: '/relationshipNeo/deleteDislike', method: 'deleteDislike', successMsg: 'Dislike eliminado exitosamente.', delete: true }
  ];

  test.each(endpoints)('%s - éxito', async ({ route, successMsg }) => {
    mockSession.run.mockResolvedValueOnce({
      records: [{ get: () => ({}) }]
    });

    const response = await request(app)
      .post(route)
      .send({ username: 'testuser', hobby: 'pintura' });

    expect(response.statusCode).toBe(route.includes('delete') ? 200 : 201);
    expect(response.text).toContain(successMsg);
  });

  test.each(endpoints)('%s - usuario o hobby no encontrado', async ({ route }) => {
    mockSession.run.mockResolvedValueOnce({ records: [] });

    const response = await request(app)
      .post(route)
      .send({ username: 'nonexistent', hobby: 'desconocido' });

    expect(response.statusCode).toBe(404);
    expect(response.text).toContain('Usuario o hobby no encontrado.');
  });

  test.each(endpoints)('%s - error interno del servidor', async ({ route }) => {
    mockSession.run.mockRejectedValueOnce(new Error('Error inesperado'));

    const response = await request(app)
      .post(route)
      .send({ username: 'testuser', hobby: 'pintura' });

    expect(response.statusCode).toBe(500);
    expect(response.text).toContain('Error al');
  });
});
