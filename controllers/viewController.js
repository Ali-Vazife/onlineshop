const { where, Op } = require('sequelize');
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
    where: {
      id: productId,
    },
    include: [
      {
        model: ProductGender,
      },
      {
        model: Brand,
      },
    ],
    exclude: ['productCreatedAt', 'productUpdatedAt'],
    raw: true,
    nest: true,
  });

  console.log('product', product);

  if (!product) {
    return next(new AppError('No id or colors found for this product!', 404));
  }

  // ------------------------------------------
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

  const defaultColor = variantColors[0].Attributes.value;
  console.log('defaultColor', variantColors);

  let variantIdArr = [];
  variantColors.forEach((el) => {
    if (el.Attributes.value === variantColors[0].Attributes.value) {
      variantIdArr.push(el.id);
    }
  });

  const uniqueColors = [
    ...new Set(variantColors.map((uniq) => uniq.Attributes.value)),
  ];
  console.log('uniqueColors', uniqueColors);

  console.log('variantIdArr', variantIdArr);

  // ------------------------------------------
  const defaultProduct = await Variant.findAll({
    where: [{ ProductId: productId }, { id: variantIdArr }],
    include: [
      {
        model: Attribute,
        where: {
          type: 'size',
        },
        through: { attributes: [] },
        attributes: ['value'],
      },
    ],
    attributes: ['id', 'price', 'qtyInStock'],
    raw: true,
    nest: true,
  });

  console.log('defaultProduct', defaultProduct);

  if (!defaultProduct) {
    return next(new AppError('No sizes found for this color!', 404));
  }

  // const defaultPriceSize = defaultProduct.Attributes.value;
  // console.log(defaultPriceSize);

  res.status(200).render('product', {
    product,
    // variantColors,
    uniqueColors,
    defaultProduct,
  });
});

// ------------------------------------------
// Fetch price for the default color and size
// const priceQuery = await Product.findOne({
//   where: { id: productId },
//   include: {
//     model: Variant,
//     attributes: ['price'],
//     include: [
//       {
//         model: Attribute,
//         where: { type: 'color', value: defaultColor },
//         through: { attributes: [] }, // Do not fetch data from the join table
//         attributes: [],
//       },
//       {
//         model: Attribute,
//         where: { type: 'size', value: defaultPriceSize },
//         through: { attributes: [] }, // Do not fetch data from the join table
//         attributes: [],
//       },
//     ],
//   },
//   attributes: [],
//   raw: true,
// });

// console.log('priceQuery', priceQuery);

// const price = priceQuery ? priceQuery['Variants.price'] : null;

// module.exports.getProduct = catchAsync(async (req, res, next) => {
//   const productId = req.params.id;

//   const product = await Product.findOne({
//     where: {
//       id: productId,
//     },
//     include: [
//       {
//         model: ProductGender,
//       },
//       {
//         model: Brand,
//       },
//       // {
//       //   model: Variant,
//       //   attributes: ['price', 'qtyInStock'],
//       //   include: [
//       //     {
//       //       model: Attribute,
//       //       through: {
//       //         model: VariantAttribute,
//       //       },
//       //     },
//       //   ],
//       // },
//     ],
//     attributes: {
//       exclude: ['productCreatedAt', 'productUpdatedAt'],
//     },
//     raw: true,
//     nest: true,
//   });

//   if (!product || product.length === 0) {
//     return next(new AppError('No product found!', 404));
//   }

//   const variants = await Variant.findAll({
//     where: {
//       ProductId: productId,
//     },
//     include: [
//       {
//         model: Attribute,
//         through: {
//           model: VariantAttribute,
//         },
//       },
//     ],
//     raw: true,
//     nest: true,
//   });

//   console.log(variants);

//   // Group attributes by variant
//   // const groupedVariants = {};
//   // variants.forEach((variant) => {
//   //   if (!groupedVariants[variant.id]) {
//   //     groupedVariants[variant.id] = {
//   //       ...variant,
//   //       attributes: [],
//   //     };
//   //   }
//   //   if (variant.Attributes) {
//   //     groupedVariants[variant.id].attributes.push({
//   //       type: variant.Attributes.type,
//   //       value: variant.Attributes.value,
//   //     });
//   //   }
//   // });

//   // // Convert grouped variants to array
//   // const variantArray = Object.values(groupedVariants);
//   // console.log('variantArray', variantArray);

//   res.status(200).render('product', { product, variants });
//   // const variant = await Variant.findOne({
//   //   where: {
//   //     ProductId: productId,
//   //   },
//   //   include: [
//   //     {
//   //       model: Product,
//   //       include: [
//   //         {
//   //           model: Brand,
//   //         },
//   //       ],
//   //     },
//   //     // {
//   //     //   model: Brand,
//   //     // },
//   //     // {
//   //     //   model: ProductGender,
//   //     // },
//   //     {
//   //       model: Attribute,
//   //       through: {
//   //         model: VariantAttribute,
//   //       },
//   //     },
//   //   ],
//   //   attributes: {
//   //     exclude: ['productCreatedAt', 'productUpdatedAt', 'ShortDescription'],
//   //   },
//   //   raw: true,
//   //   nest: true,
//   // });

//   // console.log(variant);

//   // res.status(200).render('variant', { variant });
// });


// const availableSizes = await Product.findAll({
//   where: { id: productId },
//   include: {
//     model: Variant,
//     attributes: [],
//     include: [
//       {
//         model: Attribute,
//         where: { type: 'size' },
//         through: { attributes: [] }, // Do not fetch data from the join table
//         attributes: ['value'],
//       },
//       {
//         model: Attribute,
//         where: { type: 'color', value: defaultColor },
//         through: { attributes: [] }, // Do not fetch data from the join table
//       },
//     ],
//   },
//   // attributes: [],
//   // group: ['Attribute.value'],
//   // order: [['Attribute', 'value', 'ASC']],
//   raw: true,
//   nest: true,
// });


// Fetch available sizes for the default color
// const availableSizes = await Variant.findAll({
//   where: {
//     ProductId: productId,
//   },
//   include: [
//     {
//       model: Attribute,
//       where: {
//         type: 'size',
//       },
//       through: { model: VariantAttribute, attributes: [] },
//       attributes: ['value'],
//     },
//     {
//       model: Attribute,
//       where: { type: 'color', value: defaultColor },
//       through: { model: VariantAttribute, attributes: [] },
//       attributes: ['value'],
//     },
//   ],
//   attributes: [],
//   // group: ['Attribute.value'],
//   // order: [['Attribute', 'value', 'ASC']],
//   raw: true,
//   nest: true,
// });
