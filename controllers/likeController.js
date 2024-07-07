const { sequelize, UserLike } = require('../sequelize/db');

const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.like = factory.addOneLikeBasket(UserLike);
module.exports.unlike = factory.deleteOneLikeBasket(UserLike);
module.exports.myFavoriteProduct = catchAsync(async (req, res, next) => {
  const query = `
  SELECT 
    prod.id, 
    prod.name, 
    prod."coverImage", 
    prod."ShortDescription",
    brd.id AS "BrandId", 
    brd.name AS "brandName",  
    gndr.id AS "ProductGenderId",
    gndr.name AS "genderName",
    MIN(vari.price),
    MAX(vari.price)
  FROM 
    "UserLike" AS ul
  INNER JOIN 
    "Product" AS prod ON prod.id = ul."ProductId" 
  INNER JOIN  
    "Variant" AS vari ON vari."ProductId" = prod.id
  INNER JOIN 
    "Brand" AS brd ON brd.id = prod."BrandId"
  INNER JOIN 
    "ProductGender" AS gndr ON gndr.id = prod."ProductGenderId"
  WHERE 
    ul."UserAccountId" = :userId
  GROUP BY 
    prod.id, brd.id, gndr.id;
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
