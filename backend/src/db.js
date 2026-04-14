const mongoose = require('mongoose');
const logger = require('./logger.js');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://db:27017/reservas';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info(`Conectado a MongoDB: ${MONGO_URI}`);
  } catch (error) {
    logger.error(`Error conectando a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;