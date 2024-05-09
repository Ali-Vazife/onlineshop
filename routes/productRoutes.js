const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Product
router.route('/getAllProducts').get(productController.getAllProducts);
router.route('/getProduct/:id').get(productController.getProduct);
router.route('/createProduct').post(productController.createProduct);
router.route('/updateProduct/:id').patch(productController.updateProduct);
router.route('/deleteProduct/:id').delete(productController.deleteProduct);

// Category
router.route('/getAllCategories').get(productController.getAllCategories);
router.route('/getCategory/:id').get(productController.getCategory);
router.route('/createCategory').post(productController.createCategory);
router.route('/updateCategory/:id').patch(productController.updateCategory);
router.route('/deleteCategory/:id').delete(productController.deleteCategory);

// Brand
router.route('/getAllBrands').get(productController.getAllBrands);
router.route('/getBrand/:id').get(productController.getBrand);
router.route('/createBrand').post(productController.createBrand);
router.route('/updateBrand/:id').patch(productController.updateBrand);
router.route('/deleteBrand/:id').delete(productController.deleteBrand);

// Discount
router.route('/getAllDiscounts').get(productController.getAllDiscounts);
router.route('/getDiscount/:id').get(productController.getDiscount);
router.route('/createDiscount').post(productController.createDiscount);
router.route('/updateDiscount/:id').patch(productController.updateDiscount);
router.route('/deleteDiscount/:id').delete(productController.deleteDiscount);

// Variant
router.route('/getAllVariants').get(productController.getAllVariants);
router.route('/getVariant/:id').get(productController.getVariant);
router.route('/createVariant').post(productController.createVariant);
router.route('/updateVariant/:id').patch(productController.updateVariant);
router.route('/deleteVariant/:id').delete(productController.deleteVariant);

// Attributes
router.route('/getAllAttributes').get(productController.getAllAttributes);
router.route('/getAttribute/:id').get(productController.getAttribute);
router.route('/createAttribute').post(productController.createAttribute);
router.route('/updateAttribute/:id').patch(productController.updateAttribute);
router.route('/deleteAttribute/:id').delete(productController.deleteAttribute);

// Variant Attribute
router
  .route('/getAllVariantsAttributes')
  .get(productController.getAllVariantsAttributes);
router
  .route('/getVariantAttribute/:id1/:id2')
  .get(productController.getVariantAttribute);
router
  .route('/createVariantAttribute')
  .post(productController.createVariantAttribute);
router
  .route('/updateVariantAttribute/:id1/:id2')
  .patch(productController.updateVariantAttribute);
router
  .route('/deleteVariantAttribute/:id1/:id2')
  .delete(productController.deleteVariantAttribute);

module.exports = router;
