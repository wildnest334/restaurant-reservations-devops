const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Reserva  = require('../models/reserva');
const logger   = require('./logger');

// ── POST /reservas ─────────────────────────────────────────────────────────────
router.post('/reservas', async (req, res) => {
  try {
    const { nombre, fecha, hora, personas } = req.body;

    // Validar que ningún campo esté ausente (personas puede ser 0, lo chequeamos aparte)
    if (!nombre || !fecha || !hora || personas === undefined) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const reserva = new Reserva({ nombre, fecha, hora, personas });
    await reserva.save();

    logger.info(`Reserva creada: ID ${reserva._id} | ${nombre} - ${fecha} ${hora} - ${personas} persona(s)`);
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
    logger.info(`Consulta de reservas: ${reservas.length} registro(s) devuelto(s)`);
    res.json(reservas);
  } catch (error) {
    logger.error(`Error al obtener reservas: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ── DELETE /reservas/:id ───────────────────────────────────────────────────────
router.delete('/reservas/:id', async (req, res) => {
  try {
    // Validar formato del ID antes de consultar Mongo
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const reserva = await Reserva.findByIdAndDelete(req.params.id);

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    logger.info(`Reserva eliminada: ID ${req.params.id} | ${reserva.nombre}`);
    res.json({ mensaje: 'Reserva eliminada correctamente' });
  } catch (error) {
    logger.error(`Error al eliminar reserva: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;