const { sequelize } = require('../sequelize/db');

const categories = [
  { name: 'Sneakers' },
  { name: 'Boots' },
  { name: 'Sandals' },
];

const brands = [{ name: 'Nike' }, { name: 'Adidas' }, { name: 'Puma' }];

const discounts = [
  {
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-05-31'),
    percent: 10,
    quantity: 100,
    description: 'May Sale',
  },
  {
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-30'),
    percent: 15,
    quantity: 200,
    description: 'June Sale',
  },
];

const products = [
  {
    name: 'Nike Air Max 270',
    ShortDescription: 'Running sneakers',
    coverImage: 'air_max_270.jpg',
    CategoryId: 1,
    BrandId: 1,
  },
  {
    name: 'Adidas Superstar',
    ShortDescription: 'Classic sneakers',
    coverImage: 'superstar.jpg',
    CategoryId: 1,
    BrandId: 2,
  },
  {
    name: 'Puma RS-X',
    ShortDescription: 'Retro sneakers',
    coverImage: 'rs_x.jpg',
    CategoryId: 1,
    BrandId: 3,
  },
  {
    name: 'Nike Air Force 1',
    ShortDescription: 'Iconic sneakers',
    coverImage: 'air_force_1.jpg',
    CategoryId: 1,
    BrandId: 1,
  },
  {
    name: 'Timberland 6-Inch Premium',
    ShortDescription: 'Classic boots',
    coverImage: 'timberland.jpg',
    CategoryId: 2,
    BrandId: 1,
  },
  {
    name: 'Dr. Martens 1460',
    ShortDescription: 'Iconic boots',
    coverImage: 'dr_martens.jpg',
    CategoryId: 2,
    BrandId: 2,
  },
  {
    name: 'Adidas Adilette',
    ShortDescription: 'Slide sandals',
    coverImage: 'adilette.jpg',
    CategoryId: 3,
    BrandId: 2,
  },
];

const productItems = [
  { price: 129.99, ProductId: 1 },
  { price: 109.99, ProductId: 2 },
  { price: 89.99, ProductId: 3 },
  { price: 99.99, ProductId: 4 },
  { price: 199.99, ProductId: 5 },
  { price: 159.99, ProductId: 6 },
  { price: 49.99, ProductId: 7 },
];

const sizeOptions = [
  { option: 'US 7' },
  { option: 'US 8' },
  { option: 'US 9' },
  { option: 'US 10' },
  { option: 'US 11' },
];

const colorOptions = [
  { option: 'Black' },
  { option: 'White' },
  { option: 'Red' },
  { option: 'Blue' },
];

const variationIds = [
  { qtyInStock: 100, ProductItemId: 1, SizeOptionId: 1, ColorOptionId: 1 },
  { qtyInStock: 200, ProductItemId: 2, SizeOptionId: 2, ColorOptionId: 2 },
  { qtyInStock: 150, ProductItemId: 3, SizeOptionId: 3, ColorOptionId: 3 },
  { qtyInStock: 120, ProductItemId: 4, SizeOptionId: 4, ColorOptionId: 4 },
  { qtyInStock: 80, ProductItemId: 5, SizeOptionId: 5, ColorOptionId: 1 },
  { qtyInStock: 90, ProductItemId: 6, SizeOptionId: 1, ColorOptionId: 2 },
  { qtyInStock: 300, ProductItemId: 7, SizeOptionId: 2, ColorOptionId: 3 },
];

// Execute script to insert mock data
sequelize
  .sync({ force: true }) // Use { force: true } to drop existing tables and recreate them
  .then(() => {
    console.log('Tables created successfully');
    // applyAssociations(sequelize); // Apply associations
    return sequelize.transaction(async (t) => {
      await sequelize.models.Category.bulkCreate(categories, {
        transaction: t,
      });
      await sequelize.models.Brand.bulkCreate(brands, { transaction: t });
      await sequelize.models.Product.bulkCreate(products, { transaction: t });
      await sequelize.models.ProductItem.bulkCreate(productItems, {
        transaction: t,
      });
      await sequelize.models.SizeOption.bulkCreate(sizeOptions, {
        transaction: t,
      });
      await sequelize.models.ColorOption.bulkCreate(colorOptions, {
        transaction: t,
      });
      await sequelize.models.VariationId.bulkCreate(variationIds, {
        transaction: t,
      });
      // await sequelize.models.Discount.bulkCreate(discounts, { transaction: t });
    });
  })
  .then(() => {
    console.log('Mock data inserted successfully');
  })
  .catch((err) => {
    console.error('Error:', err);
  });
