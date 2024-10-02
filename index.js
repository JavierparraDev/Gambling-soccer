const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios'); // Para control de peticiones HTTP
const path = require('path');
const session = require('express-session');

require('dotenv').config(); // Para leer las variables del archivo .env

// Importamos las rutas desde la carpeta routes
const footballRoutes = require('./routes/footballRoutes');
const userRoutes = require('./routes/userRoutes');
const betRoutes = require('./routes/betRoutes'); // Añadimos las rutas de apuestas

const app = express();
const port = process.env.PORT || 3000;

// Middleware para procesar JSON
app.use(express.json());

// Middleware para servir archivos estáticos (CSS, JS adicionales)
app.use(express.static('public'));

// Configurar el middleware de sesión
app.use(session({
  secret: 'soccer7', // Clave secreta
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Asegúrate de que `secure` esté en `false` para pruebas locales
}));

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

// Ruta base para verificar que el servidor esté funcionando
app.get('/', (req, res) => {
  res.send('Servidor Backend para Proyecto jajajaja Deportivo y dssdChatbot');
});

// Registro de las rutas accesibles
app.use('/api/football', footballRoutes); // Rutas de fútbol (API-FOOTBALL)
app.use('/api/users', userRoutes); // Rutas de usuarios
app.use('/api/bets', betRoutes); // Rutas de apuestas

// Ruta para servir el widget de fútbol
app.get('/widget', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta para servir el formulario de registro de usuarios
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Ruta para servir el formulario de inicio de sesión
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Ruta para servir la vista de recarga de saldo
app.get('/recargar', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'recargar.html'));
});

// Ruta para servir el archivo HTML de apuesta
app.get('/bet-form', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'betForm.html'));
});

// Mostrar todas las rutas disponibles en la aplicación
app._router.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo y escuchando en http://localhost:${port}`);
});
