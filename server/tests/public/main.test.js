/**
 * @jest-environment jsdom
 */
const fs = require('fs');
const path = require('path');

describe('main.js', () => {
  beforeEach(() => {
    document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, '../../public/main.html'), 'utf8');
    localStorage.setItem('username', 'testuser');
  });

  it('carga la página sin errores', async () => {
    require('../../public/main.js');
    // Aquí puedes simular eventos o validar contenido
    const title = document.querySelector('h3');
    expect(title.textContent).toMatch(/Explora Hobbies/i);
  });
});
