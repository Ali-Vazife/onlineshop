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

  const products = await Product.findAll({
    limit: 15,
    include: [
      {
        model: ProductGender,
      },
      {
        model: Variant,
        attributes: ['price', 'qtyInStock'],
      },
    ],
    attributes: {
      exclude: ['productCreatedAt', 'productUpdatedAt', 'ShortDescription'],
    },
    raw: true,
    nest: true,
  });

  const trendsproducts = await Product.findAll({
    limit: 8,
    order: [['productCreatedAt', 'DESC']],
    include: [
      {
        model: ProductGender,
      },
      {
        model: Variant,
        attributes: ['price', 'qtyInStock'],
      },
    ],
    raw: true,
    nest: true,
  });

  res
    .status(200)
    .render('overview', { categories, products, trendsproducts, brands });
});

module.exports.getProductsCategory = catchAsync(async (req, res, next) => {
  const categoryId = req.params.id;

  const products = await Product.findAll({
    include: [
      {
        model: Category,
        where: { id: categoryId },
        through: {
          model: ProductCategory,
        },
      },
      {
        model: ProductGender,
      },
      {
        model: Variant,
        attributes: ['price', 'qtyInStock'],
      },
    ],
    attributes: {
      exclude: ['productCreatedAt', 'productUpdatedAt', 'ShortDescription'],
    },
    raw: true,
    nest: true,
  });

  console.log(products[0]);

  if (!products || products.length === 0) {
    return next(new AppError('No products found for this category!', 404));
  }

  res.status(200).render('productsCategory', { products });
});

module.exports.getProductsBrand = catchAsync(async (req, res, next) => {
  const brandId = req.params.id;

  const products = await Product.findAll({
    include: [
      {
        model: Brand,
        where: { id: brandId },
      },
      {
        model: ProductGender,
      },
      {
        model: Variant,
        attributes: ['price', 'qtyInStock'],
      },
    ],
    attributes: {
      exclude: ['productCreatedAt', 'productUpdatedAt', 'ShortDescription'],
    },
    raw: true,
    nest: true,
  });

  if (!products || products.length === 0) {
    return next(new AppError('No products found for this brand!', 404));
  }

  console.log(products[0]);

  res.status(200).render('productsBrand', { products });
});
