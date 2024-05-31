const { where, Op, Sequelize } = require('sequelize');
const { QueryTypes } = require('sequelize'); // Import QueryTypes

const { sequelize,
  Product,
  Category,
  ProductCategory,
  ProductGender,
  Brand,
  Discount,
  Variant,
  Attribute,
} = require('../sequelize/db');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

module.exports.getAllProducts = catchAsync(async (req, res, next) => {
  const brands = await Brand.findAll({ limit: 6 });

  const allProducts = await Product.findAll({
    attributes: [
      'id',
      'name',
      ['coverImage', 'imagecover'],
      [sequelize.col('Brand.id'), 'brandid'],
      [sequelize.col('Brand.name'), 'brandname'],
      [sequelize.col('ProductGender.id'), 'genderid'],
      [sequelize.col('ProductGender.name'), 'gendername'],
      [sequelize.fn('MIN', sequelize.col('Variants.price')), 'minPrice'],
      [sequelize.fn('MAX', sequelize.col('Variants.price')), 'maxPrice'],
    ],
    include: [
      {
        model: Variant,
        attributes: [],
      },
      {
        model: ProductGender,
        attributes: [],
      },
      {
        model: Brand,
        attributes: [],
      },
    ],
    group: [
      'Product.id',
      'Brand.id',
      'Brand.name',
      'ProductGender.id',
      'ProductGender.name',
    ],
    raw: true,
    nest: true,
  });

  if (!allProducts || allProducts.length === 0) {
    return next(new AppError('No products found!', 404));
  }

  res.status(200).render('allProducts', {
    products: allProducts,
    brands,
  });
});

module.exports.getOverview = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({ limit: 5 });
  const brands = await Brand.findAll({ limit: 6 });

  if (!brands || !brands.length === 0) {
    return next(new AppError('No brand found!', 404));
  };

  if (!categories || !categories.length === 0) {
    return next(new AppError('No cayegory found!', 404));
  };


  const AllProducts = await Product.findAll({
    attributes: [
      'id',
      'name',
      ['coverImage', 'imagecover'],
      [sequelize.col('Brand.id'), 'brandid'],
      [sequelize.col('Brand.name'), 'brandname'],
      [sequelize.col('ProductGender.id'), 'genderid'],
      [sequelize.col('ProductGender.name'), 'gendername'],
      [sequelize.fn('MIN', sequelize.col('Variants.price')), 'minPrice'],
      [sequelize.fn('MAX', sequelize.col('Variants.price')), 'maxPrice'],
    ],
    include: [
      {
        model: Variant,
        attributes: [],
      },
      {
        model: ProductGender,
        attributes: [],
      },
      {
        model: Brand,
        attributes: [],
      },
    ],
    group: [
      'Product.id',
      'Brand.id',
      'Brand.name',
      'ProductGender.id',
      'ProductGender.name',
    ],
    raw: true,
    nest: true,
  });

  if (!AllProducts || AllProducts.length === 0) {
    return next(new AppError('No products found for this category!', 404));
  }

  const trendsProducts = await Product.findAll({
    limit: 8,
    attributes: [
      'id',
      'name',
      ['coverImage', 'imagecover'],
      [sequelize.col('Brand.id'), 'brandid'],
      [sequelize.col('Brand.name'), 'brandname'],
      [sequelize.col('ProductGender.id'), 'genderid'],
      [sequelize.col('ProductGender.name'), 'gendername'],
      [sequelize.fn('MIN', sequelize.col('Variants.price')), 'minPrice'],
      [sequelize.fn('MAX', sequelize.col('Variants.price')), 'maxPrice'],
    ],
    include: [
      {
        model: Variant,
        attributes: [],
      },
      {
        model: ProductGender,
        attributes: [],
      },
      {
        model: Brand,
        attributes: [],
      },
    ],
    order: [['productCreatedAt', 'DESC']],
    group: [
      'Product.id',
      'Brand.id',
      'Brand.name',
      'ProductGender.id',
      'ProductGender.name',
    ],
    subQuery: false, // This ensures the main query isn't wrapped in a subquery
    raw: true,
    nest: true,
  });

  if (!trendsProducts || trendsProducts.length === 0) {
    return next(new AppError('No products found for this category!', 404));
  }

  res.status(200).render('overview', {
    categories,
    products: AllProducts,
    trendsProducts,
    brands,
  });
});

