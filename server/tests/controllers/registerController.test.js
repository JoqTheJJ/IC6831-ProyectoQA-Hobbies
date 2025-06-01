const request = require('supertest');
const express = require('express');
const registerController = require('../../controllers/registerController');
const app = express();

app.use(express.json());
app.post('/register', registerController.registerUser);

// Simular Neo4j
jest.mock('../../db/neo4j', () => ({
  session: () => ({
    run: jest.fn()
      .mockResolvedValueOnce({ records: [] }) // usuario no existe
      .mockResolvedValueOnce({ records: [{ get: () => ({}) }] }),
    close: jest.fn()
  })
}));

describe('POST /register', () => {
  it('debe registrar un nuevo usuario', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: '1234'
      });

    expect(response.statusCode).toBe(201);
    expect(response.text).toBe('Usuario registrado exitosamente');
  });
});
