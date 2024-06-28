const { where, Op, Sequelize } = require('sequelize');
const { QueryTypes } = require('sequelize');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const {
  sequelize,
  Product,
  ProductGender,
  Category,
  ProductCategory,
  Brand,
  Discount,
  Variant,
  VariantAttribute,
  Attribute,
  UserLike,
} = require('../sequelize/db');

// Product
module.exports.getProductsAllBrands = catchAsync(async (req, res, next) => {
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

  const currentUser = res.locals.user || null;
  let likedProducts = [];
  if (currentUser) {
    likedProducts = await UserLike.findAll({
      where: { UserAccountId: currentUser.id },
      attributes: ['ProductId'],
      raw: true,
    });
  }

  res.status(200).json({ products, likedProducts });
});

module.exports.getSelectedProductsBrand = catchAsync(async (req, res, next) => {
  const { brandId } = req.query;

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

  const currentUser = res.locals.user || null;
  let likedProducts = [];
  if (currentUser) {
    likedProducts = await UserLike.findAll({
      where: { UserAccountId: currentUser.id },
      attributes: ['ProductId'],
      raw: true,
    });
  }

  res.status(200).json({ products, likedProducts });
});

module.exports.getSizes = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { color } = req.query;

  // console.log(`ProductId: ${id}, Color: ${color}`);

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

  // console.log('varSizeId', varSizeId);

  // Get colors vId
  const UniqueSize = varSizeId
    .filter(el => el.Attributes.value === color)
    .map(el => el.id);
  // console.log('UniqueSize', UniqueSize);

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

  // console.log(sizes);

  if (!sizes || sizes.length === 0) {
    return next(new AppError('No sizes found for this color!', 404));
  }

  // const currentUser = res.locals.user || null;
  // let basket = [];
  // if (currentUser) {
  //   basket = await UserBasket.findAll({
  //     where: { UserAccountId: currentUser.id, productId: id },
  //     attributes: ['ProductId'],
  //     raw: true,
  //   });
  // }

  // console.log(currentUser);

  res.status(200).json({
    status: 'success',
    sizes: sizes.map((size) => size.Attributes.value),
  });
});

module.exports.getProductPrice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { color, size } = req.query;
  // console.log('id,color,size:', id, color, size);

  const sqlQuery = `
  SELECT v.id, v.price, v."ProductId", v."qtyInStock"
  FROM "Variant" AS v
  WHERE v."ProductId" = :productId
  AND v.id IN (
    SELECT v2.id 
    FROM "Variant" AS v2
    INNER JOIN "VariantAttribute" AS va ON v2.id = va."VariantId"
    INNER JOIN "Attribute" AS a ON va."AttributeId" = a.id
    WHERE a."type" = 'color' AND a."value" = :color
    AND v2.id IN (
      SELECT v3.id 
      FROM "Variant" AS v3
      INNER JOIN "VariantAttribute" AS va2 ON v3.id = va2."VariantId"
      INNER JOIN "Attribute" AS a2 ON va2."AttributeId" = a2.id
      WHERE a2."type" = 'size' AND a2."value" = :size
    )
  )
`;

  // Execute the SQL query with replacements for placeholders
  const variant = await sequelize.query(sqlQuery, {
    replacements: { productId: id, color, size },
    type: QueryTypes.SELECT,
  });

  if (!variant || variant.length === 0) {
    return next(new AppError('No price found for this product!', 404));
  }

  // const currentUser = res.locals.user || null;
  // let likedProducts = [];
  // if (currentUser) {
  //   likedProducts = await UserLike.findAll({
  //     where: { UserAccountId: currentUser.id },
  //     attributes: ['ProductId'],
  //     raw: true,
  //   });
  // }

  res.status(200).json({ status: 'success', price: variant });
});

//    factory
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

// Product Gender
exports.getAllProductGenders = factory.getAll(ProductGender);
exports.getProductGender = factory.getOne(ProductGender);
exports.createProductGender = factory.createOne(ProductGender);
exports.updateProductGender = factory.updateOne(ProductGender);
exports.deleteProductGender = factory.deleteOne(ProductGender);

// Category
exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);

// Brand
exports.getAllBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.createBrand = factory.createOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);

// Discount
exports.getAllDiscounts = factory.getAll(Discount);
exports.getDiscount = factory.getOne(Discount);
exports.createDiscount = factory.createOne(Discount);
exports.updateDiscount = factory.updateOne(Discount);
exports.deleteDiscount = factory.deleteOne(Discount);

// Variant
exports.getAllVariants = factory.getAll(Variant);
exports.getVariant = factory.getOne(Variant);
exports.createVariant = factory.createOne(Variant);
exports.updateVariant = factory.updateOne(Variant);
exports.deleteVariant = factory.deleteOne(Variant);

// Attribute
exports.getAllAttributes = factory.getAll(Attribute);
exports.getAttribute = factory.getOne(Attribute);
exports.createAttribute = factory.createOne(Attribute);
exports.updateAttribute = factory.updateOne(Attribute);
exports.deleteAttribute = factory.deleteOne(Attribute);

// Variant Attribute (Junction)
exports.getAllVariantsAttributes = factory.getAll(VariantAttribute);
exports.createVariantAttribute = factory.createOne(VariantAttribute);
exports.getVariantAttribute = factory.junctionGetOne(
  VariantAttribute,
  'VariantId',
  'AttributeId',
);
exports.updateVariantAttribute = factory.junctionUpdateOne(
  VariantAttribute,
  'VariantId',
  'AttributeId',
);
exports.deleteVariantAttribute = factory.junctionDeleteOne(
  VariantAttribute,
  'VariantId',
  'AttributeId',
);

// product category (Junction)
exports.getAllProductCategories = factory.getAll(ProductCategory);
exports.createProductCategory = factory.createOne(ProductCategory);
exports.getProductCategory = factory.junctionGetOne(
  ProductCategory,
  'ProductId',
  'CategoryId',
);
exports.updateProductCategory = factory.junctionUpdateOne(
  ProductCategory,
  'ProductId',
  'CategoryId',
);
exports.deleteProductCategory = factory.junctionDeleteOne(
  ProductCategory,
  'ProductId',
  'CategoryId',
);
