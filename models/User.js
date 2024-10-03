const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    saldo: {
        type: Number,
        default: 0 // El saldo empieza en 0
    },
    rol: {
        type: String,
        enum: ['usuario', 'administrador'], // Solo permite estos dos valores
        default: 'usuario' // Valor por defecto
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
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
