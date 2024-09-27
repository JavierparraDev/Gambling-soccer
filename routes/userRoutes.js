const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Ruta para manejar el registro de usuarios
router.post('/register', async (req, res) => {
    const { nombre, correo, contraseña } = req.body;

    // Validamos que todos los campos estén completos
    if (!nombre || !correo || !contraseña) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
    // Creamos un nuevo usuario
    const newUser = new User({ nombre, correo, contraseña });

    // Guardamos el usuario en la base de datos
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
    console.error('Error registrando el usuario:', error);
    res.status(500).json({ message: 'Error registrando el usuario' });
    }
});

module.exports = router;
