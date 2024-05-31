const { sequelize } = require('../sequelize/db');

const categories = [
  { name: 'Sneakers', coverImage: 'collection-1.jpg' },
  { name: 'Boots', coverImage: 'collection-2.jpg' },
  { name: 'Sandals', coverImage: 'collection-3.jpg' },
];

const brands = [{ name: 'Nike' }, { name: 'Adidas' }, { name: 'Puma' }];

const ProductGenders = [
  { name: 'Men', coverImage: 'manCategory.jpg' },
  { name: 'Women', coverImage: 'womanCategory.jpg' },
  { name: 'Unisex', coverImage: 'manCategory.jpg' },
];

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
    BrandId: 1,
    ProductGenderId: 2,
  },
  {
    name: 'Adidas Superstar',
    ShortDescription: 'Classic sneakers',
    coverImage: 'product-2.jpg',
    BrandId: 2,
    ProductGenderId: 3,
  },
  {
    name: 'Puma RS-X',
    ShortDescription: 'Retro sneakers',
    coverImage: 'product-3.jpg',
    BrandId: 3,
    ProductGenderId: 1,
  },
  {
    name: 'Nike Air Force 1',
    ShortDescription: 'Iconic sneakers',
    coverImage: 'product-4.jpg',
    BrandId: 1,
    ProductGenderId: 3,
  },
  {
    name: 'Timberland 6-Inch Premium',
    ShortDescription: 'Classic boots',
    coverImage: 'product-5.jpg',
    BrandId: 1,
    ProductGenderId: 2,
  },
  {
    name: 'Dr. Martens 1460',
    ShortDescription: 'Iconic boots',
    coverImage: 'product-6.jpg',
    BrandId: 2,
    ProductGenderId: 3,
  },
  {
    name: 'Adidas Adilette',
    ShortDescription: 'Slide sandals',
    coverImage: 'product-7.jpg',
    BrandId: 2,
    ProductGenderId: 3,
  },
];

const variant = [
  { ProductId: 1, price: 99.99, qtyInStock: 10, skuNumber: 54321 },
  { ProductId: 1, price: 89.99, qtyInStock: 25, skuNumber: 54321 },
  { ProductId: 1, price: 79.99, qtyInStock: 50, skuNumber: 12345 },
  { ProductId: 2, price: 59.99, qtyInStock: 20, skuNumber: 98765 },
  { ProductId: 3, price: 59.99, qtyInStock: 20, skuNumber: 98765 },
  { ProductId: 4, price: 70.99, qtyInStock: 10, skuNumber: 32134 },
  { ProductId: 4, price: 80.88, qtyInStock: 11, skuNumber: 51134 },
  { ProductId: 5, price: 65.78, qtyInStock: 75, skuNumber: 24132 },
  { ProductId: 6, price: 32.12, qtyInStock: 75, skuNumber: 43253 },
  { ProductId: 7, price: 32.78, qtyInStock: 88, skuNumber: 43221 },
];

const attribute = [
  { type: 'size', value: '10' },
  { type: 'size', value: '46' },
  { type: 'size', value: '34' },
  { type: 'color', value: 'red' },
  { type: 'color', value: 'green' },
  { type: 'color', value: 'yellow' },
];

const variantAttribute = [
  { VariantId: 3, AttributeId: 5 },
  { VariantId: 4, AttributeId: 5 },
  { VariantId: 5, AttributeId: 3 },
  { VariantId: 5, AttributeId: 6 },
  { VariantId: 6, AttributeId: 3 },
  { VariantId: 6, AttributeId: 6 },
  { VariantId: 8, AttributeId: 1 },
  { VariantId: 8, AttributeId: 4 },
  { VariantId: 9, AttributeId: 2 },
  { VariantId: 9, AttributeId: 5 },
  { VariantId: 10, AttributeId: 2 },
  { VariantId: 10, AttributeId: 4 },
  { VariantId: 1, AttributeId: 2 },
  { VariantId: 2, AttributeId: 5 },
  { VariantId: 1, AttributeId: 4 },
  { VariantId: 3, AttributeId: 1 },
  { VariantId: 2, AttributeId: 3 },
  { VariantId: 7, AttributeId: 2 },
  { VariantId: 7, AttributeId: 4 },
  { VariantId: 4, AttributeId: 3 },
];

const productCategory = [
  { ProductId: 1, CategoryId: 1 },
  { ProductId: 2, CategoryId: 2 },
  { ProductId: 3, CategoryId: 3 },
  { ProductId: 3, CategoryId: 2 },
  { ProductId: 4, CategoryId: 1 },
  { ProductId: 5, CategoryId: 3 },
  { ProductId: 6, CategoryId: 2 },
  { ProductId: 7, CategoryId: 1 },
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
      await sequelize.models.ProductGender.bulkCreate(ProductGenders, {
        transaction: t,
      });
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
      await sequelize.models.ProductCategory.bulkCreate(productCategory, {
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
