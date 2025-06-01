const neo4jClient = require('../db/neo4j');


exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('El nombre de usuario y la contraseña son requeridos');
  }

  
  try {

    const session = neo4jClient.session();
    const result = await session.run(
      'MATCH (u:User {username: $username}) RETURN u',
      { username }
    );

    if (result.records.length > 0) {
      const userNode = result.records[0].get('u');
      console.log('Inicio de sesión exitoso en Neo4j:', userNode);
      res.send('Inicio de sesión exitoso en Neo4j');
    } else {
      console.log('Usuario no encontrado en Neo4j');
      res.status(404).send('Usuario no encontrado en Neo4j');
    }


  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    res.status(500).send('Error durante el inicio de sesión');
  }
};