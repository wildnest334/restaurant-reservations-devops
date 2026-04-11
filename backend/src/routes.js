const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const logger = require('./logger');

// ── Schema de Reserva ──────────────────────────────────────────────────────────
const reservaSchema = new mongoose.Schema({
  nombre:   { type: String, required: true },
  fecha:    { type: String, required: true },
  hora:     { type: String, required: true },
  personas: { type: Number, required: true },
}, { timestamps: true });

const Reserva = mongoose.model('Reserva', reservaSchema);

// ── POST /reservas ─────────────────────────────────────────────────────────────
router.post('/reservas', async (req, res) => {
  try {
    const { nombre, fecha, hora, personas } = req.body;

    if (!nombre || !fecha || !hora || !personas) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const reserva = new Reserva({ nombre, fecha, hora, personas });
    await reserva.save();

    logger.info(`Reserva creada: ${nombre} - ${fecha} ${hora} - ${personas} personas`);
    res.status(201).json(reserva);
  } catch (error) {
    logger.error(`Error al crear reserva: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ── GET /reservas ──────────────────────────────────────────────────────────────
router.get('/reservas', async (req, res) => {
  try {
    const reservas = await Reserva.find().sort({ createdAt: -1 });
    logger.info(`Consulta de reservas: ${reservas.length} registros`);
    res.json(reservas);
  } catch (error) {
    logger.error(`Error al obtener reservas: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ── DELETE /reservas/:id ───────────────────────────────────────────────────────
router.delete('/reservas/:id', async (req, res) => {
  try {
    const reserva = await Reserva.findByIdAndDelete(req.params.id);

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    logger.info(`Reserva eliminada: ID ${req.params.id}`);
    res.json({ mensaje: 'Reserva eliminada correctamente' });
  } catch (error) {
    logger.error(`Error al eliminar reserva: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;