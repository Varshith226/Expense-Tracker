const colors = require('colors'); // Import the whole colors package
const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`.bgCyan.white);
  } catch (error) {
    console.log(`${error}`.bgRed);
    process.exit(1); // Exit the app if DB connection fails
  }
};

module.exports = connectDb;
