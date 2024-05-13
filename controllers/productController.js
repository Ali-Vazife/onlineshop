const factory = require('./handlerFactory');
const {
  Product,
  ProductGender,
  Category,
  ProductCategory,
  Brand,
  Discount,
  Variant,
  VariantAttribute,
  Attribute,
} = require('../sequelize/db');

// Product
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
