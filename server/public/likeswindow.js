// Ejecutar código cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', async function() {

  // Seleccionar el contenedor para los hobbies que le gustan al usuario
  const likedHobbiesList = document.querySelector('.liked-hobby-list');
  
  // Obtener el nombre de usuario almacenado localmente
  const username = localStorage.getItem('username');
  
  // Verificar si el usuario está autenticado, de lo contrario, redirigir a la página de login
  if (!username) {
    window.location.href = '/login.html';
  }
  
  // Cargar los hobbies que le gustan al usuario
  async function loadLikedHobbies() {
    try {
      const response = await fetch('/hobbies/getLikesByUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }) // Enviar nombre de usuario
      });
      
      const likedHobbies = await response.json();
      likedHobbiesList.innerHTML = ''; // Limpiar la lista de hobbies antes de recargarla

      // Verificar si el usuario tiene hobbies con likes
      if (likedHobbies.length === 0) {
        const messageItem = document.createElement('div');
        messageItem.classList.add('message-item');
        messageItem.innerHTML = `<span>Aún no has añadido hobbies que te gusten<br>¡Explora más hobbies en inicio!</span>`;
        likedHobbiesList.appendChild(messageItem);
      } else {
        // Iterar sobre los hobbies con likes y agregarlos al DOM
        likedHobbies.forEach(hobby => {
          const hobbyItem = document.createElement('div');
          hobbyItem.classList.add('hobby-item');
          hobbyItem.innerHTML = `
            <span>${hobby.nombre}</span>
            <div>
            <button class="like-btn" data-hobby="${hobby.nombre}">Remover 👍</button>
            </div>
          `;

          // Añadir la funcionalidad de eliminar like a cada hobby
          const likeBtn = hobbyItem.querySelector('.like-btn');
          likeBtn.addEventListener('click', () => handleLike(hobby.nombre));
          likedHobbiesList.appendChild(hobbyItem);
        });
      }
    } catch (error) {
      //console.error('Error al cargar los hobbies con like:', error);
    }
  }

  // Eliminar el like de un hobby
  async function handleLike(hobbyName) {
    try {
      const response = await fetch('/relationshipNeo/deleteLike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, hobby: hobbyName }) // Enviar datos para eliminar el like
      });

      if (response.ok) {
        //console.log(`Like eliminado para: ${hobbyName}`);
      } else {
        //console.error('Error durante la eliminación del like');
      }
    } catch (error) {
      //console.error('Error al eliminar like:', error);
    }

    // Recargar la lista de hobbies con likes después de eliminar uno
    loadLikedHobbies();
  }

  // Ejecutar la función de cargar hobbies con likes cuando la página se cargue
  loadLikedHobbies();
});
