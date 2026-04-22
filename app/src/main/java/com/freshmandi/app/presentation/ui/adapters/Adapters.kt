package com.freshmandi.app.presentation.ui.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.freshmandi.app.R
import com.freshmandi.app.data.models.Product
import com.freshmandi.app.data.models.OrderProduct
import com.freshmandi.app.databinding.ItemProductBinding
import com.freshmandi.app.databinding.ItemCartBinding

class ProductAdapter(
    private val onItemClick: (String) -> Unit
) : ListAdapter<Product, ProductAdapter.ProductViewHolder>(ProductDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val binding = ItemProductBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ProductViewHolder(binding, onItemClick)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class ProductViewHolder(
        private val binding: ItemProductBinding,
        private val onItemClick: (String) -> Unit
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(product: Product) {
            binding.apply {
                productName.text = product.name
                productPrice.text = "₹${product.price}"
                productCategory.text = product.category
                productRating.text = "★ ${product.averageRating}"

                if (product.imageURL.isNotEmpty()) {
                    Glide.with(itemView.context)
                        .load(product.imageURL)
                        .fitCenter()
                        .into(productImage)
                }

                root.setOnClickListener {
                    onItemClick(product.id)
                }
            }
        }
    }

    private class ProductDiffCallback : DiffUtil.ItemCallback<Product>() {
        override fun areItemsTheSame(oldItem: Product, newItem: Product) =
            oldItem.id == newItem.id

        override fun areContentsTheSame(oldItem: Product, newItem: Product) =
            oldItem == newItem
    }
}

class CartAdapter(
    private val onQuantityChange: (String, Int) -> Unit,
    private val onRemove: (String) -> Unit
) : ListAdapter<OrderProduct, CartAdapter.CartViewHolder>(CartDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CartViewHolder {
        val binding = ItemCartBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return CartViewHolder(binding, onQuantityChange, onRemove)
    }

    override fun onBindViewHolder(holder: CartViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class CartViewHolder(
        private val binding: ItemCartBinding,
        private val onQuantityChange: (String, Int) -> Unit,
        private val onRemove: (String) -> Unit
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(item: OrderProduct) {
            binding.apply {
                productNameText.text = item.name
                productPriceText.text = "₹${item.price}"
                quantityText.text = "${item.quantity}"
                totalPriceText.text = "₹${item.price * item.quantity}"

                increaseButton.setOnClickListener {
                    onQuantityChange(item.productId, item.quantity + 1)
                }

                decreaseButton.setOnClickListener {
                    if (item.quantity > 1) {
                        onQuantityChange(item.productId, item.quantity - 1)
                    }
                }

                removeButton.setOnClickListener {
                    onRemove(item.productId)
                }
            }
        }
    }

    private class CartDiffCallback : DiffUtil.ItemCallback<OrderProduct>() {
        override fun areItemsTheSame(oldItem: OrderProduct, newItem: OrderProduct) =
            oldItem.productId == newItem.productId

        override fun areContentsTheSame(oldItem: OrderProduct, newItem: OrderProduct) =
            oldItem == newItem
    }
}
