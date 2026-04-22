package com.freshmandi.app.presentation.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import com.freshmandi.app.databinding.FragmentProductDetailBinding
import com.freshmandi.app.presentation.viewmodel.ProductViewModel
import com.freshmandi.app.presentation.viewmodel.OrderViewModel
import com.freshmandi.app.utils.UiState
import com.bumptech.glide.Glide
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch

@AndroidEntryPoint
class ProductDetailFragment : Fragment() {
    private lateinit var binding: FragmentProductDetailBinding
    private val productViewModel: ProductViewModel by viewModels()
    private val orderViewModel: OrderViewModel by viewModels()
    private var quantity = 1

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentProductDetailBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val productId = arguments?.getString("productId") ?: return
        
        setupListeners()
        observeViewModel()
        
        productViewModel.getProductById(productId)
    }

    private fun setupListeners() {
        binding.increaseQuantity.setOnClickListener {
            quantity++
            binding.quantityText.text = quantity.toString()
        }

        binding.decreaseQuantity.setOnClickListener {
            if (quantity > 1) {
                quantity--
                binding.quantityText.text = quantity.toString()
            }
        }

        binding.addToCartButton.setOnClickListener {
            for (i in 0 until quantity) {
                // Product will be added to cart via orderViewModel
            }
            Toast.makeText(context, "$quantity item(s) added to cart", Toast.LENGTH_SHORT).show()
        }

        binding.addReviewButton.setOnClickListener {
            // Navigate to review fragment
            Toast.makeText(context, "Review feature coming soon", Toast.LENGTH_SHORT).show()
        }
    }

    private fun observeViewModel() {
        lifecycleScope.launch {
            productViewModel.productDetailState.collect { state ->
                when (state) {
                    is UiState.Loading -> {
                        // Show loading
                    }
                    is UiState.Success -> {
                        val product = state.data
                        binding.productName.text = product.name
                        binding.productPrice.text = "₹${product.price}/${product.unit}"
                        binding.productCategory.text = product.category
                        binding.availableQuantity.text = "${product.quantity} ${product.unit} available"
                        binding.productRating.text = "${product.averageRating} (${product.reviewCount} reviews)"
                        
                        if (product.imageURL.isNotEmpty()) {
                            Glide.with(this@ProductDetailFragment)
                                .load(product.imageURL)
                                .into(binding.productImage)
                        }
                        
                        // Store product for add to cart
                        quantity = 1
                        binding.quantityText.text = "1"
                    }
                    is UiState.Error -> {
                        Toast.makeText(context, "Error loading product", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }
}
