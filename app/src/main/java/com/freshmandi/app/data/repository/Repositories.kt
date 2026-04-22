package com.freshmandi.app.data.repository

import com.freshmandi.app.data.api.FreshMandiApiService
import com.freshmandi.app.data.database.UserDao
import com.freshmandi.app.data.database.ProductDao
import com.freshmandi.app.data.database.OrderDao
import com.freshmandi.app.data.database.ReviewDao
import com.freshmandi.app.data.models.*
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class AuthRepository @Inject constructor(
    private val apiService: FreshMandiApiService,
    private val userDao: UserDao
) {
    suspend fun register(request: RegisterRequest): Result<AuthResponse> {
        return try {
            val response = apiService.register(request)
            if (response.isSuccessful) {
                val authResponse = response.body()!!
                authResponse.user?.let { userDao.insertUser(it) }
                Result.success(authResponse)
            } else {
                Result.failure(Exception(response.errorBody()?.string() ?: "Register failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun login(email: String, password: String): Result<AuthResponse> {
        return try {
            val response = apiService.login(LoginRequest(email, password))
            if (response.isSuccessful) {
                val authResponse = response.body()!!
                authResponse.user?.let { userDao.insertUser(it) }
                Result.success(authResponse)
            } else {
                Result.failure(Exception(response.errorBody()?.string() ?: "Login failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getProfile(): Result<User> {
        return try {
            val response = apiService.getProfile()
            if (response.isSuccessful) {
                val user = response.body()!!
                userDao.insertUser(user)
                Result.success(user)
            } else {
                Result.failure(Exception(response.errorBody()?.string() ?: "Failed to get profile"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateProfile(user: User): Result<User> {
        return try {
            val response = apiService.updateProfile(user)
            if (response.isSuccessful) {
                val updatedUser = response.body()!!
                userDao.updateUser(updatedUser)
                Result.success(updatedUser)
            } else {
                Result.failure(Exception(response.errorBody()?.string() ?: "Failed to update profile"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getCurrentUser(): User? {
        return userDao.getCurrentUser()
    }

    suspend fun logout() {
        userDao.deleteAllUsers()
    }
}

class ProductRepository @Inject constructor(
    private val apiService: FreshMandiApiService,
    private val productDao: ProductDao
) {
    suspend fun getProducts(
        city: String? = null,
        category: String? = null,
        minPrice: Double? = null,
        maxPrice: Double? = null,
        search: String? = null,
        sortBy: String = "createdAt",
        sortOrder: String = "desc"
    ): Result<List<Product>> {
        return try {
            val response = apiService.getProducts(city, category, minPrice, maxPrice, search, sortBy, sortOrder)
            if (response.isSuccessful) {
                val products = response.body() ?: emptyList()
                products.forEach { productDao.insertProduct(it) }
                Result.success(products)
            } else {
                Result.failure(Exception("Failed to get products"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getProductById(productId: String): Result<Product> {
        return try {
            val response = apiService.getProductById(productId)
            if (response.isSuccessful) {
                val product = response.body()!!
                productDao.insertProduct(product)
                Result.success(product)
            } else {
                Result.failure(Exception("Failed to get product"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getAllProductsFlow(): Flow<List<Product>> {
        return productDao.getAllProducts()
    }

    fun getProductsByCity(city: String): Flow<List<Product>> {
        return productDao.getProductsByCity(city)
    }
}

class FarmerRepository @Inject constructor(
    private val apiService: FreshMandiApiService,
    private val productDao: ProductDao,
    private val orderDao: OrderDao
) {
    suspend fun createProduct(product: Product): Result<Product> {
        return try {
            val response = apiService.createProduct(product)
            if (response.isSuccessful) {
                val createdProduct = response.body()!!
                productDao.insertProduct(createdProduct)
                Result.success(createdProduct)
            } else {
                Result.failure(Exception("Failed to create product"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateProduct(productId: String, product: Product): Result<Product> {
        return try {
            val response = apiService.updateProduct(productId, product)
            if (response.isSuccessful) {
                val updatedProduct = response.body()!!
                productDao.updateProduct(updatedProduct)
                Result.success(updatedProduct)
            } else {
                Result.failure(Exception("Failed to update product"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteProduct(productId: String): Result<String> {
        return try {
            val response = apiService.deleteProduct(productId)
            if (response.isSuccessful) {
                Result.success("Product deleted successfully")
            } else {
                Result.failure(Exception("Failed to delete product"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getFarmerProductsFlow(farmerId: String): Flow<List<Product>> {
        return productDao.getFarmerProducts(farmerId)
    }

    fun getFarmerOrdersFlow(farmerId: String): Flow<List<Order>> {
        return orderDao.getFarmerOrders(farmerId)
    }

    suspend fun updateOrderStatus(orderId: String, status: String): Result<Order> {
        return try {
            val response = apiService.updateOrderStatus(orderId, mapOf("status" to status))
            if (response.isSuccessful) {
                val updatedOrder = response.body()!!
                orderDao.updateOrder(updatedOrder)
                Result.success(updatedOrder)
            } else {
                Result.failure(Exception("Failed to update order status"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

class OrderRepository @Inject constructor(
    private val apiService: FreshMandiApiService,
    private val orderDao: OrderDao
) {
    suspend fun createOrder(request: CreateOrderRequest): Result<Order> {
        return try {
            val response = apiService.createOrder(request)
            if (response.isSuccessful) {
                val order = response.body()!!
                orderDao.insertOrder(order)
                Result.success(order)
            } else {
                Result.failure(Exception("Failed to create order"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getOrderById(orderId: String): Result<Order> {
        return try {
            val response = apiService.getOrderById(orderId)
            if (response.isSuccessful) {
                val order = response.body()!!
                orderDao.insertOrder(order)
                Result.success(order)
            } else {
                Result.failure(Exception("Failed to get order"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getConsumerOrdersFlow(consumerId: String): Flow<List<Order>> {
        return orderDao.getConsumerOrders(consumerId)
    }

    suspend fun cancelOrder(orderId: String): Result<Order> {
        return try {
            val response = apiService.cancelOrder(orderId)
            if (response.isSuccessful) {
                val order = response.body()!!
                orderDao.updateOrder(order)
                Result.success(order)
            } else {
                Result.failure(Exception("Failed to cancel order"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

class ReviewRepository @Inject constructor(
    private val apiService: FreshMandiApiService,
    private val reviewDao: ReviewDao
) {
    suspend fun createReview(productId: String, request: CreateReviewRequest): Result<Review> {
        return try {
            val response = apiService.createReview(productId, request)
            if (response.isSuccessful) {
                val review = response.body()!!
                reviewDao.insertReview(review)
                Result.success(review)
            } else {
                Result.failure(Exception("Failed to create review"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getProductReviewsFlow(productId: String): Flow<List<Review>> {
        return reviewDao.getProductReviews(productId)
    }

    suspend fun getProductReviews(productId: String): Result<List<Review>> {
        return try {
            val response = apiService.getProductReviews(productId)
            if (response.isSuccessful) {
                val reviews = response.body() ?: emptyList()
                reviews.forEach { reviewDao.insertReview(it) }
                Result.success(reviews)
            } else {
                Result.failure(Exception("Failed to get reviews"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
