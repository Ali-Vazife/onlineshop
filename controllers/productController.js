const catchAsync = require('../utils/catchAsync');
const { Product,
  Category,
  Brand,
  Discount,
  ProductItem,
  VariationId,
  SizeOption,
  ColorOption,
} = require('../sequelize/db');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll();
  console.log('products:', products);

  res.status(200).json({ status: 'success!', data: { products } });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll();
  console.log('categories:', categories);

  res.status(200).json({ status: 'success!', data: { categories } });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findbyByPk();
  console.log('product:', product);

  res.status(200).json({ status: 'success!', data: { product } });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  // const product = Product.create(req.params)
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.destroy(id);
  console.log('product:', product);

  res.status(200).json({ status: 'success!', data: { product } });
});
