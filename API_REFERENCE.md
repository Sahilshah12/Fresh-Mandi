# FreshMandi API Quick Reference

Base URL: `http://localhost:5000/api`

## 🔐 Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer",        // or "consumer" or "admin"
  "city": "Mumbai",
  "mandi": "Andheri Mandi" // optional, for farmers
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "name": "...", "email": "...", "role": "..." }
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>

Response:
{
  "user": { "id": "...", "name": "...", "email": "...", "role": "...", "city": "..." }
}
```

---

## 👨‍🌾 Farmer Endpoints (Require `role: farmer`)

### Add Product
```http
POST /farmers/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- name: "Fresh Tomatoes"
- category: "Vegetables"
- price: 50
- quantity: 100
- city: "Mumbai"
- image: <file>

Response:
{
  "_id": "...",
  "farmerId": "...",
  "name": "Fresh Tomatoes",
  "price": 50,
  "imageURL": "/uploads/1234567890-tomato.jpg",
  ...
}
```

### Get My Products
```http
GET /farmers/products
Authorization: Bearer <token>

Response:
[
  { "_id": "...", "name": "...", "price": 50, ... },
  ...
]
```

### Update Product
```http
PUT /farmers/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 60,
  "quantity": 150,
  "available": true
}
```

### Delete Product
```http
DELETE /farmers/products/:id
Authorization: Bearer <token>

Response:
{ "message": "Deleted" }
```

---

## 🛒 Public Product Endpoints (No Auth Required)

### Browse Products by City
```http
GET /products?city=Mumbai

Response:
[
  {
    "_id": "...",
    "name": "Fresh Tomatoes",
    "category": "Vegetables",
    "price": 50,
    "quantity": 100,
    "imageURL": "/uploads/...",
    "city": "Mumbai",
    "farmerId": {
      "name": "John Farmer",
      "city": "Mumbai",
      "mandi": "Andheri Mandi"
    }
  },
  ...
]
```

### Get Product Details
```http
GET /products/:id

Response:
{
  "_id": "...",
  "name": "Fresh Tomatoes",
  "category": "Vegetables",
  "price": 50,
  "imageURL": "/uploads/...",
  "farmerId": { "name": "John Farmer", ... }
}
```

---

## 📦 Order Endpoints (Require Auth)

### Place Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "farmerId": "...",
  "products": [
    {
      "productId": "...",
      "name": "Tomatoes",
      "price": 50,
      "quantity": 5
    }
  ],
  "totalPrice": 250,
  "deliveryMode": "pickup"  // or "delivery"
}

Response:
{
  "_id": "...",
  "consumerId": "...",
  "farmerId": "...",
  "status": "pending",
  ...
}
```

### Get Order History
```http
GET /orders
Authorization: Bearer <token>

Response (for consumer):
[
  {
    "_id": "...",
    "farmerId": { "name": "John Farmer" },
    "products": [...],
    "totalPrice": 250,
    "status": "pending"
  },
  ...
]

Response (for farmer):
[
  {
    "_id": "...",
    "consumerId": { "name": "Jane Consumer" },
    "products": [...],
    "totalPrice": 250,
    "status": "pending"
  },
  ...
]
```

---

## 👑 Admin Endpoints (Require `role: admin`)

### List All Users
```http
GET /admin/users
Authorization: Bearer <token>

Response:
[
  {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer",
    "city": "Mumbai",
    "approved": false
  },
  ...
]
```

### Approve/Block Farmer
```http
PUT /admin/user/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "approve": true  // or false to block
}

Response:
{
  "_id": "...",
  "name": "John Farmer",
  "approved": true,
  ...
}
```

### Get Analytics
```http
GET /admin/analytics
Authorization: Bearer <token>

Response:
{
  "totalUsers": 150,
  "totalFarmers": 45
}
```

---

## 🖼️ Image URLs

Uploaded images are served at:
```
http://localhost:5000/uploads/<filename>
```

Example:
```
http://localhost:5000/uploads/1761809639380-tomato.jpg
```

---

## 🔑 Authorization Header Format

All authenticated requests must include:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ❌ Error Responses

```json
{
  "message": "Error description here"
}
```

Common Status Codes:
- `400` - Bad Request (missing fields, validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient role)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing with cURL

### Register and Login
```powershell
# Register
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test","email":"test@test.com","password":"pass123","role":"farmer","city":"Mumbai"}'

# Login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@test.com","password":"pass123"}'
```

### Create Product with Image
```powershell
$token = "your_jwt_token_here"

curl -X POST http://localhost:5000/api/farmers/products `
  -H "Authorization: Bearer $token" `
  -F "name=Tomatoes" `
  -F "category=Vegetables" `
  -F "price=50" `
  -F "quantity=100" `
  -F "city=Mumbai" `
  -F "image=@C:\path\to\image.jpg"
```

### Browse Products
```powershell
curl http://localhost:5000/api/products?city=Mumbai
```

---

## 📱 Frontend Usage (Axios)

```javascript
import API from './services/api'

// Login
const { data } = await API.post('/auth/login', { email, password })
localStorage.setItem('token', data.token)

// Create product with image
const formData = new FormData()
formData.append('name', 'Tomatoes')
formData.append('price', 50)
formData.append('image', fileObject)

await API.post('/farmers/products', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

// Browse products
const { data } = await API.get('/products?city=Mumbai')
```

---

**Need help?** Check the main README.md or ROADMAP.md
