const router = require('express').Router();
const { getReviews, createReview, approveReview, deleteReview } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', getReviews);
router.post('/', createReview);
router.patch('/:id/approve', protect, approveReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
