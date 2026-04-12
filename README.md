# 🛍️ DeepakShop - Online Store

A full-stack e-commerce web application built with Django REST Framework (backend) and React.js (frontend), featuring product categories, filtering, sorting, shopping cart, and checkout functionality.

## ✨ Features

### Backend (Django REST API)
- RESTful API with Django REST Framework
- Product categories (Electronics, Fashion, Home Appliances, Books)
- Product filtering (by category, price range, rating)
- Product sorting (price: low-high, price: high-low, rating)
- Search functionality
- Featured products endpoint
- SQLite database (easy setup)

### Frontend (React.js)
- Responsive design with Tailwind CSS
- Product listing with cards
- Filter sidebar with category, price, and rating filters
- Sort products by price and rating
- Search products
- Shopping cart with localStorage persistence
- Checkout process (3-step form)
- Order success page
- Mobile-responsive navbar with hamburger menu
- Font Awesome icons

## 🚀 Live Demo
[DeepakShop➡️](https://online-store-spcl-m6x1.vercel.app/)

## 📁 Project Structure
```
online-store/
├── backend/                 # Django backend
│   ├── api/                # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── app/                # Main application
│   │   ├── models.py       # Category & Product models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # DRF serializers
│   │   ├── urls.py         # App URLs
│   │   └── management/     # Custom commands
│   │       └── commands/
│   │           ├── seed_categories.py
│   │           └── seed_products.py
│   ├── db.sqlite3          # SQLite database
│   ├── manage.py
│   ├── requirements.txt
│   └── vercel.json
└── frontend/               # React frontend
    ├── src/
    │   ├── components/     # Reusable components
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   └── Layout.jsx
    │   ├── pages/          # Page components
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── FilterSidebar.jsx
    │   │   ├── OrderSuccess.jsx
    │   │   ├── About.jsx
    │   │   └── Contact.jsx
    │   ├── services/       # API services
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    ├── public/
    ├── package.json
    └── vercel.json
```
## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- Git

## 🛠️ Installation

### 1. Clone the Repository

```
git clone https://github.com/yourusername/online-store.git
cd online-store
```
### 2. Backend Setup (Django)
```
# Navigate to backend directory
cd backend

# Create virtual environment
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Seed database with sample products
python manage.py seed_categories
python manage.py seed_products

# Create superuser (optional)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```
### 3. Frontend Setup (React)
```
# Open new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Install additional packages (if not in package.json)
npm install axios react-router-dom react-hot-toast @fortawesome/fontawesome-free

# Run development server
npm run dev
```

### 🔧 Environment Variables
```
1.Backend (.env)
env
SECRET_KEY=your-django-secret-key
DEBUG=True
2.Frontend (.env)
env
VITE_API_URL=http://localhost:8000/api
```

### 👨‍💻 Author
**Deepak Maharana**

- 📧 Email: deepakmaharana3500@gmail.com  
- 💼 LinkedIn: https://www.linkedin.com/in/deepak-maharana-3a7728325  
- 🌐 Portfolio: https://my-portfolio-chi-nine-4vbjyr31n2.vercel.app/  
- 🐙 GitHub: https://github.com/deepakmaharana278

### 🙏 Acknowledgements
- Django REST Framework documentation
- React.js documentation
- Tailwind CSS
- Vercel for hosting
