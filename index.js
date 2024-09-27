const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios'); // Usaremos axios para hacer la petición a la API-Football
const path = require('path');

// Para leer las variables del archivo .env
require('dotenv').config();

// Importamos las rutas de fútbol
const footballRoutes = require('./routes/footballRoutes'); 
// Importamos las rutas de usuario
const userRoutes = require('./routes/userRoutes'); 

const app = express();
const port = process.env.PORT || 3000;


// Middleware para procesar JSON
app.use(express.json());

// Middleware para servir archivos estáticos pruebas de base de datos. 
app.use(express.static('public'));

// Conexión a la base de datos MongoDB 
mongoose.connect(process.env.MONGO_URI,)
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('Error conectando a MongoDB:', err));

// Ruta base para verificar que el servidor esté funcionando
app.get('/', (req, res) => {
  res.send('Servidor Backend para Proyecto jajajaja Deportivo y Chatbot');
});

// Rutas de fútbol (API-FOOTBALL)
app.use('/api/football', footballRoutes);

// Añadimos las rutas de usuarios a la aplicación
app.use('/api/users', userRoutes); 

// Ruta para servir el widget de fútbol pruebas***
app.get('/widget', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta para servir el formulario de registro de usuarios  pruebas****
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Nueva ruta para obtener los detalles de un partido
app.get('/partido/:id', async (req, res) => {
  const matchId = req.params.id;
  const apiKey = process.env.RAPIDAPI_KEY;

  try {
      const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures?id=${matchId}`, {
          headers: {
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
              'x-rapidapi-key': apiKey
          }
      });

      const matchData = response.data.response[0];
      res.json(matchData); // Devuelve los datos del partido en formato JSON

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los datos del partido' });
  }
});


// Nueva ruta para obtener los detalles de un partido
app.get('/partido/:id', async (req, res) => {
  const matchId = req.params.id;
  const apiKey = process.env.RAPIDAPI_KEY;

  try {
      const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures?id=${matchId}`, {
          headers: {
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
              'x-rapidapi-key': apiKey
          }
      });

      const matchData = response.data.response[0];
      res.json(matchData); // Devuelve los datos del partido en formato JSON

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los datos del partido' });
  }
});

// Nueva ruta para obtener la clasificación de una liga específica
app.get('/api/football/standings/:leagueId/:season', async (req, res) => {
  const leagueId = req.params.leagueId;
  const season = req.params.season;
  const apiKey = process.env.RAPIDAPI_KEY;

  try {
      const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/standings?league=${leagueId}&season=${season}`, {
          headers: {
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
              'x-rapidapi-key': apiKey
          }
      });

      const standingsData = response.data.response[0].league.standings;
      res.json(standingsData); // Devuelve los detalles de la clasificación en formato JSON

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los datos de la clasificación' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo y escuchando en http://localhost:${port}`);
});
