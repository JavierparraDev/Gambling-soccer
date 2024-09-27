const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config(); // Para leer las variables del archivo .env

const footballRoutes = require('./routes/footballRoutes'); // Importamos las rutas de fútbol
const userRoutes = require('./routes/userRoutes'); // Importamos las rutas de usuario

const app = express();
const port = process.env.PORT || 3000;


// Middleware para procesar JSON
app.use(express.json());

// Middleware para servir archivos estáticos si es necesario (CSS, JS adicionales)
app.use(express.static('public'));

// Conexión a la base de datos MongoDB (damian tiene que usar esto*)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo y escuchando en http://localhost:${port}`);
});
