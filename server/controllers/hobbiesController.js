const neo4jClient = require('../db/neo4j');
/*
Controlador para obtener los hobbies de la
base de datos, utiliza la conexión definida en db/neo4j
*/


exports.getHobbies = async (req, res) => {
  /*
  Función para obtener hobbies generales de la base de datos

  Recibe el usuario loggeado
  Retorna 5 hobbies con los que el usuario no haya interactuado
  */
  try {
    const { username } = req.body;
    const session = neo4jClient.session();
    const result = await session.run(`
      MATCH (h:Hobby)
      WHERE NOT EXISTS ((:Usuario {username: $username})-[:LIKE|DISLIKE]->(h:Hobby))
      RETURN h
      LIMIT 5
      `,
      { username }
    );
    const hobbies = result.records.map(record => record.get('h').properties);

    await session.close();
    //Retorna los hobbies obtenidos
    res.status(200).json(hobbies);


  } catch (error) {
    //Error
    //console.error('Error al obtener hobbies:', error);
    res.status(500).json({ message: 'Error al obtener hobbies' });
  }
};

exports.getRecommendations = async (req, res) => {
  /*
  Función para obtener recoemdaciones personalizadas de hobbies
  para el usuario segpun sus gustos. Obtiene los hobbies de la
  base de datos

  Recibe el usuario loggeado
  Retorna 5 hobbies que el usuario podria considerar en base a
  las interacciones de usuarios con gustos similares al usuario
  objetivo
  */
  try {
    const { username } = req.body;
    const session = neo4jClient.session();
    const result = await session.run(`
        MATCH (u:Usuario {username: $username})-[:LIKE|DISLIKE]->(h:Hobby)
        MATCH (h)<-[:LIKE|DISLIKE]-(other:Usuario)-[rel]->(recomendation:Hobby)
        WHERE NOT (u)-[:LIKE|DISLIKE]->(recomendation)
        WITH recomendation,
            COUNT(CASE WHEN type(rel) = 'LIKE' THEN 1 END) AS likeScore,
            COUNT(CASE WHEN type(rel) = 'DISLIKE' THEN 1 END) AS dislikeScore
        WITH recomendation, (likeScore - dislikeScore) AS score
        WHERE score > 0
        RETURN recomendation, score
        ORDER BY score DESC
        LIMIT 5
        `,
        { username }
      );
      const hobbies = result.records.map(record => ({
        //Obtiene las propiedades del hobby y su puntaje (en recomendacion)
        ...record.get('recomendation').properties,
        score: record.get('score').low
      }));

    await session.close();
    //Retorna los hobbies obtenidos
    res.status(200).json(hobbies);


  } catch (error) {
    //Error
    //console.error('Error al obtener recomendaciones:', error);
    res.status(500).json({ message: 'Error al obtener recomendaciones' });
  }
};

exports.getLikesByUser = async (req, res) => {
  /*
  Función para obtener los hobbies a los que el usuario ha dado
  like en la base de datos

  Recibe el usuario loggeado
  Retorna todos los hobbies que el usuario ha dado like
  */
  try {
    const { username } = req.body;
    const session = neo4jClient.session();
    
    const result = await session.run(`
      MATCH (u:Usuario {username: $username})-[:LIKE]->(h:Hobby)
      RETURN h
      `, 
      { username }
    );

    const hobbies = result.records.map(record => record.get('h').properties);

    await session.close();
    //Retorna los hobbies obtenidos
    res.status(200).json(hobbies);


  } catch (error) {
    //Error
    //console.error('Error al obtener hobbies del usuario:', error);
    res.status(500).json({ message: 'Error al obtener hobbies del usuario' });
  }
};


exports.getDislikesByUser = async (req, res) => {
  /*
  Función para obtener los hobbies a los que el usuario ha dado
  dislike en la base de datos

  Recibe el usuario loggeado
  Retorna todos los hobbies que el usuario ha dado dislike
  */
  try {
    const { username } = req.body;
    const session = neo4jClient.session();
    
    const result = await session.run(`
      MATCH (u:Usuario {username: $username})-[:DISLIKE]->(h:Hobby)
      RETURN h
      `, 
      { username }
    );

    const hobbies = result.records.map(record => record.get('h').properties);

    await session.close();
    //Retorna los hobbies obtenidos
    res.status(200).json(hobbies);


  } catch (error) {
    //Error
    //console.error('Error al obtener dislikes del usuario:', error);
    res.status(500).json({ message: 'Error al obtener dislikes del usuario' });
  }
};