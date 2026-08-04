const Review = require('../models/Review');
const Product = require('../models/Product');
const { success, error } = require('../utils/response');

const getReviews = async (req, res) => {
  const { productId, approved } = req.query;
  const filter = {};
  if (productId) filter.product = productId;
  if (approved !== undefined) filter.isApproved = approved === 'true';

  const reviews = await Review.find(filter)
    .populate('product', 'name')
    .sort({ createdAt: -1 });
  return success(res, { reviews });
};

const createReview = async (req, res) => {
  const review = await Review.create(req.body);
  return success(res, { review }, 'Review submitted — it will appear after approval', 201);
};

const approveReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );
  if (!review) return error(res, 'Review not found', 404);

  if (review.product) {
    const approved = await Review.find({ product: review.product, isApproved: true });
    const avg = approved.reduce((s, r) => s + r.rating, 0) / (approved.length || 1);
    await Product.findByIdAndUpdate(review.product, {
      ratings: Math.round(avg * 10) / 10,
      reviewsCount: approved.length,
    });
  }

  return success(res, { review }, 'Review approved');
};

const deleteReview = async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return error(res, 'Review not found', 404);
  return success(res, null, 'Review deleted');
};

module.exports = { getReviews, createReview, approveReview, deleteReview };
