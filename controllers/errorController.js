const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  console.log(
    process.env.NODE_ENV === 'production',
    '!',
    typeof process.env.NODE_ENV,
    process.env.NODE_ENV,
  );

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
    console.log('OK2');
  } else if (process.env.NODE_ENV === 'production') {
    console.log('OK');
    sendErrorProd(err, req, res);
  }
};
