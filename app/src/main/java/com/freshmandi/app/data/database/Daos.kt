package com.freshmandi.app.data.database

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import androidx.room.Delete
import com.freshmandi.app.data.models.*
import kotlinx.coroutines.flow.Flow

@Dao
interface UserDao {
    @Insert
    suspend fun insertUser(user: User)

    @Query("SELECT * FROM users WHERE id = :userId LIMIT 1")
    suspend fun getUserById(userId: String): User?

    @Query("SELECT * FROM users LIMIT 1")
    suspend fun getCurrentUser(): User?

    @Update
    suspend fun updateUser(user: User)

    @Delete
    suspend fun deleteUser(user: User)

    @Query("DELETE FROM users")
    suspend fun deleteAllUsers()
}

@Dao
interface ProductDao {
    @Insert
    suspend fun insertProduct(product: Product)

    @Query("SELECT * FROM products")
    fun getAllProducts(): Flow<List<Product>>

    @Query("SELECT * FROM products WHERE id = :productId LIMIT 1")
    suspend fun getProductById(productId: String): Product?

    @Query("SELECT * FROM products WHERE farmerId = :farmerId")
    fun getFarmerProducts(farmerId: String): Flow<List<Product>>

    @Query("SELECT * FROM products WHERE city = :city")
    fun getProductsByCity(city: String): Flow<List<Product>>

    @Update
    suspend fun updateProduct(product: Product)

    @Delete
    suspend fun deleteProduct(product: Product)

    @Query("DELETE FROM products")
    suspend fun deleteAllProducts()
}

@Dao
interface OrderDao {
    @Insert
    suspend fun insertOrder(order: Order)

    @Query("SELECT * FROM orders WHERE id = :orderId LIMIT 1")
    suspend fun getOrderById(orderId: String): Order?

    @Query("SELECT * FROM orders WHERE consumerId = :consumerId ORDER BY createdAt DESC")
    fun getConsumerOrders(consumerId: String): Flow<List<Order>>

    @Query("SELECT * FROM orders WHERE farmerId = :farmerId ORDER BY createdAt DESC")
    fun getFarmerOrders(farmerId: String): Flow<List<Order>>

    @Query("SELECT * FROM orders")
    fun getAllOrders(): Flow<List<Order>>

    @Update
    suspend fun updateOrder(order: Order)

    @Delete
    suspend fun deleteOrder(order: Order)

    @Query("DELETE FROM orders")
    suspend fun deleteAllOrders()
}

@Dao
interface ReviewDao {
    @Insert
    suspend fun insertReview(review: Review)

    @Query("SELECT * FROM reviews WHERE productId = :productId")
    fun getProductReviews(productId: String): Flow<List<Review>>

    @Query("SELECT * FROM reviews WHERE id = :reviewId LIMIT 1")
    suspend fun getReviewById(reviewId: String): Review?

    @Delete
    suspend fun deleteReview(review: Review)

    @Query("DELETE FROM reviews")
    suspend fun deleteAllReviews()
}

@Dao
interface NotificationDao {
    @Insert
    suspend fun insertNotification(notification: Notification)

    @Query("SELECT * FROM notifications WHERE userId = :userId ORDER BY createdAt DESC")
    fun getUserNotifications(userId: String): Flow<List<Notification>>

    @Query("SELECT COUNT(*) FROM notifications WHERE userId = :userId AND read = 0")
    fun getUnreadNotificationCount(userId: String): Flow<Int>

    @Update
    suspend fun updateNotification(notification: Notification)

    @Delete
    suspend fun deleteNotification(notification: Notification)

    @Query("DELETE FROM notifications")
    suspend fun deleteAllNotifications()
}
