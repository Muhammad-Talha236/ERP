# UI/UX Design Guidelines (Part 3)

**Project Name:** Factory Management System (ERP)

**Document Version:** 1.0

---

# Table of Contents

1. Light & Dark Theme
2. Component States
3. Loading States
4. Empty States
5. Charts & Data Visualization
6. Animations
7. Accessibility
8. Mobile Experience
9. Design Tokens
10. UI Best Practices
11. Final Design System Summary

---

# 1. Light & Dark Theme

## Purpose

The ERP supports both Light Mode and Dark Mode.

Users can switch themes without affecting functionality.

---

# Theme Architecture

```mermaid
flowchart LR

User

-->

Theme Preference

-->

Light Theme

Theme Preference

-->

Dark Theme
```

---

## Light Theme

| Element | Color |
|----------|---------|
| Background | #FFFFFF |
| Surface | #F9FAFB |
| Card | #FFFFFF |
| Border | #E5E7EB |
| Text | #111827 |

---

## Dark Theme

| Element | Color |
|----------|---------|
| Background | #0F172A |
| Surface | #1E293B |
| Card | #1E293B |
| Border | #334155 |
| Text | #F8FAFC |

---

## Theme Rules

- User preference is saved.
- Charts adapt automatically.
- Icons remain visible.
- Contrast meets accessibility guidelines.

---

# 2. Component States

Every interactive component should have clear visual states.

---

## Button States

- Default
- Hover
- Focus
- Active
- Disabled
- Loading

---

## Input States

| State | Description |
|---------|-------------|
| Default | Normal |
| Focus | Active input |
| Success | Valid input |
| Error | Invalid input |
| Disabled | Read Only |

---

## Table Row States

- Default
- Hover
- Selected
- Disabled

---

## Card States

- Default
- Hover
- Selected

---

# 3. Loading States

Loading indicators improve user experience.

---

## Skeleton Loading

Use skeleton loaders for:

- Tables
- Cards
- Dashboards
- Employee Profiles

Example

```text
████████████

████████████████

██████████
```

---

## Spinner

Use spinner for:

- Form submission
- File uploads
- Authentication
- Small requests

---

## Progress Bar

Use progress bars for:

- File uploads
- Report generation
- Import/Export
- Database backup

---

# Loading Guidelines

Avoid blank screens.

Always provide feedback.

---

# 4. Empty States

When no data exists, guide the user.

---

## Example

```text
📦

No Purchase Orders Found

Create your first Purchase Order.
```

---

## Examples

Employees

```text
No Employees Found
```

Inventory

```text
No Materials Available
```

Reports

```text
No Reports Generated
```

---

## Empty State Rules

- Friendly illustration
- Short explanation
- Primary action button

---

# 5. Charts & Data Visualization

Charts help users understand business performance.

---

## Recommended Charts

| Chart | Usage |
|---------|--------|
| Bar Chart | Revenue |
| Line Chart | Sales Trend |
| Pie Chart | Inventory Categories |
| Area Chart | Production Progress |
| Donut Chart | Attendance |
| KPI Cards | Dashboard |

---

## Dashboard Example

```text
Revenue Chart

Production Chart

Attendance Chart

Inventory Chart
```

---

## Chart Guidelines

- Minimal colors
- Clear labels
- Responsive
- Tooltips
- Legends
- Export support

---

# 6. Animations

Animations improve usability.

Avoid excessive motion.

---

## Recommended Duration

| Animation | Duration |
|------------|----------|
| Button Hover | 150ms |
| Dropdown | 200ms |
| Modal | 250ms |
| Sidebar | 300ms |
| Page Transition | 250ms |

---

## Use Animations For

- Hover effects
- Page transitions
- Drawer opening
- Modal opening
- Loading feedback

---

## Avoid

- Flashing elements
- Long animations
- Distracting motion

---

# 7. Accessibility

The ERP should follow WCAG 2.1 AA guidelines.

---

## Accessibility Checklist

- Keyboard navigation
- Visible focus indicators
- High color contrast
- Screen reader support
- Form labels
- Alternative text
- Semantic HTML

---

## Keyboard Shortcuts

| Shortcut | Action |
|-----------|--------|
| Ctrl + K | Global Search |
| Ctrl + N | Create New |
| Esc | Close Dialog |
| Tab | Next Field |
| Shift + Tab | Previous Field |

---

## Form Accessibility

Every input should have:

- Label
- Placeholder
- Error Message
- Help Text

---

# 8. Mobile Experience

The ERP is desktop-first but mobile-friendly.

---

## Mobile Layout

```text
Header

↓

Dashboard

↓

Cards

↓

Tables

↓

Bottom Navigation
```

---

## Mobile Features

- Drawer Navigation
- Swipe Gestures
- Large Touch Targets
- Responsive Tables
- Sticky Header

---

## Touch Guidelines

Minimum touch area

```text
44px × 44px
```

---

# 9. Design Tokens

Centralize design values.

---

## Color Tokens

```text
primary-50

primary-100

primary-500

primary-700

success-500

warning-500

error-500

gray-50

gray-100

gray-900
```

---

## Spacing Tokens

```text
space-1

space-2

space-3

space-4

space-5

space-6
```

---

## Radius Tokens

```text
radius-sm

radius-md

radius-lg

radius-xl

radius-full
```

---

## Shadow Tokens

```text
shadow-sm

shadow-md

shadow-lg

shadow-xl
```

---

# 10. UI Best Practices

Always follow these principles.

---

## Forms

- Group related fields
- Minimize required fields
- Validate immediately
- Preserve user input

---

## Tables

- Sticky headers
- Search
- Pagination
- Sorting
- Filters
- Export

---

## Buttons

- One primary action
- Clear labels
- Consistent placement

---

## Navigation

- Consistent sidebar
- Breadcrumbs
- Search
- Active indicators

---

## Feedback

Always notify users when:

- Saving
- Updating
- Deleting
- Errors occur
- Upload completes

---

## Performance

- Lazy loading
- Code splitting
- Image optimization
- Virtualized tables
- Debounced search

---

# 11. Final Design System Summary

## Visual Foundation

- Typography
- Color Palette
- Icons
- Spacing
- Shadows
- Border Radius

---

## Components

- Buttons
- Inputs
- Tables
- Cards
- Modals
- Dropdowns
- Navigation
- Dashboard Widgets

---

## User Experience

- Responsive Design
- Accessibility
- Dark Mode
- Keyboard Navigation
- Loading States
- Empty States
- Error Handling

---

## Design Goals

The Factory Management System UI should be:

- Professional
- Modern
- Clean
- Fast
- Consistent
- Accessible
- Responsive
- Easy to Learn
- Scalable

---

# UI/UX Documentation Complete

The UI/UX Design Guidelines now include:

## Part 1

- Design Philosophy
- Color Palette
- Typography
- Spacing
- Icons

## Part 2

- Layout
- Sidebar
- Header
- Dashboard
- Tables
- Forms
- Buttons
- Modals

## Part 3

- Light & Dark Theme
- Component States
- Loading States
- Empty States
- Charts
- Animations
- Accessibility
- Mobile Experience
- Design Tokens
- UI Best Practices

This design system provides a consistent visual language and user experience for the entire Factory Management System, ensuring that future development remains scalable, maintainable, and user-friendly.

---

# Next Document

## 07_Development_Roadmap.md

The final documentation file will include:

- Project Phases
- Milestones
- Sprint Planning
- Module Development Order
- Testing Strategy
- Deployment Plan
- Risk Management
- Future Enhancements
- Release Plan
- Maintenance Strategy