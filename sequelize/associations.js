module.exports.applyAssociations = (userModel, productModel) => {
  const { UserAccount, UserLogin, UserRole, UserAddress, UserLike } = userModel;
  const {
    Product,
    Category,
    Discount,
    ProductItem,
    VariationId,
    SizeOption,
    ColorOption,
  } = productModel;

  // User
  UserAccount.hasOne(UserLogin);
  UserLogin.belongsTo(UserAccount);

  UserAccount.hasOne(UserAddress);
  UserAddress.belongsTo(UserAccount);

  // UserAccount.hasMany(UserLike);
  // UserLike.belongsTo(UserAccount);

  UserAccount.hasOne(UserRole);
  UserRole.belongsTo(UserAccount);

  // Product
  Product.belongsTo(Category);
  Category.hasMany(Product);

  Category.hasMany(Discount);
  Discount.belongsTo(Category);

  Product.hasMany(ProductItem);
  ProductItem.belongsTo(Product);

  ProductItem.hasMany(VariationId);
  VariationId.belongsTo(ProductItem);

  SizeOption.hasMany(VariationId);
  VariationId.belongsTo(SizeOption);

  ColorOption.hasMany(VariationId);
  VariationId.belongsTo(ColorOption);

  // Junction
  UserAccount.belongsToMany(Product, { through: UserLike });
  Product.belongsToMany(UserAccount, { through: UserLike });
};
