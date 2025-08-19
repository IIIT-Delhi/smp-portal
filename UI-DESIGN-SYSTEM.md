# SMP Portal UI Design System

## Overview
This document outlines the modern, responsive UI design system for the Student Mentorship Program (SMP) Portal of IIIT-Delhi. The design follows IIIT-Delhi's brand identity with a clean, minimal, and academic tone.

## Brand Colors

### Primary Colors
- **Dark Blue**: `#003262` - Primary brand color for headers and important elements
- **Accent Blue**: `#0055A4` - Secondary brand color for interactive elements
- **White**: `#FFFFFF` - Background and card colors
- **Light Gray**: `#F5F5F5` - Page backgrounds and subtle elements

### Accent Colors
- **Orange Highlight**: `#FF6F00` - Call-to-action buttons and highlights
- **Success**: `#27ae60` - Success states and positive feedback
- **Warning**: `#f39c12` - Warning states and pending actions
- **Error**: `#e74c3c` - Error states and negative feedback

## Typography
- **Primary Font**: Roboto (Sans-serif)
- **Secondary Font**: Open Sans (Sans-serif)
- **Fallback**: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif

## Components

### 1. Buttons
- **Primary**: Orange highlight background for main actions
- **Secondary**: Accent blue background for secondary actions
- **Outline**: Transparent background with colored border
- **Ghost**: Minimal styling for subtle actions
- **Danger**: Red background for destructive actions

### 2. Cards
- **Default**: White background with subtle shadow
- **Gradient**: Light gradient background with colored left border
- **Hover**: Animated elevation on hover
- **Headers**: Gradient backgrounds matching brand colors

### 3. Navigation
- **Sticky Top**: Always visible at top of page
- **Logo**: IIIT-Delhi logo with portal name
- **Links**: Role-based navigation with hover effects
- **User Avatar**: Generated avatar with user initials
- **Mobile**: Responsive hamburger menu

### 4. Dashboard Cards
- **Stats Cards**: Display key metrics with icons
- **Profile Card**: User information with avatar
- **Data Tables**: Structured data with search and sorting
- **Responsive**: Mobile-first design approach

### 5. Forms
- **Clean Input**: Minimal border styling with focus states
- **Floating Labels**: Modern label positioning
- **Validation**: Clear error and success states
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Layout Principles

### Grid System
- Bootstrap 5 grid system
- Responsive breakpoints
- Consistent spacing using CSS custom properties

### Spacing
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **xxl**: 3rem (48px)

### Border Radius
- **sm**: 4px - Small elements
- **md**: 8px - Buttons and inputs
- **lg**: 12px - Cards and containers
- **xl**: 16px - Large containers

## Animations
- **Transition Speed**: 0.3s ease for most interactions
- **Hover Effects**: Subtle elevation and color changes
- **Loading States**: Smooth spinner animations
- **Page Transitions**: Fade and slide effects

## Accessibility
- **Color Contrast**: WCAG AA compliant
- **Focus States**: Visible focus indicators
- **Screen Readers**: Proper ARIA labels
- **Keyboard Navigation**: Full keyboard support

## Mobile Responsiveness
- **Mobile First**: Designed for mobile, enhanced for desktop
- **Breakpoints**: 480px, 768px, 1024px, 1200px
- **Touch Targets**: Minimum 44px for touch elements
- **Viewport**: Responsive meta tag implementation

## File Structure
```
src/
├── styles/
│   └── theme.css          # Main theme variables and styles
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── DashboardCard.js
│   │   ├── Loading.js
│   │   └── index.js
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── navbar/            # Navigation components
│   └── ...
├── index.css              # Global styles and imports
└── App.css               # Application-specific styles
```

## Usage Examples

### Button Component
```jsx
import { Button } from './components/ui';

<Button variant="primary" size="lg" icon="🏠">
  Go to Dashboard
</Button>
```

### Card Component
```jsx
import { Card } from './components/ui';

<Card headerTitle="Profile Information" headerColor="primary" hover>
  <Card.Body>
    Content goes here
  </Card.Body>
</Card>
```

### Dashboard Card
```jsx
import { DashboardCard } from './components/ui';

<DashboardCard
  title="Total Students"
  value="120"
  icon="👩‍🎓"
  color="var(--accent-blue)"
/>
```

## Design Guidelines

### Do's
- Use consistent spacing and typography
- Follow the established color palette
- Implement hover states for interactive elements
- Ensure mobile responsiveness
- Use semantic HTML elements
- Provide loading states for async operations

### Don'ts
- Don't use colors outside the brand palette
- Don't create overly complex animations
- Don't ignore accessibility requirements
- Don't break the grid system
- Don't use inline styles excessively

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements
- Dark mode support
- Advanced animations
- Component library documentation
- Design tokens system
- Automated accessibility testing
