const { UserLike } = require('../sequelize/db');
const factory = require('./handlerFactory');

module.exports.like = factory.addOneLikeBasket(UserLike);
module.exports.unlike = factory.deleteOneLikeBasket(UserLike);
