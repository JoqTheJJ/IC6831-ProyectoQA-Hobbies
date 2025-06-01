// Añadir un evento para manejar el formulario de login cuando se envía
document.getElementById('loginForm').addEventListener('submit', async function(event) {
  const messageDiv = document.getElementById('message');
  event.preventDefault(); // Evitar el comportamiento por defecto del formulario

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    // Realizar la solicitud para autenticar al usuario
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.text();

    // Manejar la respuesta exitosa
    if (response.ok) {
      localStorage.setItem('username', username); // Almacenar el nombre de usuario localmente
      messageDiv.innerHTML = `<p style="color: green;">Error: ${result}</p>`;
      window.location.href = 'main.html'; // Redirigir a la página principal
    } else {
      // Mostrar error si el inicio de sesión falla
      messageDiv.innerHTML = `<p style="color: red;">Error: ${result}</p>`;
    }

  } catch (error) {
    // Manejar errores de conexión o problemas en la solicitud
    console.error('Error durante el inicio de sesión:', error);
    messageDiv.innerHTML = `<p style="color: red;">Error: ${result}</p>`;
  }
});
