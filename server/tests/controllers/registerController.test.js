const request = require('supertest');
const express = require('express');
const registerController = require('../../controllers/registerController');
const app = express();

app.use(express.json());
app.post('/register', registerController.registerUser);

// Simular Neo4j
const mockSession = {
  run: jest.fn(),
  close: jest.fn()
};

jest.mock('../../db/neo4j.js', () => ({
  session: () => mockSession
}));


describe('POST /register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    [{ username: 'testuser', email: 'test@example.com', password: '1234' }, 201, 'Usuario registrado exitosamente'],
    [{ username: '', email: 'test@example.com', password: '1234' }, 400, 'Todos los campos son requeridos'],
    [{ username: 'user2', email: '', password: '1234' }, 400, 'Todos los campos son requeridos'],
    [{ username: 'user3', email: 'mail@example.com', password: '' }, 400, 'Todos los campos son requeridos'],
    [{ username: '', email: '', password: '' }, 400, 'Todos los campos son requeridos'],
  ])('debe manejar el caso: %o', async (body, expectedStatus, expectedText) => {
    if (expectedStatus === 409) {
      mockSession.run.mockResolvedValueOnce({ records: [{ get: () => ({}) }] });
    } else if (expectedStatus === 201) {
      mockSession.run
        .mockResolvedValueOnce({ records: [] }) // no existe
        .mockResolvedValueOnce({ records: [{ get: () => ({}) }] }); // creado
    }

    const response = await request(app)
      .post('/register')
      .send(body);

    expect(response.statusCode).toBe(expectedStatus);
    expect(response.text).toContain(expectedText);
  });

  it('debe retornar 409 si el usuario ya existe', async () => {
    mockSession.run.mockResolvedValueOnce({ records: [{ get: () => ({}) }] });

    const response = await request(app)
      .post('/register')
      .send({
        username: 'existinguser',
        email: 'exist@example.com',
        password: 'pass123'
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe('El nombre de usuario ya está registrado');
  });
});
