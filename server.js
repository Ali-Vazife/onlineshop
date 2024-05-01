const dotenv = require('dotenv');
const fs = require('fs');
const app = require('./app');
const sequelize = require('./util/database');
const {
  UserAccount,
  UserLogin,
  UserRole,
  UserAddress,
  UserLike,
} = require('./models/userModel');

const {
  Product,
  Category,
  Discount,
  ProductItem,
  VariationId,
  SizeOption,
  ColorOption,
} = require('./models/productModel');

process.on('uncaughtException', (err, source) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down... 🤐');
  console.log(err.name, err.message);

  const filePath = './log/error.log';
  fs.writeFileSync(filePath, `${err}:${source}\n`, { flag: 'a' });

  process.exit(1);
});

const port = process.env.PORT || 3000;
dotenv.config({ path: 'config.env' });

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database: ', error);
  });

const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECETION! Shutting down... 😬');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
