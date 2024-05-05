const dotenv = require('dotenv');
const fs = require('fs');
const app = require('./app');

const { sequelize } = require('./sequelize/db');

const port = process.env.PORT || 3000;

dotenv.config({ path: 'config.env' });

process.on('uncaughtException', (err, source) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down... 🤐');
  console.log(err.name, err.message);

  const filePath = './log/error.log';
  fs.writeFileSync(filePath, `${err}:${source}\n`, { flag: 'a' });

  process.exit(1);
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database: ', err);
  });

sequelize
  .sync({ force: true })
  .then(() => {
    console.log('tables created successfully!');
  })
  .catch((err) => {
    console.error('Unable to create table : ', err);
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
