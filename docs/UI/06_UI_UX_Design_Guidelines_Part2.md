# UI/UX Design Guidelines (Part 2)

**Project Name:** Factory Management System (ERP)

**Document Version:** 1.0

---

# Table of Contents

1. Layout System
2. Navigation
3. Sidebar
4. Header
5. Dashboard Layout
6. Cards
7. Tables
8. Forms
9. Buttons
10. Modals
11. Responsive Grid System

---

# 1. Layout System

## Purpose

The layout should remain consistent throughout the ERP.

Every page follows the same structure.

```text
+------------------------------------------------------------+
| Header                                                     |
+-----------+------------------------------------------------+
|           |                                                |
| Sidebar   | Main Content                                   |
|           |                                                |
|           |                                                |
|           |                                                |
+-----------+------------------------------------------------+
```

---

## Layout Structure

```mermaid
flowchart TB

Application

-->

Header

Application

-->

Sidebar

Application

-->

Main Content

Main Content

-->

Page Header

Main Content

-->

Page Content
```

---

## Layout Rules

- Header remains fixed.
- Sidebar remains fixed.
- Only the content area scrolls.
- Page title is always visible.
- Breadcrumb appears below the header.

---

# 2. Navigation

Navigation should be predictable and easy to understand.

Main navigation is located in the left sidebar.

Secondary navigation appears inside modules.

---

## Navigation Hierarchy

```text
Dashboard

Employees
    ├── Employees
    ├── Departments
    └── Designations

Inventory
    ├── Categories
    ├── Materials
    ├── Suppliers
    └── Purchases

Production
    ├── Customers
    ├── Purchase Orders
    ├── Workflow
    ├── Bundles
    └── Quality

Finance
    ├── Accounts
    ├── Expenses
    ├── Revenue
    └── Reports

Settings
```

---

# Navigation Principles

- Maximum two levels
- Clear labels
- Active menu highlighted
- Icons for every menu
- Search available

---

# 3. Sidebar

The sidebar is the primary navigation component.

---

## Width

Expanded

```text
280px
```

Collapsed

```text
80px
```

---

## Sidebar Sections

```text
Logo

Dashboard

Employees

Inventory

Production

Finance

Reports

Settings

Profile
```

---

## Sidebar Behavior

- Expand/Collapse
- Active page highlighted
- Hover state
- Scrollable menu
- Remember collapsed state

---

# Sidebar Example

```text
🏭 Factory ERP

📊 Dashboard

👥 Employees

📦 Inventory

🏗 Production

💰 Finance

📈 Reports

⚙ Settings
```

---

# 4. Header

The header provides quick access to global actions.

---

## Header Layout

```text
+---------------------------------------------------------+

☰

Search

Notifications

Theme

Profile

+---------------------------------------------------------+
```

---

## Header Components

- Sidebar Toggle
- Global Search
- Notifications
- Theme Switch
- User Avatar
- User Menu

---

# User Menu

Contains

- Profile
- Settings
- Change Password
- Logout

---

# 5. Dashboard Layout

The dashboard should display important business information first.

---

## Dashboard Sections

```text
Summary Cards

↓

Charts

↓

Recent Activities

↓

Quick Actions
```

---

## Dashboard Example

```text
+-------------------------------------------------------+

Employees

Orders

Revenue

Inventory

+-------------------------------------------------------+

Production Chart

Revenue Chart

+-------------------------------------------------------+

Recent Orders

Recent Activities

+-------------------------------------------------------+
```

---

## Dashboard Cards

Each card displays

- Icon
- Title
- Value
- Percentage Change
- Trend Indicator

Example

```text
Employees

125

↑ 5%
```

---

# 6. Cards

Cards group related information.

Examples

- Dashboard cards
- Employee profile
- Purchase Order
- Inventory

---

## Card Structure

```text
Title

Subtitle

Divider

Content

Actions
```

---

