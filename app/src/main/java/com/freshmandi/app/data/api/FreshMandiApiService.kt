package com.freshmandi.app.data.api

import com.freshmandi.app.data.models.*
import retrofit2.Response
import retrofit2.http.*

interface FreshMandiApiService {
    // Auth Routes
    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @GET("api/auth/profile")
    suspend fun getProfile(): Response<User>

    @PUT("api/auth/profile")
    suspend fun updateProfile(@Body user: User): Response<User>

    // Products Routes
    @GET("api/products")
    suspend fun getProducts(
        @Query("city") city: String? = null,
        @Query("category") category: String? = null,
        @Query("minPrice") minPrice: Double? = null,
        @Query("maxPrice") maxPrice: Double? = null,
        @Query("search") search: String? = null,
        @Query("sortBy") sortBy: String = "createdAt",
        @Query("sortOrder") sortOrder: String = "desc"
    ): Response<List<Product>>

    @GET("api/products/{id}")
    suspend fun getProductById(@Path("id") productId: String): Response<Product>

    // Farmer Routes
    @POST("api/farmers/products")
    suspend fun createProduct(@Body product: Product): Response<Product>

    @GET("api/farmers/products")
    suspend fun getFarmerProducts(): Response<List<Product>>

    @PUT("api/farmers/products/{id}")
    suspend fun updateProduct(
        @Path("id") productId: String,
        @Body product: Product
    ): Response<Product>

    @DELETE("api/farmers/products/{id}")
    suspend fun deleteProduct(@Path("id") productId: String): Response<Map<String, String>>

    @GET("api/farmers/orders")
    suspend fun getFarmerOrders(): Response<List<Order>>

    @PUT("api/farmers/orders/{id}/status")
    suspend fun updateOrderStatus(
        @Path("id") orderId: String,
        @Body statusUpdate: Map<String, String>
    ): Response<Order>

    // Orders Routes
    @POST("api/orders")
    suspend fun createOrder(@Body request: CreateOrderRequest): Response<Order>

    @GET("api/orders")
    suspend fun getConsumerOrders(): Response<List<Order>>

    @GET("api/orders/{id}")
    suspend fun getOrderById(@Path("id") orderId: String): Response<Order>

    @PUT("api/orders/{id}")
    suspend fun updateOrder(
        @Path("id") orderId: String,
        @Body order: Order
    ): Response<Order>

    @PUT("api/orders/{id}/cancel")
    suspend fun cancelOrder(@Path("id") orderId: String): Response<Order>

    // Reviews Routes
    @POST("api/reviews/product/{productId}")
    suspend fun createReview(
        @Path("productId") productId: String,
        @Body request: CreateReviewRequest
    ): Response<Review>

    @GET("api/reviews/product/{productId}")
    suspend fun getProductReviews(
        @Path("productId") productId: String
    ): Response<List<Review>>

    // Admin Routes
    @GET("api/admin/users")
    suspend fun getAllUsers(): Response<List<User>>

    @PUT("api/admin/users/{id}/approve")
    suspend fun approveFarmer(@Path("id") userId: String): Response<User>

    @DELETE("api/admin/users/{id}")
    suspend fun deleteUser(@Path("id") userId: String): Response<Map<String, String>>

    @GET("api/admin/analytics")
    suspend fun getAnalytics(): Response<Map<String, Any>>

    // Notifications Routes
    @GET("api/notifications")
    suspend fun getNotifications(): Response<List<Notification>>

    @PUT("api/notifications/{id}/read")
    suspend fun markNotificationAsRead(@Path("id") notificationId: String): Response<Notification>
}
