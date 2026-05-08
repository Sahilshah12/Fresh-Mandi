# FreshMandi – City-Based Farmer–Consumer Marketplace

A full-stack web application connecting local farmers with consumers in a city-based marketplace. Farmers can list their produce with images, manage inventory, and receive orders. Consumers can browse products by city and place orders. Admins can manage users and view analytics.

---

## 🚀 Technology Stack

**Frontend:**
- React.js 18
- Vite (dev server & build tool)
- Axios (API client)
- React Router DOM (routing)
- Tailwind CSS (styling - ready to integrate)

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- JWT (authentication)
- bcrypt.js (password hashing)
- Multer (file uploads)
- cloudinary (file save)

**Database:**
- MongoDB (Atlas)

---

## 📂 Project Structure

```
freshmandi/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, profile
│   │   ├── productController.js # Product CRUD + browse
│   │   ├── orderController.js  # Order placement & history
│   │   └── adminController.js  # User management & analytics
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── roles.js           # Role-based access control
│   │   └── upload.js          # Multer image upload config
│   ├── models/
│   │   ├── User.js            # User schema (farmer/consumer/admin)
│   │   ├── Product.js         # Product schema
│   │   └── Order.js           # Order schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── farmers.js         # Farmer product management
│   │   ├── products.js        # Public product browsing
│   │   ├── orders.js          # Order routes
│   │   └── admin.js           # Admin routes
│   ├── uploads/               # Uploaded product images
│   ├── .env                   # Environment variables (create from .env.example)
│   ├── .env.example           # Example environment variables
│   ├── package.json
│   └── server.js              # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components (add as needed)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── FarmerDashboard.jsx
│   │   │   └── ConsumerDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js         # Axios instance with JWT interceptor
│   │   ├── App.jsx            # Main app component with routes
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles (Tailwind ready)
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite configuration
│   ├── .env.example           # Example frontend env vars
│   └── package.json
└── README.md
```

---

## � HOW TO RUN THE PROJECT

