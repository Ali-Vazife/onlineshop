const { where } = require('sequelize');
const {
  Product,
  Category,
  ProductCategory,
  ProductGender,
  Brand,
  Discount,
  Variant,
  VariantAttribute,
  Attribute,
} = require('../sequelize/db');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

module.exports.getOverview = catchAsync(async (req, res, next) => {
  let products;

  const categories = await Category.findAll({ limit: 5 });
  const brands = await Brand.findAll({ limit: 6 });

  if (req.query.brand) {
    const brandName = req.query.brand;
    const brand = await Brand.findOne({ where: { name: brandName } });
    products = await Product.findAll({
      where: { brandId: brand.id },
      limit: 15,
      include: [
        {
          model: ProductGender,
          attributes: ['name'],
          as: 'ProductGender', // This alias should match with your association alias
        },
      ],
    });
  } else {
    products = await Product.findAll({
      // raw: true,
      limit: 15,
      include: [
        {
          model: ProductGender,
        },
      ],
    });
  }
  console.log('q:', products[0].ProductGender.dataValues.name);
  res.status(200).render('overview', { categories, products, brands });
});
