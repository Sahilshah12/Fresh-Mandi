package com.freshmandi.app.utils

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import java.util.*

private val Context.dataStore by preferencesDataStore(name = "preferences")

class PreferenceManager(private val context: Context) {
    companion object {
        private val TOKEN_KEY = stringPreferencesKey("token")
        private val USER_ID_KEY = stringPreferencesKey("user_id")
        private val USER_NAME_KEY = stringPreferencesKey("user_name")
        private val USER_EMAIL_KEY = stringPreferencesKey("user_email")
        private val USER_ROLE_KEY = stringPreferencesKey("user_role")
        private val USER_CITY_KEY = stringPreferencesKey("user_city")
    }

    suspend fun saveToken(token: String) {
        context.dataStore.edit { preferences ->
            preferences[TOKEN_KEY] = token
        }
    }

    suspend fun getToken(): String {
        val preferences = context.dataStore.data.first()
        return preferences[TOKEN_KEY] ?: ""
    }

    suspend fun saveUser(
        userId: String, 
        name: String, 
        email: String, 
        role: String,
        city: String
    ) {
        context.dataStore.edit { preferences ->
            preferences[USER_ID_KEY] = userId
            preferences[USER_NAME_KEY] = name
            preferences[USER_EMAIL_KEY] = email
            preferences[USER_ROLE_KEY] = role
            preferences[USER_CITY_KEY] = city
        }
    }

    suspend fun getUserId(): String {
        val preferences = context.dataStore.data.first()
        return preferences[USER_ID_KEY] ?: ""
    }

    suspend fun getUserRole(): String {
        val preferences = context.dataStore.data.first()
        return preferences[USER_ROLE_KEY] ?: "consumer"
    }

    suspend fun getUserCity(): String {
        val preferences = context.dataStore.data.first()
        return preferences[USER_CITY_KEY] ?: ""
    }

    suspend fun clearAll() {
        context.dataStore.edit { it.clear() }
    }

    fun isLoggedIn() = context.dataStore.data.map { preferences ->
        preferences[TOKEN_KEY]?.isNotEmpty() == true
    }
}
