package com.freshmandi.app.data.models

import com.google.gson.annotations.SerializedName

@androidx.room.Entity(tableName = "reviews")
data class Review(
    @androidx.room.PrimaryKey
    @SerializedName("_id")
    val id: String = "",
    @SerializedName("productId")
    val productId: String = "",
    @SerializedName("consumerId")
    val consumerId: String = "",
    val rating: Int = 5,
    val comment: String = "",
    @SerializedName("createdAt")
    val createdAt: String = ""
)

data class CreateReviewRequest(
    val rating: Int,
    val comment: String
)
