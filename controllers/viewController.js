const {
  sequelize,
  Product,
  Category,
  ProductCategory,
  ProductGender,
  Brand,
  Variant,
  Attribute,
  UserLogin,
  UserBasket,
} = require('../sequelize/db');
const { currentUserLikedProducts } = require('../utils/userLikedProducts');

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

  const likedProducts = await currentUserLikedProducts(req, res);

  res.status(200).render('allProducts', {
    products: allProducts,
    brands,
    likedProducts,
  });
});

module.exports.getOverview = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({ limit: 5 });
  const brands = await Brand.findAll({ limit: 6 });

  if (!brands || !brands.length === 0) {
    return next(new AppError('No brand found!', 404));
  }

  if (!categories || !categories.length === 0) {
    return next(new AppError('No cayegory found!', 404));
  }

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

  const likedProducts = await currentUserLikedProducts(req, res);

  res.status(200).render('overview', {
    categories,
    products: AllProducts,
    trendsProducts,
    brands,
    likedProducts,
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

  const likedProducts = await currentUserLikedProducts(req, res);

  res.status(200).render('productsCategory', { products, likedProducts });
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

  const likedProducts = await currentUserLikedProducts(req, res);

  res.status(200).render('productsBrand', { products, likedProducts });
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

  const likedProducts = await currentUserLikedProducts(req, res);


  res.status(200).render('productsGender', { products, likedProducts });
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
    attributes: ['id', 'ProductId'],
    raw: true,
    nest: true,
  });

  if (!variantColors || variantColors.length === 0) {
    return next(new AppError('No colors found for this product!', 404));
  }

  const uniqueColors = [
    ...new Set(variantColors.map((uniq) => uniq.Attributes.value)),
  ];

  const currentUser = res.locals.user || null;
  const productBasket = [];
  if (currentUser) {
    const userBasket = await UserBasket.findOne({
      where: {
        UserAccountId: currentUser.id,
        VariantId: variantColors[0].id,
      },
      attributes: ['VariantId'],
      raw: true,
    });
    if (userBasket) productBasket.push(userBasket.VariantId);
  }

  res.status(200).render('productDetail', {
    product,
    uniqueColors,
    productBasket,
    variantId: variantColors[0].id,
  });
});

module.exports.signup = catchAsync(async (req, res, next) => {
  res.status(200).render('signup');
});

module.exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render('login');
});

module.exports.getAccount = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const getEmailAddress = await UserLogin.findOne({
    where: {
      UserAccountId: userId,
    },
    attributes: ['emailAddress'],
  });

  res.status(200).render('account', {
    title: 'Your account',
    emailAddress: getEmailAddress.dataValues.emailAddress,
  });
});

module.exports.myOrder = catchAsync(async (req, res, next) => {
  res.status(200).render('myOrder', {
    title: 'Your Booking',
  });
});

module.exports.myFavoriteProduct = catchAsync(async (req, res, next) => {
  const query = `
  SELECT 
    prod.id, 
    prod.name, 
    prod."coverImage", 
    prod."ShortDescription",
    brd.id AS "BrandId", 
    brd.name AS "brandName",  
    gndr.id AS "ProductGenderId",
    gndr.name AS "genderName",
    MIN(vari.price),
    MAX(vari.price)
  FROM 
    "UserLike" AS ul
  INNER JOIN 
    "Product" AS prod ON prod.id = ul."ProductId" 
  INNER JOIN  
    "Variant" AS vari ON vari."ProductId" = prod.id
  INNER JOIN 
    "Brand" AS brd ON brd.id = prod."BrandId"
  INNER JOIN 
    "ProductGender" AS gndr ON gndr.id = prod."ProductGenderId"
  WHERE 
    ul."UserAccountId" = :userId
  GROUP BY 
    prod.id, brd.id, gndr.id;
`;

  const allBasket = await sequelize.query(query, {
    replacements: { userId: req.user.id },
    type: sequelize.QueryTypes.SELECT,
  });

  if (!allBasket || allBasket.length === 0) {
    return next(new AppError('No products found!', 404));
  }

  const likedProducts = await currentUserLikedProducts(req, res);

  res.status(200).render('myFavoriteProds', {
    title: 'Your favorite products',
    products: allBasket,
    likedProducts,
  });
});

module.exports.myBasket = catchAsync(async (req, res, next) => {
  const query = `
  SELECT 
    prod.id, 
    prod.name, 
    prod."coverImage", 
    prod."ShortDescription",
    ub."VariantId",
    vari.price, 
    vari."qtyInStock", 
    brd.id AS BrandId,
    brd.name AS brand,
    gndr.id AS ProductGenderId, 
    gndr.name AS gender,
    STRING_AGG(atr.value, ',') AS attributes  FROM 
    "UserBasket" AS ub
  INNER JOIN 
    "Variant" AS vari ON vari.id = ub."VariantId"
  INNER JOIN 
    "Product" AS prod ON prod.id = vari."ProductId"
  INNER JOIN 
    "Brand" AS brd ON brd.id = prod."BrandId"
  INNER JOIN 
    "ProductGender" AS gndr ON gndr.id = prod."ProductGenderId"
  INNER JOIN 
    "VariantAttribute" AS vat ON vat."VariantId" = vari.id
  INNER JOIN 
    "Attribute" AS atr ON atr.id = vat."AttributeId"
  WHERE 
    ub."UserAccountId" = :userId
  GROUP BY 
    prod.id, ub."VariantId", vari.id, brd.id, gndr.id;
`;

  const allBasket = await sequelize.query(query, {
    replacements: { userId: req.user.id },
    type: sequelize.QueryTypes.SELECT,
  });

  if (!allBasket || allBasket.length === 0) {
    return next(new AppError('No products found!', 404));
  }

  const likedProducts = await currentUserLikedProducts(req, res);

  res.status(200).render('MyBasket', {
    title: 'Your basket',
    products: allBasket,
    likedProducts,
  });
});
