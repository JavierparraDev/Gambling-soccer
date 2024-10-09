const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configuración para subir archivos PDF

// Ruta para el registro de usuarios (ajustada con nuevos campos)
router.post('/register', async (req, res) => {
    const { nombres, apellidos, correo, contraseña, celular, tipoDocumento, numeroDocumento, fechaNacimiento, pais } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ $or: [{ correo }, { numeroDocumento }] });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe con este correo o número de documento' });
        }

        // Validar formato del celular
        const celularRegex = /^\d{7,15}$/;
        if (!celularRegex.test(celular)) {
            return res.status(400).json({ message: 'Por favor, ingresa un número celular válido' });
        }

        // Validar tipo de documento
        const tiposValidos = ['CC', 'CE', 'Pasaporte'];
        if (!tiposValidos.includes(tipoDocumento)) {
            return res.status(400).json({ message: 'Tipo de documento inválido' });
        }

        // Validar que el usuario sea mayor de edad
        const fechaNacimientoDate = new Date(fechaNacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();
        const diferenciaMeses = hoy.getMonth() - fechaNacimientoDate.getMonth();
        const diferenciaDias = hoy.getDate() - fechaNacimientoDate.getDate();

        if (diferenciaMeses < 0 || (diferenciaMeses === 0 && diferenciaDias < 0)) {
            edad--;
        }

        if (edad < 18) {
            return res.status(400).json({ message: 'Debes ser mayor de edad para registrarte' });
        }

        // Validar país (opcional, si tienes una lista de países)
        if (typeof pais !== 'string' || pais.trim() === '') {
            return res.status(400).json({ message: 'Por favor, ingresa un país válido' });
        }

        // Crear un nuevo usuario con los campos adicionales
        const newUser = new User({
            nombres,
            apellidos,
            correo,
            contraseña, // Guardamos la contraseña cifrada
            saldo: 0, // Inicializar el saldo en 0
            celular,
            tipoDocumento,
            numeroDocumento,
            fechaNacimiento: fechaNacimientoDate,
            pais
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error('Error en el registro de usuario:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
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

        // Devuelve los datos del usuario (nombres, apellidos, correo, saldo)
        res.json({
            message: 'Inicio de sesión exitoso',
            nombres: user.nombres,
            apellidos: user.apellidos,
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

// Ruta para solicitar retiro
router.post('/retiro', upload.single('certificadoCuenta'), async (req, res) => {
    const { monto, metodoRetiro, nombreBanco, numeroCuenta, titularCuenta, corresponsal } = req.body;

    if (!req.session.userId) {
        return res.status(401).json({ message: 'Debe iniciar sesión para retirar saldo' });
    }

    try {
        const user = await User.findById(req.session.userId);

        if (!user || user.saldo < monto) {
            return res.status(400).json({ message: 'Saldo insuficiente o usuario no encontrado' });
        }

        // Determinar el método de retiro y generar un código si es corresponsal
        let metodo;
        let codigoCorresponsal = null;

        if (metodoRetiro === 'banco') {
            metodo = `Banco: ${nombreBanco}, Titular: ${titularCuenta}, Cuenta: ${numeroCuenta}`;
        } else if (metodoRetiro === 'corresponsal') {
            metodo = `Corresponsal: ${corresponsal}`;
            codigoCorresponsal = Math.random().toString(36).substring(2, 10).toUpperCase(); // Generar el código de retiro
        }

        // Guardar la transacción
        const newTransaction = new Transaction({
            userId: user._id,
            monto: parseFloat(monto),
            metodoPago: metodo,
            tipo: 'retiro'
        });
        await newTransaction.save();

        // Actualizar saldo del usuario
        user.saldo -= parseFloat(monto);
        await user.save();

        res.json({
            message: `Retiro por ${metodoRetiro} solicitado con éxito.`,
            codigoCorresponsal // Enviar el código de corresponsal si existe
        });
    } catch (error) {
        console.error('Error en el retiro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;