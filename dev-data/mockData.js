const { sequelize } = require('../sequelize/db');

const categories = [
  { name: 'Sneakers', imageCover: 'collection-1.jpg' },
  { name: 'Boots', imageCover: 'collection-2.jpg' },
  { name: 'Sandals', imageCover: 'collection-3.jpg' },
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
    coverImage: 'product-1.jpg',
    CategoryId: 1,
    BrandId: 1,
  },
  {
    name: 'Adidas Superstar',
    ShortDescription: 'Classic sneakers',
    coverImage: 'product-2.jpg',
    CategoryId: 1,
    BrandId: 2,
  },
  {
    name: 'Puma RS-X',
    ShortDescription: 'Retro sneakers',
    coverImage: 'product-3.jpg',
    CategoryId: 1,
    BrandId: 3,
  },
  {
    name: 'Nike Air Force 1',
    ShortDescription: 'Iconic sneakers',
    coverImage: 'product-4.jpg',
    CategoryId: 1,
    BrandId: 1,
  },
  {
    name: 'Timberland 6-Inch Premium',
    ShortDescription: 'Classic boots',
    coverImage: 'product-5.jpg',
    CategoryId: 2,
    BrandId: 1,
  },
  {
    name: 'Dr. Martens 1460',
    ShortDescription: 'Iconic boots',
    coverImage: 'product-6.jpg',
    CategoryId: 2,
    BrandId: 2,
  },
  {
    name: 'Adidas Adilette',
    ShortDescription: 'Slide sandals',
    coverImage: 'product-7.jpg',
    CategoryId: 3,
    BrandId: 2,
  },
];

const variant = [
  { ProductId: 1, price: 99.99, qtyInStock: 50, skuNumber: 12345 },
  { ProductId: 2, price: 79.99, qtyInStock: 30, skuNumber: 54321 },
  { ProductId: 3, price: 59.99, qtyInStock: 20, skuNumber: 98765 },
];

const attribute = [
  { type: 'size', value: '10' },
  { type: 'color', value: 'red' },
];

const variantAttribute = [
  { VariantId: 1, AttributeId: 1 },
  { VariantId: 1, AttributeId: 2 },
  { VariantId: 2, AttributeId: 1 },
  { VariantId: 2, AttributeId: 2 },
  { VariantId: 3, AttributeId: 1 },
  { VariantId: 3, AttributeId: 2 },
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
      await sequelize.models.Attribute.bulkCreate(attribute, {
        transaction: t,
      });
      await sequelize.models.Variant.bulkCreate(variant, {
        transaction: t,
      });
      await sequelize.models.VariantAttribute.bulkCreate(variantAttribute, {
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
