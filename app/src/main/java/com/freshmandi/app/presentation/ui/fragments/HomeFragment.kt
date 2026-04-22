package com.freshmandi.app.presentation.ui.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.GridLayoutManager
import com.freshmandi.app.databinding.FragmentHomeBinding
import com.freshmandi.app.presentation.viewmodel.ProductViewModel
import com.freshmandi.app.presentation.ui.adapters.ProductAdapter
import com.freshmandi.app.utils.UiState
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch

@AndroidEntryPoint
class HomeFragment : Fragment() {
    private lateinit var binding: FragmentHomeBinding
    private val productViewModel: ProductViewModel by viewModels()
    private lateinit var productAdapter: ProductAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupRecyclerView()
        setupListeners()
        observeViewModel()

        // Load products on fragment creation
        productViewModel.getProducts()
    }

    private fun setupRecyclerView() {
        productAdapter = ProductAdapter { productId ->
            navigateToProductDetail(productId)
        }
        binding.productsRecyclerView.apply {
            layoutManager = GridLayoutManager(requireContext(), 2)
            adapter = productAdapter
        }
    }

    private fun setupListeners() {
        binding.searchInput.setOnTextChangedListener { query ->
            if (query.isNotEmpty()) {
                productViewModel.getProducts(search = query)
            }
        }

        binding.cityFilter.onItemSelectedListener = object : android.widget.AdapterView.OnItemSelectedListener {
            override fun onNothingSelected(parent: android.widget.AdapterView<*>?) {}

            override fun onItemSelected(
                parent: android.widget.AdapterView<*>?,
                view: View?,
                position: Int,
                id: Long
            ) {
                val city = parent?.getItemAtPosition(position).toString()
                if (city != "All Cities") {
                    productViewModel.getProducts(city = city)
                }
            }
        }

        binding.categoryFilter.onItemSelectedListener = object : android.widget.AdapterView.OnItemSelectedListener {
            override fun onNothingSelected(parent: android.widget.AdapterView<*>?) {}

            override fun onItemSelected(
                parent: android.widget.AdapterView<*>?,
                view: View?,
                position: Int,
                id: Long
            ) {
                val category = parent?.getItemAtPosition(position).toString()
                if (category != "All Categories") {
                    productViewModel.getProducts(category = category)
                }
            }
        }
    }

    private fun observeViewModel() {
        lifecycleScope.launch {
            productViewModel.productsState.collect { state ->
                when (state) {
                    is UiState.Loading -> {
                        binding.loadingProgressBar.visibility = View.VISIBLE
                    }
                    is UiState.Success -> {
                        binding.loadingProgressBar.visibility = View.GONE
                        productAdapter.submitList(state.data)
                    }
                    is UiState.Error -> {
                        binding.loadingProgressBar.visibility = View.GONE
                        // Show error message
                    }
                }
            }
        }
    }

    private fun navigateToProductDetail(productId: String) {
        // TODO: Implement safe navigation to product detail
        // For now, navigation will be set up after resource compilation
    }
}

// Extension function for EditText change listener
fun android.widget.EditText.setOnTextChangedListener(onTextChanged: (String) -> Unit) {
    addTextChangedListener(object : android.text.TextWatcher {
        override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
        override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
            onTextChanged(s.toString())
        }

        override fun afterTextChanged(s: android.text.Editable?) {}
    })
}
