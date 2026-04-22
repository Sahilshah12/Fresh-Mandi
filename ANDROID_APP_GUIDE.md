# FreshMandi Android App - Development Guide

## Project Overview
A complete Android app mirror of your FreshMandi React website, built with Kotlin and modern Android architecture.

---

## Technology Stack

### Architecture
- **MVVM** (Model-View-ViewModel) Pattern
- **Clean Architecture** with separated data, domain, and presentation layers
- **Hilt** for Dependency Injection
- **Coroutines** for async operations
- **Flow** for reactive data streams

### Key Libraries
|Library|Version|Purpose|
|-------|-------|-------|
|Retrofit 2|2.10.0|HTTP client for API calls|
|Room|2.6.1|Local database for caching|
|Glide|4.16.0|Image loading and caching|
|Socket.IO|4.5.4|Real-time notifications|
|Hilt|2.48|Dependency injection|
|Navigation|2.7.6|Fragment navigation|
|DataStore|1.0.0|Secure preferences storage|

---

## Project Structure

```
app/
├── src/main/
│   ├── java/com/freshmandi/app/
│   │   ├── data/
│   │   │   ├── api/                 # Retrofit API service
│   │   │   ├── database/            # Room DAO and database
│   │   │   ├── models/              # Data classes
│   │   │   └── repository/          # Repository pattern
│   │   ├── presentation/
│   │   │   ├── ui/
│   │   │   │   ├── activities/      # Activities (Login, Register, Main)
│   │   │   │   ├── fragments/       # Fragments (Home, Product, Cart, etc)
│   │   │   │   └── adapters/        # RecyclerView adapters
│   │   │   └── viewmodel/           # ViewModels
│   │   ├── di/                      # Hilt dependency injection
│   │   ├── utils/                   # Utilities and helpers
│   │   └── FreshMandiApp.kt         # Application class
│   └── res/
│       ├── layout/                  # XML layouts
│       ├── drawable/                # Drawable resources
│       ├── menu/                    # Menu files
│       ├── navigation/              # Navigation graph
│       └── values/                  # Strings, colors, arrays
```

---

## Key Features Implemented

### 1. Authentication Module
- **LoginActivity.kt** - User login with JWT token handling
- **RegisterActivity.kt** - User registration with role selection
- **AuthViewModel.kt** - Authentication state management
- **PreferenceManager.kt** - Secure token storage with DataStore

### 2. Product Browsing
- **HomeFragment.kt** - Product listing with filters
- **ProductDetailFragment.kt** - Detailed product view
- **ProductAdapter.kt** - Product list RecyclerView
- Filtering by: City, Category, Price, Search term

### 3. Shopping Cart
- **CartFragment.kt** - View and manage cart items
- **CartAdapter.kt** - Cart items RecyclerView
- **OrderViewModel.kt** - Cart management and total calculation

### 4. Orders Management
- **OrdersFragment.kt** - View order history
- **OrderDetailFragment.kt** - Order tracking details
- Order status updates in real-time

### 5. User Profile
- **ProfileFragment.kt** - User profile management
- Edit profile information
- View user details and preferences

### 6. Notifications
- Real-time notifications via Socket.IO
- Local notification storage with Room
- Unread notification count

---

## API Connection Setup

### 1. Update Base URL
Edit `RetrofitClient.kt` and update:
```kotlin
private const val BASE_URL = "http://YOUR_BACKEND_URL:5000/"
```

### 2. Configure API Service
The `FreshMandiApiService.kt` interface defines all endpoints matching your backend:

**Auth Endpoints:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

**Product Endpoints:**
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/farmers/products`
- `PUT /api/farmers/products/{id}`
- `DELETE /api/farmers/products/{id}`

**Order Endpoints:**
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/{id}`
- `PUT /api/orders/{id}/cancel`

**Additional Endpoints:**
- Reviews: `/api/reviews/*`
- Notifications: `/api/notifications`
- Admin: `/api/admin/*`

---

## UI/UX Consistency with Website

### Color Scheme (Green Theme)
- **Primary Green**: `#059669` (Emerald-600)
- **Dark Gray**: `#1F2937`
- **Light Gray**: `#F3F4F6`
- **Success Red**: `#DC2626`
- **Warning Orange**: `#F59E0B`

### Layout Patterns
1. **Cards** - Product and order cards with consistent styling
2. **Buttons** - Rounded corner buttons with green background
3. **Input Fields** - Light gray background with subtle borders
4. **Filters** - Dropdowns and search at the top of list screens
5. **Navigation** - Bottom navigation bar with 4 main tabs

### Responsive Design
- Adapts to different screen sizes
- Grid layout for products (2 columns on mobile)
- Horizontal scrolling for category filters
- Flexible spacing and padding

---

## Building and Running the App

### Prerequisites
- Android Studio (Latest)
- Java JDK 11+
- Android SDK 34 (API Level 34)
- Emulator or Physical Device (API 24+)

### Steps to Build

1. **Open in Android Studio**
   ```
   File → Open → Select freshmandi/app folder
   ```

2. **Configure Database Backend URL**
   - Edit `RetrofitClient.kt`
   - Set your backend server URL

3. **Build the Project**
   ```
   Build → Build Bundle(s) / APK(s) → Build APK(s)
   ```

