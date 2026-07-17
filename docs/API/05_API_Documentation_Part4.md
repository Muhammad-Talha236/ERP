# API Documentation (Part 4)

**Project Name:** Factory Management System (ERP)

**API Version:** v1

**Document Version:** 1.0

---

# Table of Contents

1. Inventory Overview
2. Material Category APIs
3. Raw Material APIs
4. Supplier APIs
5. Purchase APIs
6. Purchase Item APIs
7. Stock Transaction APIs
8. Material Usage APIs
9. Inventory Dashboard APIs
10. Business Rules
11. API Summary

---

# 1. Inventory Overview

## Purpose

The Inventory module manages all raw materials used in production.

It allows administrators to:

- Manage material categories
- Manage raw materials
- Track suppliers
- Record purchases
- Monitor inventory
- Record daily material usage
- View stock history

---

# Inventory API Flow

```mermaid
flowchart LR

Supplier

-->

Purchase

-->

Inventory

-->

Material Usage

-->

Production

-->

Reports
```

---

# 2. Material Category APIs

Material Categories organize raw materials.

Examples:

- Fabric
- Thread
- Buttons
- Labels
- Packaging

---

## Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/material-categories` | Get all categories |
| GET | `/api/v1/material-categories/{id}` | Get category |
| POST | `/api/v1/material-categories` | Create category |
| PUT | `/api/v1/material-categories/{id}` | Update category |
| DELETE | `/api/v1/material-categories/{id}` | Delete category |

---

## Create Category

```http
POST /api/v1/material-categories
```

### Request

```json
{
    "name": "Fabric",
    "description": "Fabric materials"
}
```

---

## Response

```json
{
    "success": true,
    "message": "Category created successfully."
}
```

---

# Business Rules

- Category names must be unique.
- Categories with assigned materials cannot be deleted.

---

# 3. Raw Material APIs

Raw materials are items consumed during production.

Examples:

- Cotton Fabric
- Blue Thread
- Buttons
- Zippers

---

## Endpoints

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/raw-materials` |
| GET | `/api/v1/raw-materials/{id}` |
| POST | `/api/v1/raw-materials` |
| PUT | `/api/v1/raw-materials/{id}` |
| DELETE | `/api/v1/raw-materials/{id}` |

---

## Create Raw Material

```http
POST /api/v1/raw-materials
```

### Request

```json
{
    "materialCode": "MAT-001",
    "materialName": "Cotton Fabric",
    "categoryId": "uuid",
    "unit": "Meter",
    "purchasePrice": 350,
    "minimumStock": 100
}
```

---

## Response

```json
{
    "success": true,
    "message": "Material created successfully."
}
```

---

## Search Materials

```http
GET /api/v1/raw-materials?search=fabric
```

---

## Low Stock

```http
GET /api/v1/raw-materials?stock=low
```

---

# Business Rules

- Material code must be unique.
- Stock cannot become negative.
- Every material belongs to one category.

---

# 4. Supplier APIs

Suppliers provide raw materials.

---

## Endpoints

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/suppliers` |
| GET | `/api/v1/suppliers/{id}` |
| POST | `/api/v1/suppliers` |
| PUT | `/api/v1/suppliers/{id}` |
| DELETE | `/api/v1/suppliers/{id}` |

---

## Create Supplier

```http
POST /api/v1/suppliers
```

### Request

```json
{
    "supplierName": "ABC Textile Mills",
    "phone": "03001234567",
    "email": "sales@abc.com",
    "city": "Faisalabad"
}
```

---

## Response

```json
{
    "success": true,
    "message": "Supplier created successfully."
}
```

---

# Supplier Search

```http
GET /api/v1/suppliers?search=textile
```

---

# Business Rules

- Supplier name must be unique.
- Supplier cannot be deleted if purchase history exists.

---

# 5. Purchase APIs

Purchases increase inventory.

---

## Endpoints

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/purchases` |
| GET | `/api/v1/purchases/{id}` |
| POST | `/api/v1/purchases` |
| PUT | `/api/v1/purchases/{id}` |

---

## Create Purchase

```http
POST /api/v1/purchases
```

---

### Request

```json
{
    "supplierId": "uuid",
    "invoiceNumber": "INV-1001",
    "purchaseDate": "2026-07-20",
    "items": [
        {
            "materialId": "uuid",
            "quantity": 500,
            "unitPrice": 350
        }
    ]
}
```

---

## Response

```json
{
    "success": true,
    "message": "Purchase created successfully."
}
```

---

# Purchase Workflow

```mermaid
flowchart LR

