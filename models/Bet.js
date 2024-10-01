const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  matchId: {
    type: String,
    required: true
  },
  teamBet: {
    type: String, // Equipo por el que se está apostando (local o visitante)
    required: true
  },
  typeOfBet: {
    type: String, // El tipo de apuesta, por ejemplo, "Shots on Goal", "Ball Possession", "Total Shots"
    required: true
  },
  valueBet: {
    type: Number, // El valor que se apuesta (por ejemplo, cuántos tiros a puerta habrá, posesión)
    required: true
  },
  odds: {
    type: Number, // Las probabilidades (odds) para esa apuesta
    required: true
  },
  amount: {
    type: Number, // Monto apostado
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'won', 'lost'],
    default: 'pending'
  },
  result: {
    type: String,
    enum: ['win', 'lose'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Bet = mongoose.model('Bet', betSchema);
module.exports = Bet;
