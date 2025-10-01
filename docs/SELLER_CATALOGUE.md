# Seller Catalogue Feature

## Overview

The Seller Catalogue is a beautiful, Instagram/TikTok-ready page that showcases individual sellers and their products. It's designed to be perfect for social media sharing and can be linked to custom domains as part of a premium plan.

## Features

### 🎨 **Beautiful Design**

- Gradient backgrounds with purple, pink, and blue themes
- Responsive design that works on all devices
- Instagram/TikTok-optimized layout
- Smooth animations and hover effects

### 👤 **Seller Profile**

- Large, prominent seller avatar
- Seller name, handle, and location
- Product count, followers, and sales stats
- Follow and message buttons
- Online status indicator

### 🛍️ **Product Showcase**

- Grid and list view modes
- Product image carousel with navigation
- Hover effects and smooth transitions
- Category filtering
- Price sorting (low to high, high to low, newest)
- Save products functionality
- Direct messaging with seller

### 📱 **Social Media Ready**

- Optimized for Instagram and TikTok sharing
- Social sharing buttons (Twitter, Facebook)
- Copy link functionality
- SEO-optimized metadata
- Open Graph tags for rich previews

### 🔗 **Easy Access**

- "View Shop" buttons on product cards
- "View Shop" buttons on product detail pages
- "Discover Sellers" link on main feed
- Direct URL access: `/seller/[handle]`

## URL Structure

- **Seller Directory**: `/seller` - Browse all sellers
- **Individual Seller**: `/seller/[handle]` - View specific seller's shop
- **Example**: `/seller/john_doe` - John Doe's shop page

## Custom Domain Support

The seller catalogue is designed to support custom domains in the future:

- Each seller can have their own custom domain
- Premium feature for verified sellers
- Branded experience for customers
- Easy integration with existing systems

## Technical Implementation

### Server-Side Rendering

- SEO-optimized with proper metadata
- Fast loading with server-side data fetching
- Open Graph and Twitter Card support

### Client-Side Features

- Real-time product filtering and sorting
- Interactive product image carousels
- Social sharing functionality
- Responsive design with mobile-first approach

### Database Integration

- Fetches seller profile information
- Loads seller's active products
- Calculates seller statistics
- Handles product categories and filtering

## Usage

1. **For Sellers**: Your shop page is automatically created at `/seller/[your_handle]`
2. **For Customers**: Click "View Shop" on any product to see the seller's full catalogue
3. **For Sharing**: Use the share button to post on social media or copy the link

## Future Enhancements

- Custom domain integration
- Seller analytics dashboard
- Advanced filtering options
- Product collections
- Seller verification badges
- Custom themes and branding options
