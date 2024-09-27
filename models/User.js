const mongoose = require('mongoose');

// Definimos el esquema de Usuario
const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Por favor ingresa un correo válido']
    },
    contraseña: {
        type: String,
        required: true,
        minlength: 6
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

// Creamos el modelo basado en el esquema
const User = mongoose.model('User', userSchema);

module.exports = User;
