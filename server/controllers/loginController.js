const neo4jClient = require('../db/neo4j');
/*
Controlador para iniciar sesion en la base de datos
*/


exports.loginUser = async (req, res) => {
  /*
  Función para iniciar sesion con un usuario y una contraseña

  Recibe el usuario y la contraseña
  Verifica que el usuario y la contraseña coincidan
  con los almacenados en la base de datos
  */
  console.log('Datos recibidos:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    //Si no estan completos los datos retorna
    return res.status(400).send('El nombre de usuario y la contraseña son requeridos');
  }


  try {

    const session = neo4jClient.session();
    const result = await session.run(
      'MATCH (u:Usuario {username: $username}) RETURN u',
      { username }
    );


    if (result.records.length > 0) {
      const userNode = result.records[0].get('u');  
      const userProperties = userNode.properties;  
      const storedPassword = userProperties.password;


      if (storedPassword === password) {
        //Inicio de sesión exitoso
        console.log('Inicio de sesión exitoso');
        res.send('Inicio de sesión exitoso');

      } else {
        //Contraseña incorrecta
        console.log('Contraseña incorrecta');
        return res.status(401).send('Contraseña incorrecta');
      }


    } else {
      //Usuario no encontrado
      console.log('Usuario no encontrado');
      res.status(404).send('Usuario no encontrado');
    }


  } catch (error) {
    //Error
    console.error('Error durante el inicio de sesión:', error);
    res.status(500).send('Error durante el inicio de sesión');
  }
};