### Prerequisites
- **Node.js** (v18+ recommended) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account)
  - Local: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas Free Tier](https://www.mongodb.com/cloud/atlas/register)

---

## 📋 QUICK START GUIDE (Step-by-Step)

### **Step 1: Install MongoDB (If not already installed)**

**Option A: Local MongoDB**
1. Download MongoDB Community Server
2. Install with default settings
3. MongoDB will run automatically on `mongodb://127.0.0.1:27017`

**Option B: MongoDB Atlas (Cloud)**
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/`)

---

### **Step 2: Setup Backend**

**Open PowerShell and navigate to backend:**
```powershell
cd C:\Capstone\freshmandi\backend
```

**Install all dependencies:**
```powershell
npm install
```

**Create environment file:**
```powershell
# Create .env file
New-Item .env -ItemType File

# Edit with notepad
notepad .env
```

**Add this to `.env` file:**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/freshmandi
JWT_SECRET=your_super_secret_jwt_key_change_this_123456
```

> **Note:** If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

**Start the backend server:**
```powershell
npm run dev
```

✅ **Success!** You should see:
```
Server running on port 5000
MongoDB Connected Successfully
```

**Keep this terminal open and running!**

---

### **Step 3: Setup Frontend**

**Open a NEW PowerShell terminal and navigate to frontend:**
```powershell
cd C:\Capstone\freshmandi\frontend
```

**Install all dependencies:**
```powershell
npm install
```

**Start the frontend dev server:**
```powershell
npm run dev
```

✅ **Success!** You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

**Keep this terminal open too!**

---

### **Step 4: Open the Application**

**Open your browser and go to:**
```
http://localhost:5173
```

🎉 **FreshMandi is now running!**

---

## 🧪 TESTING THE APPLICATION

### **1. Create Test Accounts**

#### **Register as Consumer:**
1. Click "Register"
2. Fill in:
   - Name: `Test Consumer`
   - Email: `consumer@test.com`
   - Password: `test123`
   - Role: `Consumer`
   - City: `Mumbai`
3. Click Register → Auto-login

#### **Register as Farmer:**
1. Logout (if logged in)
2. Click "Register"
3. Fill in:
   - Name: `Test Farmer`
   - Email: `farmer@test.com`
   - Password: `test123`
   - Role: `Farmer`
   - City: `Mumbai`
   - Mandi: `Test Mandi Location`
4. Click Register

#### **Create Admin (via MongoDB):**
**Option 1: Using MongoDB Compass**
1. Open MongoDB Compass
2. Connect to `mongodb://127.0.0.1:27017`
3. Open `freshmandi` database → `users` collection
4. Find any user and change:
   - `role`: `"admin"`
   - `approved`: `true`

**Option 2: Using Mongo Shell**
```bash
mongosh
use freshmandi
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin", approved: true } },
  { upsert: true }
)
```

---

### **2. Test Features**

#### **As Farmer:**
1. Login with farmer account
2. Go to "My Dashboard"
3. Click "Add Product"
4. Fill form with image
5. Click Save → See product in list
6. Try Edit, Delete

#### **As Consumer:**
1. Login with consumer account
2. Go to "Browse Products"
3. Filter by city/category
4. Click "View Details" on a product
5. Click "Add to Cart"
6. View cart (top right icon)
7. Proceed to Checkout
8. Place order

#### **As Admin:**
1. Login with admin account
2. Click "Admin Panel"
3. View Analytics (charts)
4. Approve pending farmers
5. Manage users/products/orders

---

## 🛠️ COMMON ISSUES & SOLUTIONS

### **Issue 1: MongoDB Connection Failed**
**Error:** `MongoDB connection error`

**Solution:**
```powershell
# Check if MongoDB is running
mongod --version

# If not installed, download and install MongoDB
# Or use MongoDB Atlas connection string
```

### **Issue 2: Port Already in Use**
**Error:** `Port 5000 is already in use`

**Solution:**
```powershell
# Kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/.env
PORT=5001
```

### **Issue 3: npm install fails**
**Error:** `npm ERR! ...`

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### **Issue 4: Images not uploading**
**Solution:**
```powershell
# Make sure uploads folder exists
cd backend
mkdir uploads
```

### **Issue 5: Farmer can't add products**
**Solution:**
- Farmers need admin approval first
- Login as admin → Approve the farmer
- Then farmer can add products

---

## 📁 IMPORTANT FILE LOCATIONS

```
C:\Capstone\freshmandi\
├── backend\
│   ├── .env                    ⚠️ CREATE THIS FILE
│   ├── uploads\                📁 Product images stored here
│   └── server.js               ▶️ Backend entry point
├── frontend\
│   └── src\
│       ├── App.jsx             ▶️ Main app component
│       └── pages\              📄 All page components
└── README.md                   📖 You are here
```

---

## 🔑 DEFAULT API ENDPOINTS

**Backend running at:** `http://localhost:5000`

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/products` - Browse products
- `POST /api/orders` - Place order
- `GET /api/admin/users` - Admin user list

**Full API documentation:** See [API_DOCS.md](./API_DOCS.md)

---

## 📊 RUNNING AUTOMATED TESTS

**Test all backend APIs:**
```powershell
cd C:\Capstone\freshmandi\backend
node test-complete.js
```

---

## 🎯 QUICK COMMAND REFERENCE

### **Start Everything:**
```powershell
# Terminal 1 - Backend
cd C:\Capstone\freshmandi\backend
npm run dev

# Terminal 2 - Frontend  
cd C:\Capstone\freshmandi\frontend
npm run dev
```

### **Stop Servers:**
- Press `Ctrl + C` in each terminal

### **Restart After Changes:**
- Backend auto-restarts (nodemon)
- Frontend auto-reloads (Vite HMR)

---

## 🌐 ACCESS URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main application |
| Backend API | http://localhost:5000 | API endpoints |
| MongoDB | mongodb://127.0.0.1:27017 | Database |

---

## ✅ VERIFICATION CHECKLIST

Before testing, ensure:

- [ ] MongoDB is running (local or Atlas)
- [ ] Backend `.env` file exists with correct values
- [ ] Backend server started successfully (port 5000)
- [ ] Frontend server started successfully (port 5173)
- [ ] Browser opened at http://localhost:5173
- [ ] No error messages in terminals

---

## 📞 NEED HELP?

1. Check error messages in both terminals
2. Review [Common Issues](#common-issues--solutions) section
3. Verify all prerequisites are installed
4. Check MongoDB connection
5. Ensure both servers are running

---
```env
VITE_API_BASE=http://localhost:5000/api
```

**Start the frontend dev server:**
```powershell
npm run dev
```

Frontend will run at: **http://localhost:5173**

---

## 🎯 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login and get JWT token | No |
| GET | `/profile` | Get current user profile | Yes |

### Farmer Routes (`/api/farmers`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/products` | Add new product (with image) | Yes | Farmer |
| GET | `/products` | Get farmer's products | Yes | Farmer |
| PUT | `/products/:id` | Update product | Yes | Farmer |
| DELETE | `/products/:id` | Delete product | Yes | Farmer |

### Public Product Routes (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/?city=CityName` | Browse products by city | No |
| GET | `/:id` | Get product details | No |

### Order Routes (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Place an order | Yes (Consumer) |
| GET | `/` | Get order history | Yes |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/users` | List all users | Yes | Admin |
| PUT | `/user/:id/approve` | Approve/block farmer | Yes | Admin |
| GET | `/analytics` | Get platform analytics | Yes | Admin |

---

## 🧪 Testing the Application

### 1. Register Users
1. Open http://localhost:5173/register
2. Register a **Farmer** account:
   - Name: John Farmer
   - Email: farmer@test.com
   - Password: password123
   - Role: **Farmer**
   - City: Mumbai
   - Mandi Location: Andheri Mandi

3. Register a **Consumer** account:
   - Name: Jane Consumer
   - Email: consumer@test.com
   - Password: password123
   - Role: **Consumer**
   - City: Mumbai

### 2. Login as Farmer
1. Go to http://localhost:5173/login
2. Login with farmer credentials
3. Token is automatically saved to localStorage

### 3. Add Products (Farmer)
1. Navigate to http://localhost:5173/farmer
2. Fill the product form:
   - Name: Fresh Tomatoes
   - Category: Vegetables
   - Price: 40
   - Quantity: 100
   - City: Mumbai
   - Image: Upload an image file
3. Click "Create Product"
4. Product ID will be shown in alert

### 4. Browse Products (Consumer)
- You can call the API directly or build a consumer dashboard:
  ```
  GET http://localhost:5000/api/products?city=Mumbai
  ```

### 5. View Uploaded Images
- Images are accessible at: `http://localhost:5000/uploads/<filename>`

---

## 📝 Database Models

### User Schema
```javascript
{
  name: String (required)
  email: String (required, unique)
  passwordHash: String (required)
  role: String (enum: 'farmer' | 'consumer' | 'admin')
  city: String
  mandi: String (for farmers)
  approved: Boolean (default: false)
  timestamps: true
}
```

### Product Schema
```javascript
{
  farmerId: ObjectId (ref: User, required)
  name: String (required)
  category: String
  price: Number (required)
  quantity: Number
  imageURL: String (e.g., /uploads/123456-tomato.jpg)
  city: String
  available: Boolean (default: true)
  timestamps: true
}
```

### Order Schema
```javascript
{
  consumerId: ObjectId (ref: User, required)
  farmerId: ObjectId (ref: User, required)
  products: [{ productId, name, price, quantity }]
  totalPrice: Number (required)
  deliveryMode: String (enum: 'pickup' | 'delivery')
  status: String (enum: 'pending' | 'accepted' | 'delivered' | 'cancelled')
  timestamps: true
}
```

---

## 🎨 Frontend Pages

- **Home** (`/`) - Landing page
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration with role selection
- **Farmer Dashboard** (`/farmer`) - Add/manage products with image upload
- **Consumer Dashboard** (`/consumer`) - Browse and order products (placeholder)

---

## 🔐 Authentication Flow

1. **Register**: User creates account with role (farmer/consumer/admin)
2. **Login**: Returns JWT token
3. **Token Storage**: Frontend stores token in `localStorage`
4. **API Requests**: Axios interceptor automatically adds `Authorization: Bearer <token>` header
5. **Backend Verification**: `auth` middleware validates token and attaches user to `req.user`
6. **Role Check**: `roles` middleware restricts routes by user role

---

## 🚧 Next Steps & Enhancements

### Immediate Improvements
- [ ] Add Tailwind CSS (install `tailwindcss`, `postcss`, `autoprefixer` and configure)
- [ ] Add express-validator for input validation
- [ ] Implement product listing on Consumer Dashboard
- [ ] Add product edit/delete UI for Farmer Dashboard
- [ ] Add order placement UI for consumers
- [ ] Create Admin Dashboard UI

### Advanced Features
- [ ] Add Recharts for analytics visualization
- [ ] Implement WebSocket for real-time order updates
- [ ] Add QR code generation for products
- [ ] Integrate Razorpay sandbox for payment demo
- [ ] Add search & filter (category, price range)
- [ ] Implement pagination for product listings
- [ ] Add image optimization and CDN support
- [ ] Convert to PWA (Progressive Web App)
- [ ] Add unit tests (Jest) and E2E tests (Playwright)
- [ ] Add email notifications (nodemailer)
- [ ] Deploy to production (Vercel/Netlify + Railway/Render)

### Security Enhancements
- [ ] Add rate limiting (express-rate-limit)
- [ ] Implement CSRF protection
- [ ] Add helmet.js for security headers
- [ ] Implement refresh tokens
- [ ] Add 2FA for admin accounts

---

## 🐛 Troubleshooting

### Backend won't start
- **Check MongoDB**: Ensure MongoDB is running locally or Atlas URI is correct
- **Port conflict**: Change `PORT` in `.env` if 5000 is in use
- **Missing dependencies**: Run `npm install` again

### Frontend won't start
- **Check backend**: Ensure backend is running at http://localhost:5000
- **CORS errors**: Backend already has CORS enabled
- **Missing dependencies**: Run `npm install` again

### Image upload fails
- **File size**: Max 5MB per image
- **File type**: Only image files accepted (jpg, png, gif, etc.)
- **Permissions**: Ensure backend can write to `backend/uploads/` folder

### Auth errors (401)
- **Token missing**: Login again and check localStorage has `token`
- **Expired token**: Tokens expire in 7 days, login again
- **Wrong role**: Some routes require specific roles (farmer/admin)

---

## 📜 License

This project is created for educational purposes as a capstone project.

---

## 👥 Contributors

- Your Name - Full Stack Development

---

## 📞 Support

For issues or questions, please open an issue in the repository or contact the maintainer.

---

**Happy Coding! 🌱🛒**
