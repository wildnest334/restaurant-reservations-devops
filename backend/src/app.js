const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const routes = require('.//routes');
const logger = require('./logger.js');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rutas ──────────────────────────────────────────────────────────────────────
app.use('/api', routes);

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ── Iniciar servidor ───────────────────────────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`No se pudo iniciar el servidor: ${error.message}`);
    process.exit(1);
  });