Supplier

-->

Purchase

-->

Purchase Items

-->

Inventory Updated

-->

Stock Transaction Created
```

---

# Business Rules

- Every purchase requires one supplier.
- Purchase must contain at least one item.
- Inventory updates automatically after purchase.

---

# 6. Purchase Item APIs

Purchase Items represent materials inside a purchase.

---

## Endpoints

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/purchases/{purchaseId}/items` |
| POST | `/api/v1/purchases/{purchaseId}/items` |
| PUT | `/api/v1/purchase-items/{id}` |
| DELETE | `/api/v1/purchase-items/{id}` |

---

## Example Response

```json
{
    "success": true,
    "data": [
        {
            "material": "Cotton Fabric",
            "quantity": 500,
            "unitPrice": 350,
            "total": 175000
        }
    ]
}
```

---

# 7. Stock Transaction APIs

Every inventory movement is recorded.

Transaction Types:

- Purchase
- Material Usage
- Adjustment
- Return
- Damage

---

## Endpoints

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/stock-transactions` |
| GET | `/api/v1/stock-transactions/{id}` |

---

## Filter by Material

```http
GET /api/v1/stock-transactions?materialId=uuid
```

---

## Filter by Date

```http
GET /api/v1/stock-transactions?from=2026-07-01&to=2026-07-31
```

---

## Response

```json
{
    "success": true,
    "data": [
        {
            "transactionType": "Purchase",
            "quantity": 500,
            "balanceAfter": 1500
        }
    ]
}
```

---

# Business Rules

- Transactions cannot be edited.
- Transactions cannot be deleted.
- Every inventory update creates one transaction.

---

# 8. Material Usage APIs

Material Usage records production consumption.

---

## Endpoints

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/material-usage` |
| GET | `/api/v1/material-usage/{id}` |
| POST | `/api/v1/material-usage` |

---

## Record Usage

```http
POST /api/v1/material-usage
```

---

### Request

```json
{
    "workflowId": "uuid",
    "employeeId": "uuid",
    "materialId": "uuid",
    "quantityUsed": 150,
    "wastageQuantity": 5,
    "usageDate": "2026-07-20"
}
```

---

## Response

```json
{
    "success": true,
    "message": "Material usage recorded successfully."
}
```

---

# Material Usage Flow

```mermaid
flowchart LR

Production

-->

Material Usage

-->

Reduce Inventory

-->

Stock Transaction

-->

Reports
```

---

# Business Rules

- Material must exist.
- Employee must exist.
- Quantity must be greater than zero.
- Available stock must be sufficient.
- Stock updates automatically.

---

# 9. Inventory Dashboard APIs

These APIs provide summarized inventory data for dashboards.

---

## Current Stock

```http
GET /api/v1/dashboard/inventory
```

---

## Low Stock Materials

```http
GET /api/v1/dashboard/inventory/low-stock
```

---

## Material Consumption

```http
GET /api/v1/dashboard/inventory/consumption
```

---

## Recent Purchases

```http
GET /api/v1/dashboard/inventory/recent-purchases
```

---

## Dashboard Response

```json
{
    "currentStock": 542,
    "lowStockItems": 8,
    "todayConsumption": 154,
    "todayPurchases": 12
}
```

---

# Validation Rules

| Field | Validation |
|---------|------------|
| Material Name | Required |
| Material Code | Unique |
| Quantity | Greater than 0 |
| Purchase Price | Greater than or equal to 0 |
| Supplier | Required |
| Invoice Number | Unique |

---

# Security

| Role | Access |
|------|--------|
| Admin | Full Access |
| Inventory Manager | Full Inventory Access |
| Production Manager | View & Material Usage |
| Accountant | View Purchases |
| Employee | View Assigned Materials Only |

---

# Module Summary

This section covers:

- ✅ Material Categories
- ✅ Raw Materials
- ✅ Suppliers
- ✅ Purchases
- ✅ Purchase Items
- ✅ Stock Transactions
- ✅ Material Usage
- ✅ Inventory Dashboard

These APIs provide complete inventory management, from purchasing raw materials to tracking their consumption during production.

---

# Next Document

## API Documentation (Part 5)

The next part will cover:

- Customer APIs
- Purchase Order APIs
- Workflow APIs
- Production Bundle APIs
- Employee Assignment APIs
- Quality Inspection APIs
- Production Dashboard APIs 