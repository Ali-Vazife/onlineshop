module.exports.applyAssociations = (userModel, productModel) => {
  const { UserAccount, UserLogin, UserRole, UserAddress, UserLike } = userModel;
  const {
    Product,
    Category,
    Brand,
    Discount,
    Variant,
    Attribute,
    VariantAttribute,
  } = productModel;

  // User
  UserAccount.hasOne(UserLogin);
  UserLogin.belongsTo(UserAccount);

  UserAccount.hasOne(UserAddress);
  UserAddress.belongsTo(UserAccount);

  // UserAccount.hasMany(UserLike);
  // UserLike.belongsTo(UserAccount);

  // UserAccount.hasOne(UserRole);
  UserAccount.belongsTo(UserRole);

  // Product
  Product.belongsTo(Category);
  Category.hasMany(Product);

  Category.hasMany(Discount);
  Discount.belongsTo(Category);

  Brand.hasMany(Product);
  Product.belongsTo(Brand);

  Product.hasMany(Variant);
  Variant.belongsTo(Product);

  // ProductItem.hasMany(VariationId);
  // VariationId.belongsTo(ProductItem);

  // SizeOption.hasMany(VariationId);
  // VariationId.belongsTo(SizeOption);

  // ColorOption.hasMany(VariationId);
  // VariationId.belongsTo(ColorOption);

  // Junction
  UserAccount.belongsToMany(Product, { through: UserLike });
  Product.belongsToMany(UserAccount, { through: UserLike });

  Variant.belongsToMany(Attribute, { through: VariantAttribute });
  Attribute.belongsToMany(Variant, { through: VariantAttribute });
};
