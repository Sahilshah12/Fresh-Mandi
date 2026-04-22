package com.freshmandi.app.data.models

import com.google.gson.annotations.SerializedName

@androidx.room.Entity(tableName = "orders")
data class Order(
    @androidx.room.PrimaryKey
    @SerializedName("_id")
    val id: String = "",
    @SerializedName("consumerId")
    val consumerId: String = "",
    @SerializedName("farmerId")
    val farmerId: String = "",
    val products: List<OrderProduct> = emptyList(),
    @SerializedName("totalPrice")
    val totalPrice: Double = 0.0,
    @SerializedName("productsTotal")
    val productsTotal: Double = 0.0,
    @SerializedName("deliveryCharge")
    val deliveryCharge: Double = 0.0,
    @SerializedName("deliveryDistance")
    val deliveryDistance: Double = 0.0,
    @SerializedName("deliveryMode")
    val deliveryMode: String = "pickup", // pickup, delivery
    @SerializedName("deliveryAddress")
    val deliveryAddress: String = "",
    @SerializedName("paymentMethod")
    val paymentMethod: String = "cod", // cod, online
    @SerializedName("paymentStatus")
    val paymentStatus: String = "pending", // pending, paid
    val status: String = "pending", // pending, confirmed, ready, completed, cancelled
    @SerializedName("createdAt")
    val createdAt: String = "",
    @SerializedName("updatedAt")
    val updatedAt: String = ""
)

data class OrderProduct(
    @SerializedName("productId")
    val productId: String = "",
    val name: String = "",
    val price: Double = 0.0,
    val quantity: Int = 0
)

data class CreateOrderRequest(
    val products: List<OrderProduct>,
    @SerializedName("totalPrice")
    val totalPrice: Double,
    @SerializedName("deliveryMode")
    val deliveryMode: String = "pickup",
    @SerializedName("deliveryAddress")
    val deliveryAddress: String = "",
    @SerializedName("paymentMethod")
    val paymentMethod: String = "cod"
)
