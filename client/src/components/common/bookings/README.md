# Booking Module

This module implements the order summary and success screens for the Makeover application, following the Figma design specifications.

## Components

### BookingPage

The main container component that manages the booking flow between summary and success screens.

- **Features:**
  - Manages state transitions between order summary and success screens
  - Handles payment processing
  - Provides receipt download functionality
  - Implements order sharing capabilities

### OrderSummary

Displays the order summary with interactive elements for adjusting quantities and selecting payment methods.

- **Features:**
  - Two-column layout with order details and checkout options
  - Interactive quantity controls with real-time price updates
  - Date selection for booking slots
  - Multiple payment method options (UPI, Cards, Cash)
  - Card details form with validation
  - Razorpay integration for secure payments

### OrderSuccess

Shows a success message after order completion with order details and action buttons.

- **Features:**
  - Success confirmation with order ID and date
  - Payment details summary
  - Services breakdown
  - Booking information
  - Download receipt functionality
  - Share order capability
  - Navigation back to home

## Usage

```jsx
// Import the main component
import BookingPage from "../components/common/bookings/BookingPage";

// Use it in your routes
<Route path="/booking" element={<BookingPage />} />
```

## Customization

The components are designed to be highly customizable:

- **Theming:** Colors can be adjusted through Tailwind classes
- **Services:** Pass different services data to change the displayed items
- **Payment Methods:** Add or remove payment methods as needed
- **Callbacks:** Customize behavior with onPaymentComplete, onDownloadReceipt, etc.

## Utilities

The module includes utility functions in `orderUtils.js` for:

- Price formatting
- Date formatting
- Order ID generation
- Total calculation
- Order sharing
- Local storage operations

## Design Principles

This implementation follows these key principles:

1. **Modularity:** Components are separated by concern for better maintainability
2. **Scalability:** Designed to handle various services and payment methods
3. **Responsiveness:** Fully responsive for all screen sizes
4. **Accessibility:** Includes proper ARIA attributes and keyboard navigation
5. **Performance:** Optimized rendering with proper state management
6. **Reusability:** Components can be used independently in different contexts

## Future Enhancements

Potential improvements for future versions:

- Add form validation for card details
- Implement actual payment gateway integration
- Add animation transitions between screens
- Support for multiple languages
- Dark mode support

