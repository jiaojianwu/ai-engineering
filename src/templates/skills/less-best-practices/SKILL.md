---
name: less-best-practices
description: Less CSS best practices and coding guidelines for maintainable, modular stylesheets
---

# Less Best Practices

Expert guidance for writing maintainable, scalable Less CSS stylesheets.

## Core Principles

1. **Modularity**: Break styles into small, reusable modules
2. **Maintainability**: Write clear, organized code
3. **Performance**: Optimize for browser rendering
4. **Scalability**: Design for growth

## Decision Tree

```
Styling need?
├── Component styles
│   ├── Single component → CSS Modules
│   ├── Shared styles → Mixins/Variables
│   └── Dynamic styles → CSS-in-JS
├── Layout
│   ├── Flexbox → Modern CSS
│   ├── Grid → CSS Grid
│   └── Legacy → Float/Flexbox
└── Theming
    ├── Variables → Less variables
    ├── Dark mode → CSS variables
    └── Component variants → Modifiers
```

## File Organization

### 1. Directory Structure

```
src/styles/
├── variables/
│   ├── colors.less
│   ├── typography.less
│   ├── spacing.less
│   └── index.less
├── mixins/
│   ├── responsive.less
│   ├── animations.less
│   └── index.less
├── components/
│   ├── Button.less
│   ├── Card.less
│   └── index.less
├── layouts/
│   ├── Header.less
│   ├── Footer.less
│   └── index.less
├── pages/
│   ├── Home.less
│   ├── About.less
│   └── index.less
└── index.less
```

### 2. Component Styles

```less
// Button.less
@import '../variables/index.less';
@import '../mixins/index.less';

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: @spacing-sm @spacing-md;
  border: none;
  border-radius: @border-radius-sm;
  font-size: @font-size-sm;
  font-weight: @font-weight-medium;
  cursor: pointer;
  transition: all @transition-fast;

  &--primary {
    background-color: @primary-color;
    color: @white;

    &:hover {
      background-color: darken(@primary-color, 10%);
    }
  }

  &--secondary {
    background-color: @secondary-color;
    color: @white;

    &:hover {
      background-color: darken(@secondary-color, 10%);
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

## Variables

### 1. Color System

```less
// variables/colors.less
@white: #ffffff;
@black: #000000;

// Primary colors
@primary-color: #1890ff;
@primary-light: #40a9ff;
@primary-dark: #096dd9;

// Secondary colors
@secondary-color: #722ed1;
@secondary-light: #9254de;
@secondary-dark: #531dab;

// Neutral colors
@gray-1: #ffffff;
@gray-2: #fafafa;
@gray-3: #f5f5f5;
@gray-4: #e8e8e8;
@gray-5: #d9d9d9;
@gray-6: #bfbfbf;
@gray-7: #8c8c8c;
@gray-8: #595959;
@gray-9: #434343;
@gray-10: #262626;
@gray-11: #1f1f1f;
@gray-12: #141414;

// Status colors
@success-color: #52c41a;
@warning-color: #faad14;
@error-color: #ff4d4f;
@info-color: #1890ff;
```

### 2. Typography System

```less
// variables/typography.less
@font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

@font-size-xs: 12px;
@font-size-sm: 14px;
@font-size-base: 16px;
@font-size-lg: 18px;
@font-size-xl: 20px;
@font-size-2xl: 24px;
@font-size-3xl: 30px;

@font-weight-light: 300;
@font-weight-normal: 400;
@font-weight-medium: 500;
@font-weight-semibold: 600;
@font-weight-bold: 700;

@line-height-tight: 1.25;
@line-height-normal: 1.5;
@line-height-loose: 1.75;
```

### 3. Spacing System

```less
// variables/spacing.less
@spacing-xs: 4px;
@spacing-sm: 8px;
@spacing-md: 16px;
@spacing-lg: 24px;
@spacing-xl: 32px;
@spacing-2xl: 48px;
@spacing-3xl: 64px;

// Border radius
@border-radius-sm: 4px;
@border-radius-md: 8px;
@border-radius-lg: 16px;
@border-radius-full: 9999px;

