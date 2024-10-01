const express = require('express');
const Bet = require('../models/Bet');
const { getFixtureStatistics } = require('../services/footballApiService');
const router = express.Router();

// Ruta para realizar una apuesta basada en estadísticas
router.post('/placeBet', async (req, res) => {
  const { matchId, teamBet, typeOfBet, valueBet, odds, amount } = req.body;

  if (!req.session.userId) {
    return res.status(401).json({ message: 'Debe iniciar sesión para hacer una apuesta' });
  }

  try {
    // Crear una nueva apuesta
    const newBet = new Bet({
      user: req.session.userId,
      matchId,
      teamBet,
      typeOfBet,
      valueBet,
      odds,
      amount
    });

    await newBet.save();
    res.status(201).json({ message: 'Apuesta realizada con éxito', bet: newBet });
  } catch (error) {
    console.error('Error al hacer la apuesta:', error);
    res.status(500).json({ message: 'Error al realizar la apuesta' });
  }
});

// Ruta para validar el resultado de la apuesta después del partido
router.get('/checkBet/:betId', async (req, res) => {
  const { betId } = req.params;

  try {
    const bet = await Bet.findById(betId);
    if (!bet) {
      return res.status(404).json({ message: 'Apuesta no encontrada' });
    }

    // Obtener las estadísticas del fixture desde la API
    const statistics = await getFixtureStatistics(bet.matchId, bet.teamBet);

    // Aquí verificamos si el valor apostado coincide con las estadísticas reales
    let statValue;
    switch (bet.typeOfBet) {
      case 'Shots on Goal':
        statValue = statistics[0].statistics.find(stat => stat.type === 'Shots on Goal').value;
        break;
      case 'Ball Possession':
        statValue = statistics[0].statistics.find(stat => stat.type === 'Ball Possession').value;
        break;
      // Agregar más casos según los diferentes tipos de apuestas
    }

    // Validar si la apuesta fue correcta
    let betResult;
    if (bet.valueBet === statValue) {
      betResult = 'won';
    } else {
      betResult = 'lost';
    }

    // Actualizar el estado de la apuesta
    bet.status = betResult;
    await bet.save();

    res.json({ message: `Apuesta ${betResult}`, bet });
  } catch (error) {
    console.error('Error al verificar la apuesta:', error);
    res.status(500).json({ message: 'Error al verificar la apuesta' });
  }
});

module.exports = router;
