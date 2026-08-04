const Category = require('../models/Category');
const { success, error } = require('../utils/response');

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
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!category) return error(res, 'Category not found', 404);
  return success(res, { category }, 'Category updated');
};

const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return error(res, 'Category not found', 404);
  return success(res, null, 'Category deleted');
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
