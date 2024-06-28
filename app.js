const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { v4: uuidv4, v4 } = require('uuid');

const { sequelize } = require('./sequelize/db');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const likeRoutes = require('./routes/likeRoutes');
const basketRoutes = require('./routes/basketRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
});
app.use('/api', limiter);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules/')));

// session
function extendDefaultFields(defaults, sessionData) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    UserAccountId: sessionData.userId,
  };
}

const myStore = new SequelizeStore({
  db: sequelize,
  table: 'UserSession',
  extendDefaultFields: extendDefaultFields,
});

// myStore.sync();

app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET,
    store: myStore,
    resave: false,
    saveUninitialized: false,
    genid: (req) => v4(),
    cookie: {
      maxAge: 6000000,
      httpOnly: true,
      sameSite: 'strict',
    },
  }),
);

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  app.use(
    session({
      cookie: {
        secure: true,
      },
    }),
  );
}

// route
app.use('/', viewRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/likes', likeRoutes);
app.use('/api/v1/baskets', basketRoutes);

// app.use('/api/v1/bookings', bookingRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
