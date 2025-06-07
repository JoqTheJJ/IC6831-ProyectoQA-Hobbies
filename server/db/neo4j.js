const neo4j = require('neo4j-driver');

/*
const config = {
  uri: 'bolt://34.238.135.120',
  user: 'BetaDBMS',
  password: 'betabeta2'
};
*/

const config = {
  uri: 'bolt://3.231.165.171',
  user: 'neo4j',
  password: 'thermometer-traffic-navigators'
};

const neo4jClient = neo4j.driver(config.uri, neo4j.auth.basic(config.user, config.password));



async function checkConnection(){
  try {
    await neo4jClient.verifyConnectivity();
    console.log('Conectado a Neo4j exitosamente');
  } catch (error) {
    console.error('Error al conectar a Neo4j:', error);
    process.exit(1);
  }
}

checkConnection();

module.exports = neo4jClient;