const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Helper function to update product rating
async function updateProductRating(productId) {
  const reviews = await Review.find({ productId });
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount 
    : 0;
  
  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    reviewCount
  });
}

// Get all reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sortBy = 'recent' } = req.query;
    
    let sortOptions = {};
    if (sortBy === 'recent') sortOptions = { createdAt: -1 };
    else if (sortBy === 'highest') sortOptions = { rating: -1 };
    else if (sortBy === 'lowest') sortOptions = { rating: 1 };
    
    const reviews = await Review.find({ productId })
      .populate('userId', 'name email')
      .sort(sortOptions);
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a review (with purchase verification)
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment, photos } = req.body;
    const userId = req.user.id;
    
    // Check if user is a consumer
    if (req.user.role !== 'consumer') {
      return res.status(403).json({ message: 'Only consumers can review products' });
    }
    
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    
    // Verify if user purchased this product
    const hasPurchased = await Order.findOne({
      consumerId: userId,
      'items.productId': productId,
      status: { $in: ['delivered', 'completed'] }
    });
    
    if (!hasPurchased) {
      return res.status(403).json({ message: 'You can only review products you have purchased' });
    }
    
    // Create review
    const review = await Review.create({
      productId,
      userId,
      rating,
      comment,
      photos: photos || [],
      verified: true
    });
    
    // Update product rating
    await updateProductRating(productId);
    
    const populatedReview = await Review.findById(review._id).populate('userId', 'name email');
    res.status(201).json(populatedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a review (user can edit their own review)
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment, photos } = req.body;
    const userId = req.user.id;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns this review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only edit your own reviews' });
    }
    
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.photos = photos || review.photos;
    await review.save();
    
    // Update product rating
    await updateProductRating(review.productId);
    
    const updatedReview = await Review.findById(reviewId).populate('userId', 'name email');
    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a review (user can delete their own, admin can delete any)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check permission
    if (review.userId.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    
    const productId = review.productId;
    await Review.findByIdAndDelete(reviewId);
    
    // Update product rating
    await updateProductRating(productId);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Vote helpful/unhelpful
exports.voteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { voteType } = req.body; // 'helpful' or 'unhelpful'
    const userId = req.user.id;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Remove previous votes from this user
    review.helpfulVotes = review.helpfulVotes.filter(id => id.toString() !== userId);
    review.unhelpfulVotes = review.unhelpfulVotes.filter(id => id.toString() !== userId);
    
    // Add new vote
    if (voteType === 'helpful') {
      review.helpfulVotes.push(userId);
    } else if (voteType === 'unhelpful') {
      review.unhelpfulVotes.push(userId);
    }
    
    await review.save();
    
    const updatedReview = await Review.findById(reviewId).populate('userId', 'name email');
    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Farmer reply to review
exports.replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    
    const review = await Review.findById(reviewId).populate('productId');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user is the farmer who owns the product
    if (review.productId.farmerId.toString() !== userId) {
      return res.status(403).json({ message: 'Only the product owner can reply to this review' });
    }
    
    review.farmerReply = {
      comment,
      repliedAt: new Date()
    };
    await review.save();
    
    const updatedReview = await Review.findById(reviewId)
      .populate('userId', 'name email')
      .populate('productId');
    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.find({ userId })
      .populate('productId', 'name imageURL')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
