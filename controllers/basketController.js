const { UserBasket, sequelize } = require('../sequelize/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.addToBasket = catchAsync(async (req, res, next) => {
  const UserAccountId = req.user.id;
  const VariantId = req.body.variantId;

  if (!UserAccountId || !VariantId) {
    return next(new AppError('User or Product does not exist!', 401));
  }

  const isExist = await UserBasket.findOne({
    where: { UserAccountId, VariantId },
  });

  if (isExist) {
    return res.status(200).json({ status: 'Already exist in your account!' });
  }

  const addVariant = await UserBasket.create({ UserAccountId, VariantId });
  res.status(200).json({ status: 'success', data: addVariant });
});

module.exports.isInTheBasket = catchAsync(async (req, res, next) => {
  const UserAccountId = req.user.id;
  const VariantId = req.params.id;

  if (!UserAccountId || !VariantId) {
    return next(new AppError('User or Product does not exist!', 401));
  }

  const isExist = await UserBasket.findOne({
    where: { UserAccountId, VariantId },
  });

  if (!isExist) {
    return res
      .status(200)
      .json({ status: 'Is not in your basket.', data: 'n' });
  }

  res.status(200).json({ status: 'This variant already exist!', data: 'y' });
});

module.exports.removeFromBasket = catchAsync(async (req, res, next) => {
  const UserAccountId = req.user.id;
  const VariantId = req.body.variantId;

  if (!UserAccountId || !VariantId) {
    return next(new AppError('User or Product does not exist!', 401));
  }

  await UserBasket.destroy({
    where: { UserAccountId, VariantId },
  });

  res.status(200).json({ status: 'success' });
});

module.exports.myBasket = catchAsync(async (req, res, next) => {
  const query = `
  SELECT 
    prod.id, 
    prod.name, 
    prod."coverImage", 
    prod."ShortDescription",
    ub."VariantId",
    vari.price, 
    vari."qtyInStock", 
    brd.id AS BrandId,
    brd.name AS brand,
    gndr.id AS ProductGenderId, 
    gndr.name AS gender,
    STRING_AGG(atr.value, ',') AS attributes  FROM 
    "UserBasket" AS ub
  INNER JOIN 
    "Variant" AS vari ON vari.id = ub."VariantId"
  INNER JOIN 
    "Product" AS prod ON prod.id = vari."ProductId"
  INNER JOIN 
    "Brand" AS brd ON brd.id = prod."BrandId"
  INNER JOIN 
    "ProductGender" AS gndr ON gndr.id = prod."ProductGenderId"
  INNER JOIN 
    "VariantAttribute" AS vat ON vat."VariantId" = vari.id
  INNER JOIN 
    "Attribute" AS atr ON atr.id = vat."AttributeId"
  WHERE 
    ub."UserAccountId" = :userId
  GROUP BY 
    prod.id, ub."VariantId", vari.id, brd.id, gndr.id;
`;

  const allBasket = await sequelize.query(query, {
    replacements: { userId: req.user.id },
    type: sequelize.QueryTypes.SELECT,
  });

  if (!allBasket || allBasket.length === 0) {
    return next(new AppError('No products found!', 404));
  }

  res.status(200).json({ status: 'success', products: allBasket });
});
