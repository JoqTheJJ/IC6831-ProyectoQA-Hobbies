const request = require('supertest');
const express = require('express');
const loginController = require('../../controllers/loginController');
const app = express();

app.use(express.json());
app.post('/login', loginController.loginUser);

// Simular Neo4j
const mockSession = {
  run: jest.fn(),
  close: jest.fn()
};

jest.mock('../../db/neo4j.js', () => ({
  session: () => mockSession
}));

describe('POST /login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    [{ username: '', password: '1234' }, 400, 'El nombre de usuario y la contraseña son requeridos'],
    [{ username: 'testuser', password: '' }, 400, 'El nombre de usuario y la contraseña son requeridos'],
    [{ username: '', password: '' }, 400, 'El nombre de usuario y la contraseña son requeridos']
  ])('debe validar campos requeridos: %o', async (body, expectedStatus, expectedText) => {
    const response = await request(app).post('/login').send(body);
    expect(response.statusCode).toBe(expectedStatus);
    expect(response.text).toContain(expectedText);
  });

  it('debe retornar 404 si el usuario no existe', async () => {
    mockSession.run.mockResolvedValueOnce({ records: [] });

    const response = await request(app).post('/login').send({
      username: 'nouser',
      password: 'password'
    });

    expect(response.statusCode).toBe(404);
    expect(response.text).toContain('Usuario no encontrado');
  });

  it('debe retornar 401 si la contraseña es incorrecta', async () => {
    mockSession.run.mockResolvedValueOnce({
      records: [
        {
          get: () => ({
            properties: { password: 'realpass' }
          })
        }
      ]
    });

    const response = await request(app).post('/login').send({
      username: 'testuser',
      password: 'wrongpass'
    });

    expect(response.statusCode).toBe(401);
    expect(response.text).toContain('Contraseña incorrecta');
  });

  it('debe retornar 200 si el inicio de sesión es exitoso', async () => {
    mockSession.run.mockResolvedValueOnce({
      records: [
        {
          get: () => ({
            properties: { password: 'correctpass' }
          })
        }
      ]
    });

    const response = await request(app).post('/login').send({
      username: 'testuser',
      password: 'correctpass'
    });

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Inicio de sesión exitoso');
  });

  it('debe retornar 500 si ocurre un error en la base de datos', async () => {
    mockSession.run.mockRejectedValueOnce(new Error('DB error'));

    const response = await request(app).post('/login').send({
      username: 'user',
      password: 'pass'
    });

    expect(response.statusCode).toBe(500);
    expect(response.text).toContain('Error durante el inicio de sesión');
  });
});
