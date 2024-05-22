const { where, Op, Sequelize } = require('sequelize');
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

module.exports.getOverview = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({ limit: 5 });
  const brands = await Brand.findAll({ limit: 6 });

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
        attributes: [], // We don't need any attributes from Variant itself
      },
      {
        model: ProductGender,
        attributes: [], // The attributes are referenced via sequelize.col
      },
      {
        model: Brand,
        attributes: [], // The attributes are referenced via sequelize.col
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

  console.log(AllProducts);

  const trendsproducts = await Product.findAll({
    limit: 8,
    order: [['productCreatedAt', 'DESC']],
    include: [
      {
        model: ProductGender,
      },
    ],
    raw: true,
    nest: true,
  });

  // console.log(trendsproducts);

  res.status(200).render('overview', {
    categories,
    products: AllProducts,
    trendsproducts,
    brands,
  });
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

module.exports.getProductsGender = catchAsync(async (req, res, next) => {
  const genderId = req.params.id;

  const products = await Product.findAll({
    include: [
      {
        model: ProductGender,
        where: { id: genderId },
      },
      {
        model: Brand,
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
    return next(new AppError('No products found for this Gender!', 404));
  }

  console.log(products[0]);

  res.status(200).render('productsGender', { products });
});

module.exports.getProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  const product = await Product.findOne({
    where: { id: productId },
    include: [ProductGender, Brand],
  });
  if (!product) {
    return next(new AppError('No id or colors found for this product!', 404));
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

  if (!variantColors) {
    return next(new AppError('No id or colors found for this product!', 404));
  }
  console.log('variantColors', variantColors);

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
  console.log('uniqueColors', uniqueColors);

  // // Get default size of selected color
  // const defaultSizes = await Variant.findAll({
  //   where: {
  //     id: variantIdArr,
  //   },
  //   include: [
  //     {
  //       model: Attribute,
  //       where: {
  //         type: 'size',
  //       },
  //       through: { attributes: [] },
  //       attributes: ['value'],
  //     },
  //   ],
  //   // attributes: ['id', 'price', 'qtyInStock'],
  //   raw: true,
  //   nest: true,
  // });

  // console.log('defaultSizes', defaultSizes);

  // if (!defaultSizes) {
  //   return next(new AppError('No sizes found!', 404));
  // }

  // Remove duplicate ones
  // const uniqueSizes = [...new Set(defaultSizes.map((uniq) => uniq))];
  // console.log('uniqueSizes', uniqueSizes);

  res.status(200).render('product4', {
    product,
    uniqueColors,
  });
});

module.exports.getSizes = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { color } = req.query;

  console.log(`ProductId: ${id}, Color: ${color}`);

  const varSizeId = await Variant.findAll({
    where: { ProductId: id },
    include: [
      {
        model: Attribute,
        where: { type: 'color', value: color },
        through: { attributes: [] },
      },
    ],
    attributes: ['id'],
    raw: true,
    nest: true,
  });

  console.log('varSizeId', varSizeId);

  //   // Get colors vId
  const UniqueSize = varSizeId
    .filter(el => el.Attributes.value === color)
    .map(el => el.id);
  console.log('UniqueSize', UniqueSize);

  const sizes = await Variant.findAll({
    where: { id: UniqueSize },
    include: [
      {
        model: Attribute,
        where: { type: 'size' },
        through: { attributes: [] },
        attributes: ['value'],
      },
    ],
    attributes: [],
    raw: true,
    nest: true,
  });

  console.log(sizes);

  if (!sizes) {
    return res.status(404).json({ status: 'fail', message: 'Sizes not found' });
  }

  res.status(200).json({
    status: 'success',
    sizes: sizes.map((size) => size.Attributes.value),
  });
});

module.exports.getProductPrice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { color, size } = req.query;

  // Fetch the variant with the specified color and size
  const variant = await Variant.findOne({
    where: { ProductId: id },
    include: [
      {
        model: Attribute,
        where: { type: 'color', value: color },
        through: { attributes: [] },
      },
      {
        model: Attribute,
        where: { type: 'size', value: size },
        through: { attributes: [] },
      },
    ],
  });

  if (!variant) {
    return res.status(404).json({ status: 'fail', message: 'Variant not found' });
  }

  res.status(200).json({ status: 'success', price: variant.price });
});


// module.exports.getProduct = catchAsync(async (req, res, next) => {
//   const productId = req.params.id;

//   const product = await Product.findOne({
//     where: { id: productId },
//     include: [ProductGender, Brand],
//   });
//   if (!product) {
//     return next(new AppError('No id or colors found for this product!', 404));
//   }

//   // Get all the colors
//   const variantColors = await Variant.findAll({
//     where: {
//       ProductId: productId,
//     },
//     include: [
//       {
//         model: Attribute,
//         where: { type: 'color' },
//         through: {
//           attributes: [],
//         },
//         attributes: ['value'],
//       },
//     ],
//     attributes: ['id'],
//     raw: true,
//     nest: true,
//   });

//   if (!variantColors) {
//     return next(new AppError('No id or colors found for this product!', 404));
//   }
//   console.log('variantColors', variantColors);

//   // Pick up one of them for default
//   const selectedColor = variantColors[0].Attributes.value;
//   console.log('selectedColor', selectedColor);

//   // Get colors vId
//   const variantIdArr = variantColors
//     .filter(el => el.Attributes.value === selectedColor)
//     .map(el => el.id);
//   console.log('variantIdArr', variantIdArr);

//   // Remove duplicate ones
//   const uniqueColors = [
//     ...new Set(variantColors.map((uniq) => uniq.Attributes.value)),
//   ];
//   console.log('uniqueColors', uniqueColors);

//   // Get default size of selected color
//   const defaultSizes = await Variant.findAll({
//     where: {
//       id: variantIdArr,
//     },
//     include: [
//       {
//         model: Attribute,
//         where: {
//           type: 'size',
//         },
//         through: { attributes: [] },
//         attributes: ['value'],
//       },
//     ],
//     attributes: ['id', 'price', 'qtyInStock'],
//     raw: true,
//     nest: true,
//   });

//   console.log('defaultSizes', defaultSizes);

//   if (!defaultSizes) {
//     return next(new AppError('No sizes found!', 404));
//   }

//   // Remove duplicate ones
//   const uniqueSizes = [...new Set(defaultSizes.map((uniq) => uniq))];
//   console.log('uniqueSizes', uniqueSizes);

//   res.status(200).render('product2', {
//     product,
//     uniqueColors,
//     uniqueSizes,
//   });
// });
