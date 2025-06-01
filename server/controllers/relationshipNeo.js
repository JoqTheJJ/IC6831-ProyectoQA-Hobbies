const neo4jClient = require('../db/neo4j');
/*
Controlador para manejar las relaciones de los usuarios
y los hobbies como likes y dislikes
*/


// Registrar like
exports.like = async (req, res) => {
  /*
  Función para registrar que un usuario le da like a un hobby

  Recibe el usuario y el hobby
  Registra la relacion en la base de datos
  */


  const { hobby, username } = req.body;
  let session;
  try {
    session = neo4jClient.session();

    const query = `
      MATCH (u:Usuario {username: $username}), (h:Hobby {nombre: $hobby})
      MERGE (u)-[:LIKE]->(h)
      RETURN h, u
    `;
    const result = await session.run(query, { hobby, username });

    if (result.records.length === 0) {
      //Usuario o hobby no encontrado
      return res.status(404).send('Usuario o hobby no encontrado.');
    }

    //Registro Exitoso
    res.status(201).send('Like registrado exitosamente.');


  } catch (error) {
    //Error
    console.error('Error al registrar like:', error);
    res.status(500).send('Error al registrar like.');
  } finally {
    //Close db session
    if (session) await session.close();
  }
};



// Registrar dislike
exports.dislike = async (req, res) => {
  /*
  Función para registrar que un usuario le da dislike a un hobby

  Recibe el usuario y el hobby
  Registra la relacion en la base de datos
  */


  const { hobby, username } = req.body;
  let session;
  try {
    session = neo4jClient.session();

    const query = `
      MATCH (u:Usuario {username: $username}), (h:Hobby {nombre: $hobby})
      MERGE (u)-[:DISLIKE]->(h)
      RETURN h, u
    `;
    const result = await session.run(query, { hobby, username });

    if (result.records.length === 0) {
      //Usuario o hobby no encontrado
      return res.status(404).send('Usuario o hobby no encontrado.');
    }

    //Registro Exitoso
    res.status(201).send('Dislike registrado exitosamente.');


  } catch (error) {
    //Error
    console.error('Error al registrar dislike:', error);
    res.status(500).send('Error al registrar dislike.');
  } finally {
    //Close db session
    if (session) await session.close();
  }
};



// Eliminar like
exports.deleteLike = async (req, res) => {
  /*
  Función para registrar que un usuario elimina
  su like de un hobby

  Recibe el usuario y el hobby
  Elimina la relacion en la base de datos
  */


  const { hobby, username } = req.body;
  let session;
  try {
    session = neo4jClient.session();

    const query = `
      MATCH (u:Usuario {username: $username})-[r:LIKE]->(h:Hobby {nombre: $hobby})
      DELETE r
      RETURN h, u
    `;
    const result = await session.run(query, { hobby, username });

    if (result.records.length === 0) {
      //Usuario o hobby no encontrado
      return res.status(404).send('Usuario o hobby no encontrado.');
    }

    //Eliminacion Exitosa
    res.status(200).send('Like eliminado exitosamente.');


  } catch (error) {
    //Error
    console.error('Error al eliminar like:', error);
    res.status(500).send('Error al eliminar like.');
  } finally {
    //Close db session
    if (session) await session.close();
  }
};



// Eliminar dislike
exports.deleteDislike = async (req, res) => {
  /*
  Función para registrar que un usuario elimina
  su dislike de un hobby

  Recibe el usuario y el hobby
  Elimina la relacion en la base de datos
  */


  const { hobby, username } = req.body;
  let session;
  try {
    session = neo4jClient.session();

    const query = `
      MATCH (u:Usuario {username: $username})-[r:DISLIKE]->(h:Hobby {nombre: $hobby})
      DELETE r
      RETURN h, u
    `;
    const result = await session.run(query, { hobby, username });

    if (result.records.length === 0) {
      //Usuario o hobby no encontrado
      return res.status(404).send('Usuario o hobby no encontrado.');
    }

    //Eliminacion Exitosa
    res.status(200).send('Dislike eliminado exitosamente.');


  } catch (error) {
    //Error
    console.error('Error al eliminar dislike:', error);
    res.status(500).send('Error al eliminar dislike.');
  } finally {
    //Close db session
    if (session) await session.close();
  }
};