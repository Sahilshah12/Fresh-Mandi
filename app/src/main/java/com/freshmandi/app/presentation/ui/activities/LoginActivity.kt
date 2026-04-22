package com.freshmandi.app.presentation.ui.activities

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.freshmandi.app.databinding.ActivityLoginBinding
import com.freshmandi.app.presentation.viewmodel.AuthViewModel
import com.freshmandi.app.utils.UiState
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch

@AndroidEntryPoint
class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private val authViewModel: AuthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Check if already logged in
        lifecycleScope.launch {
            authViewModel.isLoggedIn.collect { isLoggedIn ->
                if (isLoggedIn) {
                    navigateToHome()
                }
            }
        }

        setupUI()
        observeViewModel()
    }

    private fun setupUI() {
        binding.loginButton.setOnClickListener {
            val email = binding.emailInput.text.toString().trim()
            val password = binding.passwordInput.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            authViewModel.login(email, password)
        }

        binding.registerLink.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun observeViewModel() {
        lifecycleScope.launch {
            authViewModel.loginState.collect { state ->
                when (state) {
                    is UiState.Loading -> {
                        binding.loginButton.isEnabled = false
                        binding.progressBar.visibility = View.VISIBLE
                    }
                    is UiState.Success -> {
                        binding.loginButton.isEnabled = true
                        binding.progressBar.visibility = View.GONE
                        Toast.makeText(this@LoginActivity, "Login successful!", Toast.LENGTH_SHORT).show()
                        navigateToHome()
                    }
                    is UiState.Error -> {
                        binding.loginButton.isEnabled = true
                        binding.progressBar.visibility = View.GONE
                        Toast.makeText(this@LoginActivity, "Login failed: ${state.exception.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }

    private fun navigateToHome() {
        startActivity(Intent(this, MainActivity::class.java))
        finish()
    }
}
