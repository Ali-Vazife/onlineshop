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
  const categories = await Category.findAll({ limit: 5 });
  const brands = await Brand.findAll({ limit: 6 });
  let products;

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
          as: 'ProductGender',
        },
        {
          model: Variant,
          attributes: ['price'],
        },
      ],
      raw: true,
      nest: true,
    });
  } else {
    products = await Product.findAll({
      limit: 15,
      include: [
        {
          model: ProductGender,
        },
        {
          model: Variant,
          attributes: ['price'],
        },
      ],
      raw: true,
      nest: true,
    });
  }

  const trendsproducts = await Product.findAll({
    limit: 8,
    order: [['productCreatedAt', 'DESC']],
    include: [
      {
        model: ProductGender,
      },
      {
        model: Variant,
        attributes: ['price'],
      },
    ],
    raw: true,
    nest: true,
  });

  res
    .status(200)
    .render('overview', { categories, products, trendsproducts, brands });
});
