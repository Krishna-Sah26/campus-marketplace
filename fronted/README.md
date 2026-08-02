# Campus Market

A modern, professional college marketplace website built with React and Tailwind CSS for students to buy and sell used items.

## Features

- **Modern UI/UX**: Clean design with glassmorphism navbar, smooth animations, and responsive layout
- **Marketplace Functionality**: Browse items by category, search functionality, and verified seller badges
- **Sell Items**: Easy-to-use form to list items with local storage persistence
- **Responsive Design**: Fully mobile-friendly with adaptive layouts
- **Demo Data**: Pre-loaded with realistic demo items using Unsplash images

## Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Hooks (useState, useEffect)
- **Data Storage**: Local Storage

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd campus-market
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation with search and glassmorphism effect
│   ├── Hero.jsx            # Hero section with background image
│   ├── Categories.jsx      # Category grid with icons
│   ├── FeaturedItems.jsx   # Marketplace items display
│   ├── HowItWorks.jsx      # 3-step process explanation
│   ├── Benefits.jsx        # Benefits section
│   ├── Footer.jsx          # Site footer
│   └── SellForm.jsx        # Item listing form
├── App.jsx                 # Main application component
├── main.jsx                # React entry point
└── index.css               # Tailwind CSS imports and custom styles
```

## Features Overview

### Landing Page Sections
- **Navbar**: Glassmorphism effect with search bar and sell button
- **Hero**: Full-screen background image with call-to-action buttons
- **Categories**: 6 main categories (Books, Lab Equipment, Drawing Kits, Electronics, Hostel Items, Aprons)
- **Featured Items**: Grid layout with product cards, hover effects, and verification badges
- **How It Works**: 3-step process explanation
- **Benefits**: 6 key benefits with icons
- **Footer**: Comprehensive footer with links and social media

### Marketplace Features
- Product cards with images, prices, descriptions, and categories
- "Verified" badges for trusted sellers
- Hover animations and scaling effects
- Search functionality across item names and categories
- Grid layout optimized for different screen sizes

### Sell Feature
- Modal form for adding new items
- Fields: name, price, description, image URL, category
- Data persistence using localStorage
- Form validation and user feedback

### UI Enhancements
- Button glow effects on hover
- Card shadow and scale animations
- Smooth scrolling and fade-in animations
- Consistent blue, white, and green color scheme
- Professional typography and spacing

## Demo Items

The application comes pre-loaded with 6 demo items:
1. Calculus Textbook ($25)
2. Lab Equipment Set ($50)
3. Drawing Kit ($30)
4. Laptop Charger ($15)
5. Hostel Bedding Set ($40)
6. Chef Apron ($10)

All images sourced from Unsplash for realistic appearance.

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:
- Primary: Blue (#2563eb)
- Secondary: Green (#16a34a)
- Background: White and gray variations

### Adding New Categories
Add new categories in the `categories` array in `Categories.jsx` and update the form options in `SellForm.jsx`.

### Styling
Custom CSS classes are defined in `src/index.css`. Modify these for additional styling needs.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Images sourced from [Unsplash](https://unsplash.com)
- Icons from Heroicons
- Built with [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/)