// Shadows
@shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
@shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
@shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
```

## Mixins

### 1. Responsive Mixins

```less
// mixins/responsive.less
@breakpoint-sm: 576px;
@breakpoint-md: 768px;
@breakpoint-lg: 992px;
@breakpoint-xl: 1200px;
@breakpoint-2xl: 1400px;

.respond-to(@breakpoint) {
  @media (min-width: @breakpoint) {
    @content();
  }
}

.respond-below(@breakpoint) {
  @media (max-width: (@breakpoint - 1px)) {
    @content();
  }
}

// Usage
.container {
  padding: @spacing-md;

  .respond-to(@breakpoint-md) {
    padding: @spacing-lg;
  }

  .respond-to(@breakpoint-lg) {
    padding: @spacing-xl;
  }
}
```

### 2. Animation Mixins

```less
// mixins/animations.less
@transition-fast: 150ms ease;
@transition-normal: 300ms ease;
@transition-slow: 500ms ease;

.transition(@properties: all, @duration: @transition-normal) {
  transition: @properties @duration;
}

.fade-in(@duration: @transition-normal) {
  animation: fadeIn @duration ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.slide-up(@duration: @transition-normal) {
  animation: slideUp @duration ease forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## CSS Modules

### 1. Basic Usage

```less
// Button.module.less
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: @spacing-sm @spacing-md;
  border: none;
  border-radius: @border-radius-sm;
  font-size: @font-size-sm;
  font-weight: @font-weight-medium;
  cursor: pointer;
  transition: all @transition-fast;

  &:hover {
    background-color: darken(@primary-color, 10%);
  }

  &--primary {
    background-color: @primary-color;
    color: @white;
  }

  &--secondary {
    background-color: @secondary-color;
    color: @white;
  }
}
```

```typescript
// Button.tsx
import styles from './Button.module.less'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[`button--${variant}`]}`}>
      {children}
    </button>
  )
}
```

### 2. Dynamic Styles

```less
// Card.module.less
.card {
  padding: @spacing-md;
  border: 1px solid @gray-4;
  border-radius: @border-radius-md;
  background-color: @white;
  box-shadow: @shadow-sm;
  transition: all @transition-fast;

  &:hover {
    box-shadow: @shadow-md;
  }

  &--highlighted {
    border-color: @primary-color;
  }
}
```

```typescript
// Card.tsx
import styles from './Card.module.less'

interface CardProps {
  highlighted?: boolean
  children: React.ReactNode
}

export function Card({ highlighted = false, children }: CardProps) {
  return (
    <div className={`${styles.card} ${highlighted ? styles['card--highlighted'] : ''}`}>
      {children}
    </div>
  )
}
```

## Best Practices

### 1. Naming Conventions

```less
// ✅ GOOD: BEM naming
.button {}
.button--primary {}
.button__icon {}

// ✅ GOOD: Component-based naming
.card {}
.card__header {}
.card__body {}
.card__footer {}

// ❌ BAD: Generic naming
.container {}
.wrapper {}
.content {}
```

### 2. Specificity

```less
// ✅ LOW specificity
.button {}
.card {}
.header {}

// ❌ HIGH specificity
#header .nav ul li a {}
div.container > div.content > p {}
```

### 3. Organization

```less
// ✅ GOOD: Organized file
@import '../variables/index.less';
@import '../mixins/index.less';

// Reset
// Layout
// Components
// Utilities

// ❌ BAD: Disorganized file
// Random styles everywhere
```

## Common Pitfalls

1. **Over-nesting**: Keep nesting to 2-3 levels max
2. **Magic numbers**: Use variables for all values
3. **Unused styles**: Remove unused styles regularly
4. **Inconsistent naming**: Follow naming conventions
5. **Poor organization**: Keep files organized and modular

## Checklist

- [ ] Use CSS Modules for component styles
- [ ] Define variables for colors, typography, spacing
- [ ] Create reusable mixins
- [ ] Follow BEM naming convention
- [ ] Keep nesting shallow
- [ ] Organize files logically
- [ ] Remove unused styles
- [ ] Test responsive designs
- [ ] Optimize for performance
- [ ] Document complex styles
