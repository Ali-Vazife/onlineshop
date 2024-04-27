const path = require('path');
const express = require('express');
const { sequelize } = require('./sequelize/models/index');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res) => {
  res.render('index');
});

const connectDb = async () => {
  console.log('Checking DB connection...');
  try {
    await sequelize.authenticate();
    console.log('DB connection established!😎');
  } catch (err) {
    console.log('Database connection failed😕', err);
    process.exit(1);
  }
};

// app.use('/api/v1/products', 's');
// app.use('/api/v1/users', 's');
// app.use('/api/v1/bookings', 's');

module.exports = { app, connectDb };
