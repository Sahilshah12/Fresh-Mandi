package com.freshmandi.app.utils

sealed class UiState<out T> {
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val exception: Throwable) : UiState<Nothing>()
}

fun <T> Result<T>.toUiState(): UiState<T> {
    return when {
        isSuccess -> UiState.Success(getOrNull()!!)
        isFailure -> UiState.Error(exceptionOrNull() ?: Exception("Unknown error"))
        else -> UiState.Error(Exception("Unknown error"))
    }
}
