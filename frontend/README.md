# Food Delivery Frontend

A modern, responsive food delivery web application built with React, Vite, and React Router.

## Features

### 🍕 Food Ordering
- Browse food items by category (Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles)
- View detailed food information with images and descriptions
- Add items to cart with quantity controls
- Real-time cart updates with item count display

### 🛒 Shopping Cart
- Add/remove items from cart
- Update item quantities
- View cart total with delivery fees
- Clear entire cart
- Responsive cart interface

### 🔐 User Authentication
- User registration with form validation
- User login with email/password
- User session management
- Protected checkout functionality

### 💳 Checkout Process
- Delivery information form
- Payment method selection (Cash on Delivery, Card)
- Order summary with item details
- Order confirmation page
- Form validation and error handling

### 🎨 Modern UI/UX
- Dark theme with orange accent colors
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Intuitive navigation
- Loading states and user feedback

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── context/          # Global state management
│   ├── navbar/           # Navigation component
│   ├── hero/             # Hero section
│   ├── exploremenu/      # Category selection
│   ├── fooddisplay/      # Food items grid
│   ├── fooditem/         # Individual food item
│   ├── fooditemdetail/   # Food item modal
│   └── footer/           # Footer component
├── pages/
│   ├── home/             # Home page
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout process
│   └── auth/
│       ├── login/        # Login page
│       └── signup/       # Registration page
└── assets/               # Images and static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Slick** - Carousel component
- **CSS3** - Styling with CSS variables
- **Context API** - State management

## Features in Detail

### State Management
- Global context for cart items, user authentication, and food data
- Persistent cart state during session
- User session management

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Responsive grid layouts
- Touch-friendly interface elements

### Form Validation
- Client-side validation for all forms
- Real-time error feedback
- Required field validation
- Email and phone number format validation

### User Experience
- Smooth page transitions
- Loading states for async operations
- Success/error feedback messages
- Intuitive navigation flow

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)