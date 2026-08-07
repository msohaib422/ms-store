const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;
const { success, error } = require('../utils/response');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const uploadIndex = parts.findIndex(p => p === 'upload');
  if (uploadIndex === -1) return null;
  const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
  return publicIdWithExt.split('.')[0];
};

const deleteFromCloudinary = async (urls) => {
  if (!urls || !urls.length) return;
  const publicIds = urls.map(extractPublicId).filter(Boolean);
  if (!publicIds.length) return;
  await Promise.all(publicIds.map(id => cloudinary.uploader.destroy(id)));
};

const getCategories = async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const categories = await Category.find(filter).sort({ displayOrder: 1, createdAt: -1 });
  return success(res, { categories });
};

const getCategory = async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug });
  if (!cat) return error(res, 'Category not found', 404);
  return success(res, { category: cat });
};

const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  return success(res, { category }, 'Category created', 201);
};

const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return error(res, 'Category not found', 404);

  const oldUrls = [category.imageUrl, category.bannerUrl].filter(Boolean);
  const newUrls = [req.body.imageUrl, req.body.bannerUrl].filter(Boolean);
  const deletedUrls = oldUrls.filter(url => !newUrls.includes(url));
  await deleteFromCloudinary(deletedUrls);

  Object.assign(category, req.body);
  await category.save();

  return success(res, { category }, 'Category updated');
};

const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return error(res, 'Category not found', 404);
  await deleteFromCloudinary([category.imageUrl, category.bannerUrl].filter(Boolean));
  return success(res, null, 'Category deleted');
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
