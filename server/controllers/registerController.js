const neo4jClient = require('../db/neo4j');
/*
Controlador para registrar un nuevo usuario en la base de datos
*/


exports.registerUser = async (req, res) => {
  /*
  Función para registrar un usuario con su correo y contraseña

  Recibe el usuario, correo y contraseña
  Registra al usuario en la base de datos
  */
  //console.log('Datos recibidos:', req.body);
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    //Si no estan completos los datos retorna
    return res.status(400).send('Todos los campos son requeridos');
  }

  try {
    const session = neo4jClient.session();

    const existingUser = await session.run(
      'MATCH (u:Usuario {username: $username}) RETURN u',
      { username }
    );

    if (existingUser.records.length > 0) {
      //El usuario ya existe
      await session.close();
      //console.log('El nombre de usuario ya existe');
      return res.status(409).json({ message: 'El nombre de usuario ya está registrado' });
    }


    const result = await session.run(
      'CREATE (u:Usuario {username: $username, correo: $email, password: $password}) RETURN u',
      { username, email, password }
    );


    const userNode = result.records[0].get('u');
    await session.close();

    //Registro exitoso
    res.status(201).send('Usuario registrado exitosamente');


  } catch (error) {
    //Error
    //console.error('Error durante el registro:', error);
    res.status(500).send('Error al registrar el usuario');
  }
};