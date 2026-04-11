const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  nombre:   { type: String, required: true },
  fecha:    { type: String, required: true },
  hora:     { type: String, required: true },
  personas: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Reserva', reservaSchema);