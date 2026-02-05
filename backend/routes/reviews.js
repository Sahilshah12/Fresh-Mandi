const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

// Get all reviews for a product (public)
router.get('/product/:productId', reviewController.getProductReviews);

// Get user's own reviews (authenticated)
router.get('/my-reviews', auth, reviewController.getUserReviews);

// Create a review (authenticated consumers only)
router.post('/', auth, reviewController.createReview);

// Update a review (authenticated, owner only)
router.put('/:reviewId', auth, reviewController.updateReview);

// Delete a review (authenticated, owner or admin)
router.delete('/:reviewId', auth, reviewController.deleteReview);

// Vote on a review (authenticated)
router.post('/:reviewId/vote', auth, reviewController.voteReview);

// Farmer reply to review (authenticated farmers only)
router.post('/:reviewId/reply', auth, reviewController.replyToReview);

module.exports = router;
