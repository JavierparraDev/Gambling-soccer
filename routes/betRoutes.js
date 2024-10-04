// betRoutes.js
const express = require('express');
const Bet = require('../models/Bet');
const User = require('../models/User'); // Importa el modelo de usuario
const Transaction = require('../models/Transaction');  // Ajusta la ruta según sea necesario
const { getFixtureStatistics } = require('../services/footballApiService');
const router = express.Router();

// Ruta para realizar una apuesta basada en estadísticas
router.post('/placeBet', async (req, res) => {
  const { matchId, teamBet, typeOfBet, valueBet, odds, amount } = req.body;

  if (!req.session.userId) {
    return res.status(401).json({ message: 'Debe iniciar sesión para hacer una apuesta' });
  }

  try {
    // Verificar si el usuario tiene saldo suficiente
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.saldo < amount) {
      return res.status(400).json({ message: 'Saldo insuficiente para realizar la apuesta' });
    }

    // Restar el monto apostado del saldo del usuario
    user.saldo -= amount;
    await user.save();

    // Crear una nueva apuesta
    const newBet = new Bet({
      user: user._id,
      matchId,
      teamBet,
      typeOfBet,
      valueBet,
      odds,
      amount
    });

    await newBet.save();

    // Crear un nuevo registro en la colección de transacciones
    const newTransaction = new Transaction({
      userId: user._id,
      monto: amount,
      metodoPago: 'saldo',  // Indica que es una apuesta
      tipo: 'apuesta',
      fecha: new Date(),  // Registra la fecha actual
    });

    await newTransaction.save();

    res.status(201).json({ message: 'Apuesta realizada con éxito', bet: newBet });
  } catch (error) {
    console.error('Error al hacer la apuesta:', error);
    res.status(500).json({ message: 'Error al realizar la apuesta' });
  }
});

module.exports = router;