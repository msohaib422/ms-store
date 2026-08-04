const router = require('express').Router();
const {
  getProducts, getProductBySlug, getFeaturedProducts, getSearchSuggestions,
  createProduct, updateProduct, deleteProduct, toggleProductField, getDashboardStats,
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/search', getSearchSuggestions);
router.get('/featured', getFeaturedProducts);
router.get('/dashboard/stats', protect, getDashboardStats);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.patch('/:id/toggle', protect, toggleProductField);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
