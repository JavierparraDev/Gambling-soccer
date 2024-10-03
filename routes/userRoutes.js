const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Ruta para el registro de usuarios (ya existente)
router.post('/register', async (req, res) => {
    const { nombre, correo, contraseña } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ correo });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear un nuevo usuario
        const newUser = new User({
            nombre,
            correo,
            contraseña,
            saldo: 0 // Inicializar el saldo en 0
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Busca al usuario en la base de datos por correo
        const user = await User.findOne({ correo });

        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Compara la contraseña ingresada con la contraseña en la base de datos
        const isMatch = await user.comparePassword(contraseña);

        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Guarda el userId en la sesión
        req.session.userId = user._id;

        // Devuelve los datos del usuario (nombre, correo, saldo)
        res.json({
            message: 'Inicio de sesión exitoso',
            nombre: user.nombre,
            correo: user.correo,
            saldo: user.saldo
        });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta para recargar saldo
router.post('/recargar', async (req, res) => {
    const { monto, metodo } = req.body;

    if (!req.session.userId) {
        return res.status(401).json({ message: 'Debe iniciar sesión para recargar saldo' });
    }

    try {
        // Buscar al usuario por su ID
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar el saldo del usuario
        user.saldo += parseFloat(monto);
        await user.save();

        // Crear un nuevo registro en la colección de transacciones
        const newTransaction = new Transaction({
            userId: user._id,
            monto: parseFloat(monto),
            metodoPago: metodo,
            tipo: 'recarga'
        });

        await newTransaction.save();

        // Mensaje de éxito que incluye el monto recargado
        res.json({
            message: `Recarga de ${monto} fue exitosa.`,
            saldoActual: user.saldo
        });
    } catch (error) {
        console.error('Error al recargar saldo:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;