const dotenv = require('dotenv');
const fs = require('fs');
const app = require('./app');

process.on('uncaughtException', (err, source) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down... 🤐');
  console.log(err.name, err.message);

  const filePath = './log/error.log';
  fs.writeFileSync(filePath, `${err}:${source}\n`, { flag: 'a' });

  process.exit(1);
});

const port = process.env.PORT || 3000;
dotenv.config({ path: 'config.env' });

const server = app.listen(port, async () => {
  console.log(`server is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECETION! Shutting down... 😬');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