## Card Guidelines

- Rounded corners
- Soft shadow
- Equal padding
- Clear heading
- Action buttons aligned right

---

# 7. Tables

ERP systems rely heavily on tables.

Tables should support

- Sorting
- Filtering
- Pagination
- Search
- Export
- Bulk Selection

---

## Table Layout

```text
Search

Filter

Export

-----------------------------------------

Checkbox

Name

Department

Status

Actions

-----------------------------------------

Pagination
```

---

## Table Row Actions

- View
- Edit
- Delete
- Duplicate

---

## Status Badges

| Status | Color |
|---------|--------|
| Active | Green |
| Pending | Yellow |
| Completed | Blue |
| Cancelled | Red |

---

# Table Guidelines

- Sticky header
- Zebra rows (optional)
- Hover highlight
- Responsive scrolling
- Action column fixed on the right

---

# 8. Forms

Forms are used throughout the ERP.

Examples

- Employee Form
- Purchase Order
- Material Form

---

## Form Layout

```text
Section Title

Label

Input

Help Text

Validation

Button
```

---

## Form Rules

- Labels above inputs
- Required fields marked with *
- Inline validation
- Helpful error messages
- Logical grouping of fields

---

## Input Types

- Text
- Number
- Email
- Password
- Select
- Multi Select
- Date Picker
- Time Picker
- Checkbox
- Radio
- Textarea
- File Upload

---

# Form Buttons

Primary

```text
Save
```

Secondary

```text
Cancel
```

Danger

```text
Delete
```

---

# 9. Buttons

Buttons represent user actions.

---

## Button Types

| Type | Purpose |
|------|----------|
| Primary | Main Action |
| Secondary | Alternative Action |
| Outline | Optional Action |
| Ghost | Toolbar Action |
| Danger | Delete |

---

## Button Sizes

| Size | Height |
|------|---------|
| Small | 32px |
| Medium | 40px |
| Large | 48px |

---

## Button States

- Default
- Hover
- Active
- Disabled
- Loading

---

# Example

```text
Save

Cancel

Delete
```

---

# 10. Modals

Modals display focused content without leaving the page.

Examples

- Delete Confirmation
- Employee Details
- Purchase Order Preview

---

## Modal Structure

```text
Header

Body

Footer
```

---

## Footer Buttons

```text
Cancel

Confirm
```

---

## Modal Rules

- Close button
- ESC key support
- Click outside to close (optional)
- Focus trapped inside modal
- Maximum width 700px

---

# Confirmation Dialog

```text
Delete Employee?

This action cannot be undone.

Cancel

Delete
```

---

# 11. Responsive Grid System

The ERP should work across desktop, tablet, and mobile devices.

---

## Breakpoints

| Device | Width |
|----------|--------|
| Mobile | < 640px |
| Tablet | 640–1024px |
| Laptop | 1024–1280px |
| Desktop | >1280px |

---

## Grid

Desktop

```text
12 Columns
```

Tablet

```text
8 Columns
```

Mobile

```text
4 Columns
```

---

## Responsive Rules

Desktop

```
Sidebar visible
```

Tablet

```
Collapsible sidebar
```

Mobile

```
Drawer navigation
```

---

# UI Components Covered

This document defines the structure for:

- ✅ Layout
- ✅ Navigation
- ✅ Sidebar
- ✅ Header
- ✅ Dashboard
- ✅ Cards
- ✅ Tables
- ✅ Forms
- ✅ Buttons
- ✅ Modals
- ✅ Responsive Grid

These components provide a consistent user experience across the entire Factory Management System.

---

# Next Document

## UI/UX Design Guidelines (Part 3)

The next section will cover:

- Light & Dark Theme
- Component States
- Loading & Empty States
- Charts & Data Visualization
- Animations
- Accessibility (WCAG)
- Mobile Experience
- Design Tokens
- UI Best Practices
- Complete Design System Summary
```