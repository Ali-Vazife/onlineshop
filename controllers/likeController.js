const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { UserLike } = require('../sequelize/db');
const { where } = require('sequelize');

module.exports.like = catchAsync(async (req, res, next) => {
  const UserAccountId = req.user.id;
  const ProductId = req.body.productId;

  if (!UserAccountId || !ProductId) {
    return next(new AppError('User ID or Product ID does not exist!', 401));
  }

  const isLiked = await UserLike.findOne({
    where: { UserAccountId, ProductId },
  });

  if (isLiked) {
    return res.status(200).json({ status: 'success' });
  }

  const newLike = await UserLike.create({ UserAccountId, ProductId });
  res.status(200).json({ status: 'success', data: newLike });
});

module.exports.unlike = catchAsync(async (req, res, next) => {
  const UserAccountId = req.user.id;
  const ProductId = req.body.productId;

  if (!UserAccountId || !ProductId) {
    return next(new AppError('User ID or Product ID does not exist!', 401));
  }

  await UserLike.destroy({
    where: { UserAccountId, ProductId },
  });

  res.status(200).json({ status: 'success' });

  // const UserAccountId = req.user.id;
  // const ProductId = req.body.productid;

  // await UserLike.destroy({
  //   where: {
  //     UserAccountId: UserAccountId,
  //     ProductId: ProductId,
  //   },
  // });

  // const isLiked = await UserLike.findOne({
  //   where: { UserAccountId, ProductId },
  // });
  // if (isLiked) return res.status(200).json({ status: 'success' });
  // if (!UserAccountId || !ProductId) {
  //   return next(new AppError('userId or productId is not exist!', 401));
  // }
  // const newLike = await UserLike.create({ UserAccountId, ProductId });
  // console.log(newLike);
  // res.status(204).json({ status: 'successfuly deleted!' });
});
