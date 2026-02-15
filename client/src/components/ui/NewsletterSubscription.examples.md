# Newsletter Subscription Component - Usage Examples

A fully modular and reusable newsletter subscription component that can be integrated anywhere in your application.

## Import

```jsx
import NewsletterSubscription from '../components/ui/NewsletterSubscription';
```

## Available Variants

The component comes with 4 pre-built variants:
- `default` - Full-featured with background, title, and description
- `minimal` - Simple input with button, no background
- `inline` - Horizontal compact layout
- `footer` - Dark theme suitable for footers

---

## Usage Examples

### 1. About Page / Feature Section (Default Variant)

```jsx
// Full-featured with custom title and description
<NewsletterSubscription
  source="about-page"
  variant="default"
  title="Stay in the loop"
  description="Subscribe to receive the latest news and updates about Makeover. We promise not to spam you!"
/>
```

**Use Cases:**
- About Us page
- Landing pages
- Dedicated newsletter sections

---

### 2. Footer (Footer Variant)

```jsx
// Dark theme footer subscription
<NewsletterSubscription
  source="footer"
  variant="footer"
  title="Newsletter"
  description="Get beauty tips & exclusive offers"
  buttonText="Sign Up"
  showTitle={true}
  showDescription={true}
/>
```

**Use Cases:**
- Site-wide footer
- Bottom of every page
- Dark-themed sections

---

### 3. Sidebar / Widget (Minimal Variant)

```jsx
// Clean minimal design
<NewsletterSubscription
  source="sidebar"
  variant="minimal"
  placeholder="Your email address"
  buttonText="Join"
  className="max-w-sm"
/>
```

**Use Cases:**
- Blog sidebar
- Widgets
- Compact spaces

---

### 4. Homepage / Hero Section (Inline Variant)

```jsx
// Horizontal compact layout
<NewsletterSubscription
  source="home-page"
  variant="inline"
  placeholder="Enter your email"
  buttonText="Get Started"
  className="max-w-lg mx-auto"
/>
```

**Use Cases:**
- Hero sections
- Homepage call-to-action
- Banner sections

---

### 5. Checkout Success / Thank You Page

```jsx
// After successful booking
<NewsletterSubscription
  source="checkout-success"
  variant="default"
  title="Love our service?"
  description="Subscribe for exclusive beauty tips and special offers on your next booking!"
  buttonText="Subscribe Now"
  showTitle={true}
  showDescription={true}
/>
```

**Use Cases:**
- Order confirmation pages
- Thank you pages
- Post-checkout

---

### 6. Blog Page

```jsx
// At the end of blog posts
<NewsletterSubscription
  source="blog"
  variant="minimal"
  placeholder="Subscribe for more tips"
  buttonText="Subscribe"
  className="my-8"
/>
```

**Use Cases:**
- Below blog posts
- Content pages
- Article endings

---

### 7. Modal / Popup

```jsx
// In a modal or popup
<NewsletterSubscription
  source="popup"
  variant="inline"
  placeholder="Your email"
  buttonText="Subscribe"
/>
```

**Use Cases:**
- Exit-intent popups
- Promotional modals
- Newsletter signup popups

---

### 8. Custom Styling

```jsx
// With custom Tailwind classes
<NewsletterSubscription
  source="custom-section"
  variant="default"
  className="shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500"
  title="Join Our Beauty Community"
  description="10,000+ subscribers already get exclusive content"
/>
```

---

## All Available Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | string | `'other'` | Tracking identifier (e.g., 'footer', 'home-page') |
| `variant` | string | `'default'` | UI variant: 'default', 'minimal', 'inline', 'footer' |
| `title` | string | `'Subscribe For Newsletters'` | Section title |
| `description` | string | `'Subscribe to receive...'` | Section description |
| `placeholder` | string | `'Enter your email'` | Input placeholder text |
| `buttonText` | string | `'Subscribe'` | Submit button text |
| `className` | string | `''` | Additional Tailwind CSS classes |
| `showTitle` | boolean | `true` | Show/hide title |
| `showDescription` | boolean | `true` | Show/hide description |

---

## Integration Examples

### Example 1: Footer Integration

```jsx
// Footer.jsx
import NewsletterSubscription from '../ui/NewsletterSubscription';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div>
            <h3>About Makeover</h3>
            <p>Beauty at your doorstep</p>
          </div>
          
          {/* Links */}
          <div>
            <h3>Quick Links</h3>
            <ul>...</ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <NewsletterSubscription
              source="footer"
              variant="footer"
              title="Newsletter"
              description="Get beauty tips weekly"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
```

### Example 2: Home Page Hero

```jsx
// HomePage.jsx
import NewsletterSubscription from '../ui/NewsletterSubscription';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-100 to-purple-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">
            Beauty Services at Your Doorstep
          </h1>
          <p className="text-xl mb-8">
            Professional beauty services delivered to your home
          </p>
          
          {/* Newsletter Signup */}
          <div className="flex justify-center">
            <NewsletterSubscription
              source="home-hero"
              variant="inline"
              placeholder="Enter your email for exclusive offers"
              buttonText="Get Started"
              className="max-w-xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
```

### Example 3: Sidebar Widget

```jsx
// BlogSidebar.jsx
import NewsletterSubscription from '../ui/NewsletterSubscription';

const BlogSidebar = () => {
  return (
    <aside className="w-full md:w-64">
      {/* Other widgets */}
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="font-bold mb-4">Subscribe to Our Newsletter</h3>
        <NewsletterSubscription
          source="blog-sidebar"
          variant="minimal"
          placeholder="Your email"
          buttonText="Subscribe"
        />
      </div>
    </aside>
  );
};
```

---

## Custom Hook Usage

If you need even more customization, you can use the `useNewsletter` hook directly:

```jsx
import { useNewsletter } from '../../hooks/useNewsletter';

const CustomNewsletterForm = () => {
  const {
    email,
    isSubmitting,
    submitMessage,
    handleChange,
    handleSubmit,
    reset,
  } = useNewsletter('custom-location');

  return (
    <form onSubmit={handleSubmit} className="your-custom-classes">
      <input
        type="email"
        name="email"
        value={email}
        onChange={handleChange}
        disabled={isSubmitting}
        className="your-input-classes"
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Subscribe'}
      </button>
      
      {submitMessage.text && (
        <div className={`alert ${submitMessage.type}`}>
          {submitMessage.text}
        </div>
      )}
    </form>
  );
};
```

---

## Response Types

The component handles three response types:

1. **Success** (Green) - New subscription
2. **Info** (Blue) - Already subscribed
3. **Error** (Red) - Failed to subscribe

---

## Best Practices

1. **Use descriptive sources** - Helps track where subscriptions come from
   ```jsx
   source="home-hero"  // Good
   source="page1"       // Bad
   ```

2. **Match variant to context**
   - Use `footer` variant in dark sections
   - Use `inline` for hero sections
   - Use `minimal` for sidebars
   - Use `default` for dedicated sections

3. **Customize messaging**
   - Change button text based on context
   - Update descriptions for different audiences

4. **Performance**
   - Component is lightweight and optimized
   - Safe to use multiple instances on the same page

---

## Analytics Tracking

Each subscription includes the `source` parameter, allowing you to:
- Track which pages generate most subscriptions
- A/B test different placements
- Analyze conversion rates by location

View stats via API:
```
GET /api/newsletter/stats
```

---

## Support

For issues or questions:
- Check the console for error messages
- Verify backend is running on port 5000
- Ensure MongoDB connection is active


