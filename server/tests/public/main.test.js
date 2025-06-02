/**
 * @jest-environment jsdom
 */
const fs = require('fs');
const path = require('path');

global.fetch = jest.fn();






describe('main.js', () => {
  beforeEach(() => {
    document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, '../../public/main.html'), 'utf8');
    localStorage.clear();
    fetch.mockReset();
  });

  it('redirige a login si no hay username en localStorage', () => {
    delete window.location;
    window.location = { href: '' };

    require('../../public/main.js');
    expect(window.location.href).toBe('/login.html');
  });

  it('carga hobbies correctamente y muestra mensaje si no hay ninguno', async () => {
    localStorage.setItem('username', 'testuser');

    fetch
      .mockResolvedValueOnce({
        json: async () => [],
        ok: true
      }) // getHobbies
      .mockResolvedValueOnce({
        json: async () => [],
        ok: true
      }); // getRecommendations

    await require('../../public/main.js');

    const message = document.querySelector('.hobby-list .message-item span');
    expect(message).toBeTruthy();
    expect(message.textContent).toMatch(/Ya has visto todos los hobbies/i);
  });

  it('muestra hobbies con botones de like/dislike', async () => {
    localStorage.setItem('username', 'testuser');

    const hobbies = [
      { nombre: 'pintura' },
      { nombre: 'fútbol' }
    ];

    fetch
      .mockResolvedValueOnce({
        json: async () => hobbies,
        ok: true
      }) // getHobbies
      .mockResolvedValueOnce({
        json: async () => [],
        ok: true
      }); // getRecommendations

    await require('../../public/main.js');

    const items = document.querySelectorAll('.hobby-item');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('pintura');
    expect(items[1].textContent).toContain('fútbol');
  });

  it('renderiza recomendaciones con puntaje', async () => {
    localStorage.setItem('username', 'testuser');

    fetch
      .mockResolvedValueOnce({ json: async () => [], ok: true }) // getHobbies
      .mockResolvedValueOnce({
        json: async () => [
          { nombre: 'cocina', score: 3 }
        ],
        ok: true
      }); // getRecommendations

    await require('../../public/main.js');

    const recoItem = document.querySelector('.recommendation-item');
    expect(recoItem).toBeTruthy();
    expect(recoItem.textContent).toMatch(/cocina/);
    expect(recoItem.textContent).toMatch(/3👤/);
  });

  it('ejecuta fetch al dar click en botón like', async () => {
    localStorage.setItem('username', 'testuser');

    const hobbies = [{ nombre: 'pintura' }];

    fetch
      .mockResolvedValueOnce({ json: async () => hobbies, ok: true }) // getHobbies
      .mockResolvedValueOnce({ json: async () => [], ok: true }) // getRecommendations
      .mockResolvedValueOnce({ ok: true }) // like
      .mockResolvedValueOnce({ json: async () => hobbies, ok: true }) // reload hobbies
      .mockResolvedValueOnce({ json: async () => [], ok: true }); // reload recommendations

    await require('../../public/main.js');

    const likeBtn = document.querySelector('.like-btn');
    expect(likeBtn).toBeTruthy();
    likeBtn.click(); // Trigger click handler
  });
});
