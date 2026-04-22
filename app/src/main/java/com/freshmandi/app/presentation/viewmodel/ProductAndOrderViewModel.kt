package com.freshmandi.app.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.freshmandi.app.data.models.Product
import com.freshmandi.app.data.models.CreateOrderRequest
import com.freshmandi.app.data.models.OrderProduct
import com.freshmandi.app.data.repository.ProductRepository
import com.freshmandi.app.data.repository.OrderRepository
import com.freshmandi.app.utils.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProductViewModel @Inject constructor(
    private val productRepository: ProductRepository
) : ViewModel() {

    private val _productsState = MutableStateFlow<UiState<List<Product>>>(UiState.Loading)
    val productsState: StateFlow<UiState<List<Product>>> = _productsState.asStateFlow()

    private val _productDetailState = MutableStateFlow<UiState<Product>>(UiState.Loading)
    val productDetailState: StateFlow<UiState<Product>> = _productDetailState.asStateFlow()

    fun getProducts(
        city: String? = null,
        category: String? = null,
        minPrice: Double? = null,
        maxPrice: Double? = null,
        search: String? = null,
        sortBy: String = "createdAt",
        sortOrder: String = "desc"
    ) {
        viewModelScope.launch {
            _productsState.value = UiState.Loading
            val result = productRepository.getProducts(city, category, minPrice, maxPrice, search, sortBy, sortOrder)
            result.onSuccess { products ->
                _productsState.value = UiState.Success(products)
            }
            result.onFailure { e ->
                _productsState.value = UiState.Error(e as Exception)
            }
        }
    }

    fun getProductById(productId: String) {
        viewModelScope.launch {
            _productDetailState.value = UiState.Loading
            val result = productRepository.getProductById(productId)
            result.onSuccess { product ->
                _productDetailState.value = UiState.Success(product)
            }
            result.onFailure { e ->
                _productDetailState.value = UiState.Error(e as Exception)
            }
        }
    }

    fun getProductsByCity(city: String) {
        viewModelScope.launch {
            _productsState.value = UiState.Loading
            try {
                productRepository.getProductsByCity(city).collect { products ->
                    _productsState.value = UiState.Success(products)
                }
            } catch (e: Exception) {
                _productsState.value = UiState.Error(e)
            }
        }
    }
}

@HiltViewModel
class OrderViewModel @Inject constructor(
    private val orderRepository: OrderRepository
) : ViewModel() {

    private val _createOrderState = MutableStateFlow<UiState<Any>>(UiState.Loading)
    val createOrderState: StateFlow<UiState<Any>> = _createOrderState.asStateFlow()

    private val _cart = MutableStateFlow<List<OrderProduct>>(emptyList())
    val cart: StateFlow<List<OrderProduct>> = _cart.asStateFlow()

    private val _cartTotal = MutableStateFlow(0.0)
    val cartTotal: StateFlow<Double> = _cartTotal.asStateFlow()

    fun addToCart(product: Product, quantity: Int) {
        val currentCart = _cart.value.toMutableList()
        val existingItem = currentCart.find { it.productId == product.id }

        if (existingItem != null) {
            currentCart.remove(existingItem)
            currentCart.add(existingItem.copy(quantity = existingItem.quantity + quantity))
        } else {
            currentCart.add(
                OrderProduct(
                    productId = product.id,
                    name = product.name,
                    price = product.price,
                    quantity = quantity
                )
            )
        }
        _cart.value = currentCart
        updateCartTotal()
    }

    fun removeFromCart(productId: String) {
        val currentCart = _cart.value.toMutableList()
        currentCart.removeAll { it.productId == productId }
        _cart.value = currentCart
        updateCartTotal()
    }

    fun updateCartQuantity(productId: String, quantity: Int) {
        val currentCart = _cart.value.toMutableList()
        val item = currentCart.find { it.productId == productId }
        if (item != null) {
            val index = currentCart.indexOf(item)
            if (quantity > 0) {
                currentCart[index] = item.copy(quantity = quantity)
            } else {
                currentCart.removeAt(index)
            }
        }
        _cart.value = currentCart
        updateCartTotal()
    }

    fun clearCart() {
        _cart.value = emptyList()
        _cartTotal.value = 0.0
    }

    private fun updateCartTotal() {
        _cartTotal.value = _cart.value.sumOf { it.price * it.quantity }
    }

    fun createOrder(
        deliveryMode: String = "pickup",
        deliveryAddress: String = "",
        paymentMethod: String = "cod"
    ) {
        viewModelScope.launch {
            _createOrderState.value = UiState.Loading
            val request = CreateOrderRequest(
                products = _cart.value,
                totalPrice = _cartTotal.value,
                deliveryMode = deliveryMode,
                deliveryAddress = deliveryAddress,
                paymentMethod = paymentMethod
            )
            val result = orderRepository.createOrder(request)
            result.onSuccess {
                _createOrderState.value = UiState.Success(it)
                clearCart()
            }
            result.onFailure { e ->
                _createOrderState.value = UiState.Error(e as Exception)
            }
        }
    }
}
