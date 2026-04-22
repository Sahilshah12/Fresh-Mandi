package com.freshmandi.app.presentation.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.freshmandi.app.databinding.FragmentCartBinding
import com.freshmandi.app.presentation.viewmodel.OrderViewModel
import com.freshmandi.app.presentation.ui.adapters.CartAdapter
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch

@AndroidEntryPoint
class CartFragment : Fragment() {
    private lateinit var binding: FragmentCartBinding
    private val orderViewModel: OrderViewModel by viewModels()
    private lateinit var cartAdapter: CartAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentCartBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        setupListeners()
        observeViewModel()
    }

    private fun setupRecyclerView() {
        cartAdapter = CartAdapter(
            onQuantityChange = { productId, quantity ->
                orderViewModel.updateCartQuantity(productId, quantity)
            },
            onRemove = { productId ->
                orderViewModel.removeFromCart(productId)
            }
        )

        binding.cartItemsRecyclerView.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = cartAdapter
        }
    }

    private fun setupListeners() {
        binding.checkoutButton.setOnClickListener {
            navigateToCheckout()
        }
    }

    private fun observeViewModel() {
        lifecycleScope.launch {
            orderViewModel.cart.collect { cartItems ->
                if (cartItems.isEmpty()) {
                    binding.cartItemsRecyclerView.visibility = View.GONE
                    binding.emptyStateLayout.visibility = View.VISIBLE
                    binding.cartSummaryLayout.visibility = View.GONE
                } else {
                    binding.cartItemsRecyclerView.visibility = View.VISIBLE
                    binding.emptyStateLayout.visibility = View.GONE
                    binding.cartSummaryLayout.visibility = View.VISIBLE
                    cartAdapter.submitList(cartItems)
                }
            }
        }

        lifecycleScope.launch {
            orderViewModel.cartTotal.collect { total ->
                binding.subtotalText.text = "₹${String.format("%.2f", total)}"
                binding.totalText.text = "₹${String.format("%.2f", total)}"
            }
        }
    }

    private fun navigateToCheckout() {
        // TODO: Implement safe navigation to checkout
        // For now, navigation will be set up after resource compilation
    }
}
