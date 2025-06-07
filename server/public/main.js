// Ejecutar el código una vez que el contenido del DOM haya sido cargado
document.addEventListener('DOMContentLoaded', async function() {
  const hobbiesList = document.querySelector('.hobby-list');
  const recommendationsList = document.querySelector('.recommendations');

  const username = localStorage.getItem('username');
  if (!username) {
    // Redirigir al login si no se ha iniciado sesión
    window.location.href = '/login.html';
  }

  // Función para cargar hobbies desde el servidor
  async function loadHobbies() {
    try {
      const response = await fetch('/hobbies/getHobbies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
      });
      const hobbies = await response.json();
      hobbiesList.innerHTML = ''; // Limpiar la lista de hobbies

      // Verificar si ya se han mostrado todos los hobbies
      if (hobbies.length === 0) {
        const messageItem = document.createElement('div');
        messageItem.classList.add('message-item');
        messageItem.innerHTML = `<span>¡Ya has visto todos los hobbies!</span>`;
        hobbiesList.appendChild(messageItem);
      } else {
        // Renderizar la lista de hobbies
        hobbies.forEach(hobby => {
          const hobbyItem = document.createElement('div');
          hobbyItem.classList.add('hobby-item');
          hobbyItem.innerHTML = `
            <span>${hobby.nombre}</span>
            <div>
              <button class="like-btn" data-hobby="${hobby.nombre}">👍</button>
              <button class="dislike-btn" data-hobby="${hobby.nombre}">👎</button>
            </div>
          `;

          // Asignar eventos para los botones de like y dislike
          const likeBtn = hobbyItem.querySelector('.like-btn');
          const dislikeBtn = hobbyItem.querySelector('.dislike-btn');

          likeBtn.addEventListener('click', () => handleLike(hobby.nombre));
          dislikeBtn.addEventListener('click', () => handleDislike(hobby.nombre));

          hobbiesList.appendChild(hobbyItem);
        });
      }
    } catch (error) {
      console.error('Error al cargar hobbies:', error);
    }
  }

  // Función para cargar recomendaciones basadas en los hobbies de otros usuarios
  async function loadRecommendations() {
    try {
      const response = await fetch('/hobbies/getRecommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
      });
      const recommendations = await response.json();
      recommendationsList.innerHTML = ''; // Limpiar la lista de recomendaciones

      // Verificar si hay recomendaciones disponibles
      if (recommendations.length === 0) {
        const messageItem = document.createElement('div');
        messageItem.classList.add('message-item');
        messageItem.innerHTML = `<span>¡Intenta añadir más hobbies para obtener recomendaciones personalizadas!</span>`;
        recommendationsList.appendChild(messageItem);
      } else {
        // Renderizar la lista de recomendaciones
        recommendations.forEach(hobby => {
          const recommendationItem = document.createElement('div');
          recommendationItem.classList.add('recommendation-item');
          recommendationItem.innerHTML = `
            <span>${hobby.nombre}</span>
            <div>
              <span class="recommendation-text">Recomendado por ${hobby.score}👤</span>
              <button class="like-btn" data-hobby="${hobby.nombre}">👍</button>
              <button class="dislike-btn" data-hobby="${hobby.nombre}">👎</button>
            </div>
          `;

          // Asignar eventos para los botones de like y dislike en recomendaciones
          const likeBtn = recommendationItem.querySelector('.like-btn');
          const dislikeBtn = recommendationItem.querySelector('.dislike-btn');

          likeBtn.addEventListener('click', () => handleLike(hobby.nombre));
          dislikeBtn.addEventListener('click', () => handleDislike(hobby.nombre));

          recommendationsList.appendChild(recommendationItem);
        });
      }
    } catch (error) {
      console.error('Error al cargar recomendaciones:', error);
    }
  }

  // Función para manejar el evento de dar like a un hobby
  async function handleLike(hobbyName) {
    try {
      const response = await fetch('/relationshipNeo/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, hobby: hobbyName })
      });
      if (response.ok) {
        //console.log(`Like registrado para: ${hobbyName}`);
      } else {
        console.error('Error durante el registro de like');
      }
    } catch (error) {
      console.error('Error al registrar like:', error);
    }

    // Recargar los hobbies y recomendaciones después del like
    loadHobbies();
    loadRecommendations();
  }

  // Función para manejar el evento de dar dislike a un hobby
  async function handleDislike(hobbyName) {
    try {
      const response = await fetch('/relationshipNeo/dislike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, hobby: hobbyName })
      });
      if (response.ok) {
        //console.log(`Dislike registrado para: ${hobbyName}`);
      } else {
        console.error('Error durante el registro de dislike');
      }
    } catch (error) {
      console.error('Error al registrar dislike:', error);
    }

    // Recargar los hobbies y recomendaciones después del dislike
    loadHobbies();
    loadRecommendations();
  }

  // Cargar los hobbies y las recomendaciones cuando la página se carga
  loadHobbies();
  loadRecommendations();
});
