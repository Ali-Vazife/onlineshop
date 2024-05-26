const path = require('path');
const express = require('express');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(
  '/scripts',
  express.static(path.join(__dirname, 'node_modules/ionicons/dist/ionicons/')),
);

app.use('/', viewRoutes);
app.use('/api/v1/products', productRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/bookings', bookingRoutes);

app.all('*', (req, res, next) => {
  next(new AppError((`Can't find ${req.originalUrl} on this server!`, 404)));
});

app.use(globalErrorHandler);

module.exports = app;
