const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://db:27017/reservas';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;