const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios'); // control de peticiones 
const path = require('path');
const session = require('express-session');

// variables del archivo .env
require('dotenv').config();

// Importamos las rutas  de la carpeta routes (uso obligatorio para acceder)

const footballRoutes = require('./routes/footballRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const betRoutes = require('./routes/betRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para procesar JSON
app.use(express.json());

// Middleware para servir archivos estáticos pruebas de base de datos. 
app.use(express.static('public'));

// Configurar el middleware de sesión
app.use(session({
  secret: 'soccer7', // clave de prueba
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Asegúrate de que `secure` esté en `false` para pruebas locales
}));

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

app.use('/api/users', userRoutes); // Añadimos las rutas de usuarios a la aplicación

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

// Mostrar todas las rutas disponibles
app._router.stack.forEach(function(r) {
  if (r.route && r.route.path) {
      console.log(r.route.path)
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo y escuchando en http://localhost:${port}`);
});