module.exports.getProductsCategory = catchAsync(async (req, res, next) => {
  const categoryId = req.params.id;

  const products = await Product.findAll({
    attributes: [
      'id',
      'name',
      ['coverImage', 'imagecover'],
      [sequelize.col('Brand.id'), 'brandid'],
      [sequelize.col('Brand.name'), 'brandname'],
      [sequelize.col('Categories.id'), 'categoryid'],
      [sequelize.col('Categories.name'), 'categoryname'],
      [sequelize.col('Categories.coverImage'), 'coverImage'],
      [sequelize.col('ProductGender.id'), 'genderid'],
      [sequelize.col('ProductGender.name'), 'gendername'],
      [sequelize.fn('MIN', sequelize.col('Variants.price')), 'minPrice'],
      [sequelize.fn('MAX', sequelize.col('Variants.price')), 'maxPrice'],
    ],
    include: [
      {
        model: Variant,
        attributes: [],
      },
      {
        model: ProductGender,
        attributes: [],
      },
      {
        model: Brand,
        attributes: [],
      },
      {
        model: Category,
        attributes: [],
        as: 'Categories',
        through: {
          model: ProductCategory,
          attributes: [],
        },
        where: { id: categoryId },
      },
    ],
    group: [
      'Product.id',
      'Brand.id',
      'Brand.name',
      'Categories.id',
      'Categories.name',
      'Categories.coverImage',
      'ProductGender.id',
      'ProductGender.name',
    ],
    raw: true,
    nest: true,
  });

  if (!products || products.length === 0) {
    return next(new AppError('No products found for this category!', 404));
  }

  res.status(200).render('productsCategory', { products });
});

module.exports.getProductsBrand = catchAsync(async (req, res, next) => {
  const brandId = req.params.id;

  const products = await Product.findAll({
    attributes: [
      'id',
      'name',
      ['coverImage', 'imagecover'],
      [sequelize.col('Brand.id'), 'brandid'],
      [sequelize.col('Brand.name'), 'brandname'],
      [sequelize.col('ProductGender.id'), 'genderid'],
      [sequelize.col('ProductGender.name'), 'gendername'],
      [sequelize.fn('MIN', sequelize.col('Variants.price')), 'minPrice'],
      [sequelize.fn('MAX', sequelize.col('Variants.price')), 'maxPrice'],
    ],
    include: [
      {
        model: Variant,
        attributes: [],
      },
      {
        model: ProductGender,
        attributes: [],
      },
      {
        model: Brand,
        attributes: [],
        where: { id: brandId },
      },
    ],
    group: [
      'Product.id',
      'Brand.id',
      'Brand.name',
      'ProductGender.id',
      'ProductGender.name',
    ],
    raw: true,
    nest: true,
  });

  if (!products || products.length === 0) {
    return next(new AppError('No products found for this brand!', 404));
  }

  res.status(200).render('productsBrand', { products });
});

module.exports.getProductsGender = catchAsync(async (req, res, next) => {
  const genderId = req.params.id;

  const products = await Product.findAll({
    attributes: [
      'id',
      'name',
      ['coverImage', 'imagecover'],
      [sequelize.col('Brand.id'), 'brandid'],
      [sequelize.col('Brand.name'), 'brandname'],
      [sequelize.col('ProductGender.id'), 'genderid'],
      [sequelize.col('ProductGender.name'), 'gendername'],
      [sequelize.fn('MIN', sequelize.col('Variants.price')), 'minPrice'],
      [sequelize.fn('MAX', sequelize.col('Variants.price')), 'maxPrice'],
    ],
    include: [
      {
        model: Variant,
        attributes: [],
      },
      {
        model: ProductGender,
        attributes: [],
        where: { id: genderId },
      },
      {
        model: Brand,
        attributes: [],
      },
    ],
    group: [
      'Product.id',
      'Brand.id',
      'Brand.name',
      'ProductGender.id',
      'ProductGender.name',
    ],
    raw: true,
    nest: true,
  });

  if (!products || products.length === 0) {
    return next(new AppError('No products found for this Gender!', 404));
  }

  res.status(200).render('productsGender', { products });
});

module.exports.getProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  const product = await Product.findOne({
    where: { id: productId },
    include: [ProductGender, Brand],
  });

  if (!product) {
    return next(new AppError('There is no product!', 404));
  }

  // Get all the colors
  const variantColors = await Variant.findAll({
    where: {
      ProductId: productId,
    },
    include: [
      {
        model: Attribute,
        where: { type: 'color' },
        through: {
          attributes: [],
        },
        attributes: ['value'],
      },
    ],
    attributes: ['id'],
    raw: true,
    nest: true,
  });

  if (!variantColors || variantColors.length === 0) {
    return next(new AppError('No colors found for this product!', 404));
  }
  // console.log('variantColors', variantColors);

  // Pick up one of them for default
  // const selectedColor = variantColors[0].Attributes.value;
  // console.log('selectedColor', selectedColor);

  // Get colors vId
  // const variantIdArr = variantColors
  //   .filter(el => el.Attributes.value === selectedColor)
  //   .map(el => el.id);
  // console.log('variantIdArr', variantIdArr);

  // Remove duplicate ones
  const uniqueColors = [
    ...new Set(variantColors.map((uniq) => uniq.Attributes.value)),
  ];
  // console.log('uniqueColors', uniqueColors);

  res.status(200).render('productDetail', {
    product,
    uniqueColors,
  });
});

module.exports.signup = catchAsync(async (req, res, next) => {
  res.status(200).render('signup');
});

module.exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render('login');
});
