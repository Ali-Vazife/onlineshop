const Sequelize = require('sequelize');

const sequelize = new Sequelize('ecc', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
});

// sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log('tables created successfully!');
//   })
//   .catch((err) => {
//     console.error('Unable to create table : ', err);
//   });

module.exports = sequelize;
