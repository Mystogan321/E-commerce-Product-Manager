# ProductHub - E-commerce Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

ProductHub is a modern e-commerce management system with product management, shopping cart functionality, and dark mode support. Built with React, TypeScript, and Redux Toolkit.

## Features

- **Product Management**
  - Add/Edit/Delete products
  - Rich text editor for product descriptions
  - Product search and pagination
- **Shopping Cart**
  - Add/Remove items
  - Quantity adjustment
  - Checkout simulation
- **UI/UX**
  - Dark/Light mode toggle
  - Responsive design
  - Loading states and animations
  - Form validation
- **State Management**
  - Redux Toolkit for global state
  - Local storage persistence
  - Async operations handling

## Installation

1. **Prerequisites**
   - Node.js v16+
   - npm v7+

2. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/producthub.git
   cd producthub
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## Usage

1. **Start the application**
   ```bash
   npm run dev
   ```

2. **Navigate through:**
   - Home Page: Browse products
   - Add Product: Create new products
   - Manage Products: Edit/Delete existing products
   - Cart: Manage shopping cart
   - Dark Mode: Toggle via moon/sun icon

## Tech Stack

- **Frontend**
  - React + TypeScript
  - Redux Toolkit + React-Redux
  - React Router v6
  - Tailwind CSS + Class Variance Authority
  - Radix UI Primitives
  - React Quill (WYSIWYG Editor)
  - Lucide React Icons

- **Build Tools**
  - Vite
  - ESLint
  - PostCSS + Autoprefixer

## Contributing

1. Fork the project
2. Create your feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Note:** This project uses local storage for data persistence. All product and cart data will persist between sessions but will be cleared when browser cache is cleared.
