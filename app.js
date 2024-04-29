const path = require('path');
const express = require('express');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res) => {
  res.render('overview');
});

// app.use('/api/v1/products', 's');
// app.use('/api/v1/users', 's');
// app.use('/api/v1/bookings', 's');

module.exports = app;