4. **Run on Device/Emulator**
   ```
   Run → Run 'app' (or press Shift+F10)
   ```

---

## Database Schema (Room)

### Users Table
```sql
CREATE TABLE users (
    _id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT,
    city TEXT,
    state TEXT,
    address TEXT,
    pincode TEXT,
    phone TEXT,
    createdAt TEXT
);
```

### Products Table
```sql
CREATE TABLE products (
    _id TEXT PRIMARY KEY,
    farmerId TEXT,
    name TEXT,
    category TEXT,
    price REAL,
    quantity INTEGER,
    unit TEXT,
    imageURL TEXT,
    city TEXT,
    available BOOLEAN,
    averageRating REAL,
    reviewCount INTEGER,
    createdAt TEXT
);
```

### Orders Table
```sql
CREATE TABLE orders (
    _id TEXT PRIMARY KEY,
    consumerId TEXT,
    farmerId TEXT,
    products TEXT (JSON),
    totalPrice REAL,
    status TEXT,
    createdAt TEXT
);
```

---

## State Management

### ViewModel Classes

#### AuthViewModel
- Manages login, register, profile operations
- Maintains user session state
- Handles JWT token storage

#### ProductViewModel
- Fetches products with filters
- Manages product detail state
- Caches products locally

#### OrderViewModel
- Manages shopping cart state
- Calculates totals
- Creates orders

```kotlin
// Example usage in Fragment
val viewModel: ProductViewModel by viewModels()

viewModel.productsState.collect { state ->
    when (state) {
        is UiState.Loading -> showLoader()
        is UiState.Success -> showProducts(state.data)
        is UiState.Error -> showError(state.exception)
    }
}
```

---

## Key Implementation Details

### 1. JWT Authentication
- Token stored in DataStore (encrypted)
- Automatically added to all API requests via `AuthInterceptor`
- Token refresh on 401 response

### 2. Image Loading
- Glide handles image loading and caching
- Placeholder images during loading
- Error handling for failed loads

### 3. Offline Support
- Products cached locally in Room database
- Orders stored locally before sync
- Auto-sync when network available

### 4. Error Handling
- Network error messages shown to user
- Validation errors displayed in UI
- Proper exception logging

### 5. Performance Optimizations
- Pagination for product lists (future)
- Image compression with Glide
- Database query optimization with indexes
- Coroutines for non-blocking operations

---

## Next Steps / TODO

### Immediate
- [ ] Create remaining fragment layouts (Checkout, Orders, Profile)
- [ ] Implement farmer dashboard features
- [ ] Add admin dashboard screens
- [ ] Complete notification system integration
- [ ] Add Socket.IO real-time updates

### Short Term
- [ ] Implement pagination for product lists
- [ ] Add search suggestions/autocomplete
- [ ] Image upload for farmer products
- [ ] Payment gateway integration
- [ ] Push notification setup

### Medium Term
- [ ] Offline capability enhancements
- [ ] Performance optimizations
- [ ] Unit and UI test coverage
- [ ] Analytics integration
- [ ] Crash reporting (Firebase)

### Long Term
- [ ] App Store release optimization
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Advanced filtering options
- [ ] Social features (reviews, ratings)

---

## Testing

### Unit Tests
```kotlin
// Example test
@Test
fun testAddToCart() {
    val product = Product(...)
    viewModel.addToCart(product, 2)
    assert(viewModel.cart.value.size == 1)
}
```

### UI Tests (Espresso)
```kotlin
@Test
fun testLoginFlow() {
    onView(withId(R.id.emailInput)).perform(typeText("test@example.com"))
    onView(withId(R.id.loginButton)).perform(click())
    // Verify navigation
}
```

---

## Troubleshooting

### Common Issues

1. **Build Errors - Missing Navigation Directions**
   - Solution: Build project first to generate navigation directions
   - Command: `Build → Clean Project → Build Project`

2. **API Connection Issues**
   - Check base URL in `RetrofitClient.kt`
   - Ensure backend is running on expected port
   - Check network permissions in `AndroidManifest.xml`

3. **Database Migration Errors**
   - Room uses `fallbackToDestructiveMigration()`
   - App will clear data on schema changes
   - Implement proper migrations for production

4. **Image Loading Issues**
   - Verify image URLs are accessible
   - Check network permissions
   - Use `android:allowBackup="true"` for debugging

---

## Contributing Guidelines

1. Follow Kotlin coding conventions
2. Use ViewModel for state management
3. Keep UI logic in Fragments, business logic in ViewModels
4. Add proper error handling
5. Write meaningful commit messages
6. Test changes before pushing

---

## Additional Resources

- [Android Developers Guide](https://developer.android.com/)
- [Jetpack Libraries Documentation](https://developer.android.com/jetpack)
- [Hilt Dependency Injection](https://developer.android.com/training/dependency-injection/hilt-android)
- [Room Database](https://developer.android.com/training/data-storage/room)
- [Retrofit](https://square.github.io/retrofit/)
- [Coroutines](https://kotlinlang.org/docs/coroutines-overview.html)

---

## License

This app is part of the FreshMandi project. All rights reserved.

---

**Last Updated**: April 2026
**Version**: 1.0
**Status**: Development
