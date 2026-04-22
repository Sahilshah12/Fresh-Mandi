package com.freshmandi.app.utils

import androidx.room.TypeConverter
import com.freshmandi.app.data.models.OrderProduct
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class Converters {
    private val gson = Gson()

    @TypeConverter
    fun fromOrderProductList(value: List<OrderProduct>?): String? {
        return if (value == null) null else gson.toJson(value)
    }

    @TypeConverter
    fun toOrderProductList(value: String?): List<OrderProduct>? {
        return if (value == null) null else {
            val listType = object : TypeToken<List<OrderProduct>>() {}.type
            gson.fromJson(value, listType)
        }
    }
}
