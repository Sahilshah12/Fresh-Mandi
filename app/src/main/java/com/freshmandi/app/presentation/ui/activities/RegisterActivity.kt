package com.freshmandi.app.presentation.ui.activities

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.freshmandi.app.databinding.ActivityRegisterBinding
import com.freshmandi.app.data.models.RegisterRequest
import com.freshmandi.app.presentation.viewmodel.AuthViewModel
import com.freshmandi.app.utils.UiState
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch

@AndroidEntryPoint
class RegisterActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegisterBinding
    private val authViewModel: AuthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUI()
        observeViewModel()
    }

    private fun setupUI() {
        binding.registerButton.setOnClickListener {
            val name = binding.nameInput.text.toString().trim()
            val email = binding.emailInput.text.toString().trim()
            val password = binding.passwordInput.text.toString().trim()
            val confirmPassword = binding.confirmPasswordInput.text.toString().trim()
            val city = binding.cityInput.text.toString().trim()
            val phone = binding.phoneInput.text.toString().trim()
            val role = if (binding.farmerRadio.isChecked) "farmer" else "consumer"

            if (name.isEmpty() || email.isEmpty() || password.isEmpty() || 
                confirmPassword.isEmpty() || city.isEmpty() || phone.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (password != confirmPassword) {
                Toast.makeText(this, "Passwords don't match", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val request = RegisterRequest(
                name = name,
                email = email,
                password = password,
                role = role,
                city = city,
                phone = phone,
                state = binding.stateInput.text.toString().trim(),
                address = binding.addressInput.text.toString().trim(),
                pincode = binding.pincodeInput.text.toString().trim()
            )

            authViewModel.register(request)
        }

        binding.loginLink.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }

    private fun observeViewModel() {
        lifecycleScope.launch {
            authViewModel.registerState.collect { state ->
                when (state) {
                    is UiState.Loading -> {
                        binding.registerButton.isEnabled = false
                        binding.progressBar.visibility = View.VISIBLE
                    }
                    is UiState.Success -> {
                        binding.registerButton.isEnabled = true
                        binding.progressBar.visibility = View.GONE
                        Toast.makeText(this@RegisterActivity, "Registration successful!", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this@RegisterActivity, MainActivity::class.java))
                        finish()
                    }
                    is UiState.Error -> {
                        binding.registerButton.isEnabled = true
                        binding.progressBar.visibility = View.GONE
                        Toast.makeText(this@RegisterActivity, "Registration failed: ${state.exception.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }
}
