package com.freshmandi.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.freshmandi.app.data.models.*
import com.freshmandi.app.data.repository.AuthRepository
import com.freshmandi.app.utils.PreferenceManager
import com.freshmandi.app.utils.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val preferenceManager: PreferenceManager
) : ViewModel() {
    
    private val _loginState = MutableStateFlow<UiState<AuthResponse>>(UiState.Loading)
    val loginState: StateFlow<UiState<AuthResponse>> = _loginState

    private val _registerState = MutableStateFlow<UiState<AuthResponse>>(UiState.Loading)
    val registerState: StateFlow<UiState<AuthResponse>> = _registerState

    private val _profileState = MutableStateFlow<UiState<User>>(UiState.Loading)
    val profileState: StateFlow<UiState<User>> = _profileState

    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser: StateFlow<User?> = _currentUser

    private val _isLoggedIn = MutableStateFlow(false)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn

    init {
        checkIfLoggedIn()
    }

    private fun checkIfLoggedIn() {
        viewModelScope.launch {
            val user = authRepository.getCurrentUser()
            _currentUser.value = user
            _isLoggedIn.value = user != null
        }
    }

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _loginState.value = UiState.Loading
            val result = authRepository.login(email, password)
            result.onSuccess { authResponse ->
                authResponse.user?.let { user ->
                    val token = authResponse.token
                    preferenceManager.saveToken(token)
                    preferenceManager.saveUser(
                        user.id,
                        user.name,
                        user.email,
                        user.role,
                        user.city
                    )
                    _currentUser.value = user
                    _isLoggedIn.value = true
                    _loginState.value = UiState.Success(authResponse)
                }
            }
            result.onFailure { e ->
                _loginState.value = UiState.Error(e as Exception)
            }
        }
    }

    fun register(request: RegisterRequest) {
        viewModelScope.launch {
            _registerState.value = UiState.Loading
            val result = authRepository.register(request)
            result.onSuccess { authResponse ->
                authResponse.user?.let { user ->
                    val token = authResponse.token
                    preferenceManager.saveToken(token)
                    preferenceManager.saveUser(
                        user.id,
                        user.name,
                        user.email,
                        user.role,
                        user.city
                    )
                    _currentUser.value = user
                    _isLoggedIn.value = true
                    _registerState.value = UiState.Success(authResponse)
                }
            }
            result.onFailure { e ->
                _registerState.value = UiState.Error(e as Exception)
            }
        }
    }

    fun getProfile() {
        viewModelScope.launch {
            _profileState.value = UiState.Loading
            val result = authRepository.getProfile()
            result.onSuccess { user ->
                _currentUser.value = user
                _profileState.value = UiState.Success(user)
            }
            result.onFailure { e ->
                _profileState.value = UiState.Error(e as Exception)
            }
        }
    }

    fun updateProfile(user: User) {
        viewModelScope.launch {
            _profileState.value = UiState.Loading
            val result = authRepository.updateProfile(user)
            result.onSuccess { updatedUser ->
                _currentUser.value = updatedUser
                _profileState.value = UiState.Success(updatedUser)
            }
            result.onFailure { e ->
                _profileState.value = UiState.Error(e as Exception)
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
            preferenceManager.clearAll()
            _currentUser.value = null
            _isLoggedIn.value = false
        }
    }
}
