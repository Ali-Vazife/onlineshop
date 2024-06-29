const { UserLike } = require('../sequelize/db');

module.exports.currentUserLikedProducts = async (req, res) => {
  try {
    const currentUser = res.locals.user || null;
    let likedProducts = [];
    if (currentUser) {
      likedProducts = await UserLike.findAll({
        where: { UserAccountId: currentUser.id },
        attributes: ['ProductId'],
        raw: true,
      });
    }
    return likedProducts;
  } catch (err) {
    console.error('Something went wrong');
  }
};
