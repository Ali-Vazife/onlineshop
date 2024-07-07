module.exports.applyAssociations = (userModel, productModel) => {
  const {
    UserAccount,
    UserSession,
    UserLogin,
    UserRole,
    UserAddress,
    UserLike,
    UserBasket,
  } = userModel;
  const {
    Product,
    Category,
    ProductCategory,
    ProductGender,
    Brand,
    Discount,
    Variant,
    Attribute,
    VariantAttribute,
  } = productModel;

  // User
  UserAccount.hasOne(UserLogin, {
    onDelete: 'CASCADE',
  });
  UserLogin.belongsTo(UserAccount);

  UserAccount.hasMany(UserSession);
  UserSession.belongsTo(UserAccount);

  UserAccount.hasOne(UserAddress);
  UserAddress.belongsTo(UserAccount);

  UserAccount.belongsTo(UserRole);

  // Product
  Category.hasMany(Discount);
  Discount.belongsTo(Category);

  Brand.hasMany(Product);
  Product.belongsTo(Brand);

  ProductGender.hasMany(Product);
  Product.belongsTo(ProductGender);

  Product.hasMany(Variant);
  Variant.belongsTo(Product);

  // Junction
  Product.belongsToMany(Category, { through: ProductCategory });
  Category.belongsToMany(Product, { through: ProductCategory });

  UserAccount.belongsToMany(Product, {
    through: UserLike,
    as: 'LikedProducts',
  });
  Product.belongsToMany(UserAccount, { through: UserLike, as: 'LikedByUsers' });

  UserAccount.belongsToMany(Variant, {
    through: UserBasket,
  });
  Variant.belongsToMany(UserAccount, {
    through: UserBasket,
  });

  Variant.belongsToMany(Attribute, { through: VariantAttribute });
  Attribute.belongsToMany(Variant, { through: VariantAttribute });
};
