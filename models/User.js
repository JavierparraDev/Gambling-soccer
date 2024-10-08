const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definimos el esquema de Usuario
const userSchema = new mongoose.Schema({
    nombres: {
        type: String,
        required: true,
        trim: true
    },
    apellidos: {
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
    saldo: {
        type: Number,
        default: 0 // El saldo empieza en 0
    },
    rol: {
        type: String,
        enum: ['usuario', 'administrador'], // Solo permite estos dos valores
        default: 'usuario' // Valor por defecto
    },
    celular: {
        type: String,
        required: true,
        match: [/^\d{7,15}$/, 'Por favor ingresa un número celular válido']
    },
    tipoDocumento: {
        type: String,
        enum: ['CC', 'CE', 'Pasaporte'], // Añadimos 'CE' como opción válida
        required: true
    },
    numeroDocumento: {
        type: String,
        required: true,
        unique: true
    },
    fechaNacimiento: {
        type: Date,
        required: true
    },
    pais: {
        type: String,
        required: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    },
    cuentaBanco: {
        type: String,
        enum: ['confirmada', 'sin registrar'], // Solo permite estos dos valores
        default: 'sin registrar' // Valor por defecto
    }
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
    if (!this.isModified('contraseña')) return next();

    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.contraseña);
};

// Creamos el modelo basado en el esquema
const User = mongoose.model('User', userSchema);

module.exports = User;