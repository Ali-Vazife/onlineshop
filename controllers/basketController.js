const { UserBasket } = require('../sequelize/db');
const factory = require('./handlerFactory');

module.exports.addToBasket = factory.addOneLikeBasket(UserBasket);
module.exports.removeFromBasket = factory.deleteOneLikeBasket(UserBasket);
