package com.freshmandi.app.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName

@Entity(tableName = "products")
data class Product(
    @PrimaryKey
    @SerializedName("_id")
    val id: String = "",
    @SerializedName("farmerId")
    val farmerId: String = "",
    val name: String = "",
    val category: String = "",
    val price: Double = 0.0,
    val quantity: Int = 0,
    val unit: String = "kg",
    @SerializedName("imageURL")
    val imageURL: String = "",
    val city: String = "",
    val available: Boolean = true,
    @SerializedName("averageRating")
    val averageRating: Double = 0.0,
    @SerializedName("reviewCount")
    val reviewCount: Int = 0,
    @SerializedName("createdAt")
    val createdAt: String = "",
    @SerializedName("updatedAt")
    val updatedAt: String = ""
)

data class ProductResponse(
    val data: List<Product> = emptyList(),
    val message: String = ""
)
