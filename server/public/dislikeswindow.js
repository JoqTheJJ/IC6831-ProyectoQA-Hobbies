// Asegurarse de que el contenido del DOM esté cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', async function() {

  // Seleccionar el contenedor para mostrar los hobbies que no gustan al usuario
  const dislikedHobbiesList = document.querySelector('.disliked-hobby-list');
  
  // Verificar si el usuario ha iniciado sesión
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = '/login.html'; // Redirigir a login si no está autenticado
  }
  
  // Cargar los hobbies que tienen dislikes
  async function loadDislikedHobbies() {
      try {
        const response = await fetch('/hobbies/getDislikesByUser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }) // Enviar el nombre de usuario
        });
        
        const dislikedHobbies = await response.json();
        dislikedHobbiesList.innerHTML = ''; // Limpiar la lista de hobbies antes de recargarla

        // Mostrar mensaje si no hay hobbies con dislikes
        if (dislikedHobbies.length === 0) {
          const messageItem = document.createElement('div');
          messageItem.classList.add('message-item');
          messageItem.innerHTML = `<span>No tienes hobbies que no te gusten<br>¡Realizas un poco de todo!</span>`;
          dislikedHobbiesList.appendChild(messageItem);
        } else {
          // Iterar sobre los hobbies con dislikes y agregarlos al DOM
          dislikedHobbies.forEach(hobby => {
            const hobbyItem = document.createElement('div');
            hobbyItem.classList.add('hobby-item');
            hobbyItem.innerHTML = `
              <span>${hobby.nombre}</span>
              <div>
              <button class="dislike-btn" data-hobby="${hobby.nombre}">Remover 👎</button>
              </div>
              `;

            // Añadir la funcionalidad de eliminar dislike a cada hobby
            const dislikeBtn = hobbyItem.querySelector('.dislike-btn');
            dislikeBtn.addEventListener('click', () => handleDislike(hobby.nombre));
            dislikedHobbiesList.appendChild(hobbyItem);
          });
        }
      } catch (error) {
        console.error('Error al cargar los hobbies con dislike:', error);
      }
  }
  
  // Eliminar el dislike de un hobby
  async function handleDislike(hobbyName) {
      try {
        const response = await fetch('/relationshipNeo/deleteDislike', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, hobby: hobbyName }) // Enviar los datos para eliminar el dislike
        });
        if (response.ok) {
          console.log(`Dislike eliminado para: ${hobbyName}`);
        } else {
          console.error('Error al eliminar el dislike');
        }
      } catch (error) {
        console.error('Error al eliminar dislike:', error);
      }

      // Recargar la lista de hobbies con dislikes después de eliminar
      loadDislikedHobbies();
  }

  // Ejecutar la carga de hobbies con dislikes cuando se carga la página
  loadDislikedHobbies();
});
