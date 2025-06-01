// Esperar a que el contenido de la página esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  
    // Manejar el evento de envío del formulario de registro
    document.getElementById('registerForm').addEventListener('submit', async function(event) {
      const messageDiv = document.getElementById('message');
      event.preventDefault();  // Prevenir el envío predeterminado del formulario
  
      console.log('Formulario enviado');
      
      // Obtener los valores ingresados por el usuario
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      const data = {
          username: username,
          email: email,
          password: password
      };
  
      try {
        // Enviar la solicitud de registro al servidor
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)  // Enviar los datos en formato JSON
        });
  
        // Manejar la respuesta del servidor en caso de éxito o error
        if (response.ok) {
            messageDiv.innerHTML = `<p style="color: green;">Cuenta creada exitosamente</p>`;
            // Redirigir al usuario al login después de un tiempo
            setTimeout(() => {
              window.location.href = 'login.html'; 
            }, 2000);
        } else if (response.status === 409) {
            const result = await response.json();
            messageDiv.innerHTML = `<p style="color: red;">${result.message}</p>`;
        } else {
            const result = await response.json();
            messageDiv.innerHTML = `<p style="color: red;">Error al crear cuenta</p>`;
        }
      } catch (error) {
          // Manejar errores de conexión
          console.error('Error durante el registro:', error);
          messageDiv.innerHTML = `<p style="color: red;">Ocurrió un error al conectarse con el servidor.</p>`;
      }
    });
  });
  