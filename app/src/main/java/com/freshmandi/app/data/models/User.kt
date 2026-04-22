package com.freshmandi.app.data.models

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName

@Entity(tableName = "users")
data class User(
    @PrimaryKey
    @SerializedName("_id")
    val id: String = "",
    val name: String = "",
    val email: String = "",
    val role: String = "consumer", // farmer, consumer, admin
    val state: String = "",
    val city: String = "",
    val address: String = "",
    val pincode: String = "",
    val phone: String = "",
    val mandi: String = "",
    val approved: Boolean = false,
    @SerializedName("createdAt")
    val createdAt: String = ""
)

data class AuthResponse(
    val token: String = "",
    val user: User? = null,
    val message: String = ""
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val role: String = "consumer",
    val city: String = "",
    val state: String = "",
    val address: String = "",
    val pincode: String = "",
    val phone: String = ""
)
