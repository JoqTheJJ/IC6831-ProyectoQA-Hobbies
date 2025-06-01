//Configurar el servidor, definir rutas, configurar la entrega de archivos y el puerto del servidor
const express = require('express');
const bodyParser = require('body-parser');

const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const hobbiesRoutes = require('./routes/hobbiesRoutes');
const relationshipNeoRoutes = require('./routes/relationshipNeoRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/relationshipNeo', relationshipNeoRoutes);
app.use('/hobbies', hobbiesRoutes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
