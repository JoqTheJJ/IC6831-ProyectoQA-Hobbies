const neo4jClient = require('../db/neo4j');


exports.registerUser = async (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { email, password, username } = req.body;

  try {

    /*
    try {
      await client.get(existingUserKey);
      return res.status(409).send('El nombre de usuario ya existe'); // Conflict
    } catch (getError) {
      if (getError.code !== Aerospike.status.ERR_RECORD_NOT_FOUND) {
        // Handle other potential errors
        console.error('Error al verificar existencia del usuario:', getError);
        return res.status(500).send('Error al verificar el usuario');
      }
      // Proceed to register the user
    }
    */

    const session = neo4jClient.session();
    const result = await session.run(
      'CREATE (u:User {username: $username}) RETURN u',
      { username }
    );
    const userNode = result.records[0].get('u');
    console.log('Nodo usuario creado en Neo4j:', userNode);
    await session.close();

    res.status(201).send('Registro exitoso');
  } catch (error) {
    console.error('Error durante el registro:', error);
    res.status(500).send('Error al registrar el usuario');
  }
};
