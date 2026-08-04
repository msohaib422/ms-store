const Product = require('../models/Product');
const Category = require('../models/Category');
const { success, error } = require('../utils/response');

const getProducts = async (req, res) => {
  const {
    search, category, minPrice, maxPrice,
    featured, page = 1, limit = 12, sort = 'newest',
  } = req.query;

  const filter = { status: 'active' };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { searchKeywords: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
  }

  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
  if (featured === 'true') filter.isFeatured = true;

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name_asc: { name: 1 },
  };

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  return success(res, { products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, status: 'active' })
    .populate('category', 'name slug');
  if (!product) return error(res, 'Product not found', 404);
  return success(res, { product });
};

const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ status: 'active', isFeatured: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(Number(req.query.limit) || 8);
  return success(res, { products });
};

const getSearchSuggestions = async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return success(res, { products: [] });
  const products = await Product.find({
    status: 'active',
    name: { $regex: q, $options: 'i' },
  }).select('name slug images').limit(5);
  return success(res, { products });
};

const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  return success(res, { product }, 'Product created', 201);
};

const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  }).populate('category', 'name slug');
  if (!product) return error(res, 'Product not found', 404);
  return success(res, { product }, 'Product updated');
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return error(res, 'Product not found', 404);
  return success(res, null, 'Product deleted');
};

const toggleProductField = async (req, res) => {
  const { field } = req.body;
  const allowed = ['status', 'isFeatured'];
  if (!allowed.includes(field)) return error(res, 'Invalid field', 400);

  const product = await Product.findById(req.params.id);
  if (!product) return error(res, 'Product not found', 404);

  if (field === 'status') {
    product.status = product.status === 'active' ? 'inactive' : 'active';
  } else {
    product[field] = !product[field];
  }

  await product.save();
  return success(res, { product }, 'Updated');
};

const getDashboardStats = async (req, res) => {
  const [
    totalProducts, totalCategories, totalReviews, totalMessages,
    unreadMessages, pendingReviews, lowStock, recentProducts, lowStockList,
  ] = await Promise.all([
    Product.countDocuments(),
    require('../models/Category').countDocuments(),
    require('../models/Review').countDocuments(),
    require('../models/Message').countDocuments(),
    require('../models/Message').countDocuments({ isRead: false }),
    require('../models/Review').countDocuments({ isApproved: false }),
    Product.countDocuments({ stock: { $lt: 5 } }),
    Product.find().populate('category', 'name').sort({ createdAt: -1 }).limit(5),
    Product.find({ stock: { $lt: 5 } }).populate('category', 'name').sort({ stock: 1 }).limit(5),
  ]);

  return success(res, {
    totalProducts, totalCategories, totalReviews, totalMessages,
    unreadMessages, pendingReviews, lowStock, recentProducts, lowStockList,
  });
};

module.exports = {
  getProducts, getProductBySlug, getFeaturedProducts, getSearchSuggestions,
  createProduct, updateProduct, deleteProduct, toggleProductField, getDashboardStats,
};
