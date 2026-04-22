package com.freshmandi.app.data.models

import com.google.gson.annotations.SerializedName

@androidx.room.Entity(tableName = "notifications")
data class Notification(
    @androidx.room.PrimaryKey
    @SerializedName("_id")
    val id: String = "",
    @SerializedName("userId")
    val userId: String = "",
    val message: String = "",
    @SerializedName("notificationType")
    val notificationType: String = "", // order, product, system
    @SerializedName("relatedId")
    val relatedId: String = "",
    val read: Boolean = false,
    @SerializedName("createdAt")
    val createdAt: String = ""
)
