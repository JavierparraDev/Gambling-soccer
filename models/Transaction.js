const mongoose = require('mongoose');

// Definimos el esquema de Transacciones
const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    monto: {
        type: Number,
        required: true
    },
    metodoPago: {
        type: String,
        enum: ['tarjeta', 'cupon', 'pse', 'saldo'],
        required: true
    },
    tipo: {
        type: String,
        enum: ['recarga', 'apuestaGanada', 'apuestaPerdida', 'apuesta'],
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;