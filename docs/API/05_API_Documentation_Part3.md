# API Documentation (Part 3)

**Project Name:** Factory Management System (ERP)

**API Version:** v1

**Document Version:** 1.0

---

# Table of Contents

1. Employee Management APIs
2. Department APIs
3. Designation APIs
4. Attendance APIs
5. Wage APIs
6. Payroll APIs
7. API Summary

---

# 1. Employee Management APIs

## Overview

The Employee module manages all factory employees.

Features:

- Employee CRUD
- Search Employees
- Filter Employees
- Employee Profile
- Employment Status

---

# Employee Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/employees` | Get all employees |
| GET | `/api/v1/employees/{id}` | Get employee details |
| POST | `/api/v1/employees` | Create employee |
| PUT | `/api/v1/employees/{id}` | Update employee |
| DELETE | `/api/v1/employees/{id}` | Soft delete employee |

---

# Create Employee

## Endpoint

```http
POST /api/v1/employees
```

---

## Request

```json
{
  "employeeCode": "EMP-001",
  "firstName": "Muhammad",
  "lastName": "Talha",
  "departmentId": "uuid",
  "designationId": "uuid",
  "phone": "03001234567",
  "email": "talha@factory.com",
  "salaryType": "Monthly",
  "baseSalary": 45000
}
```

---

## Success Response

```json
{
  "success": true,
  "message": "Employee created successfully.",
  "data": {
    "id": "uuid"
  }
}
```

---

## Update Employee

```http
PUT /api/v1/employees/{id}
```

---

## Delete Employee

```http
DELETE /api/v1/employees/{id}
```

---

## Search Employees

```http
GET /api/v1/employees?search=Talha
```

---

## Filter Employees

```http
GET /api/v1/employees?department=Production
```

```http
GET /api/v1/employees?status=Active
```

---

# Business Rules

- Employee Code must be unique.
- Department is required.
- Designation is required.
- Email must be unique.
- Employee records are soft deleted.

---

# 2. Department APIs

Departments organize employees.

---

## Endpoints

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/departments` |
| GET | `/api/v1/departments/{id}` |
| POST | `/api/v1/departments` |
| PUT | `/api/v1/departments/{id}` |
| DELETE | `/api/v1/departments/{id}` |

---

## Create Department

```http
POST /api/v1/departments
```

### Request

```json
{
  "name": "Production",
  "description": "Factory Production Department"
}
```

---

## Response

```json
{
  "success": true,
  "message": "Department created successfully."
}
```

---

# Business Rules

- Department names must be unique.
- Departments cannot be deleted while employees are assigned.

---

# 3. Designation APIs

Designations define employee job titles.

Examples:

- Supervisor
- Accountant
- Cutting Operator
- Stitching Operator

---

## Endpoints

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/designations` |
| POST | `/api/v1/designations` |
| PUT | `/api/v1/designations/{id}` |
| DELETE | `/api/v1/designations/{id}` |

---

## Create Designation

```http
POST /api/v1/designations
```

### Request

```json
{
  "title": "Production Supervisor"
}
```

---

# Business Rules

- Designation title must be unique.
- Designation cannot be removed while employees use it.

---

# 4. Attendance APIs

## Overview

Attendance APIs record employee attendance.

Supported statuses:

- Present
- Absent
- Leave
- Half Day
- Holiday

---

## Endpoints

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/attendance` |
| GET | `/api/v1/attendance/{id}` |
| POST | `/api/v1/attendance` |
| PUT | `/api/v1/attendance/{id}` |
| DELETE | `/api/v1/attendance/{id}` |

---

# Mark Attendance

## Endpoint

```http
POST /api/v1/attendance
```

---

## Request

```json
{
  "employeeId": "uuid",
  "attendanceDate": "2026-07-15",
  "status": "Present",
  "checkIn": "08:00",
  "checkOut": "17:00",
  "overtimeHours": 2
}
```

---

## Response

```json
{
  "success": true,
  "message": "Attendance recorded successfully."
}
```

---

## Attendance Filters

Today's attendance

```http
GET /api/v1/attendance?date=2026-07-15
```

Employee attendance

```http
GET /api/v1/attendance?employeeId=uuid
```

Monthly attendance

```http
GET /api/v1/attendance?month=7&year=2026
```

---

# Business Rules

- One attendance record per employee per day.
- Check-out time must be greater than check-in.
- Attendance cannot be duplicated.

---

# 5. Wage APIs

The Wage module manages employee salaries.

Supports:

- Daily Wage
- Monthly Salary
- Piece Rate

---

## Endpoints

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/wages` |
| GET | `/api/v1/wages/{id}` |
| POST | `/api/v1/wages` |
| PUT | `/api/v1/wages/{id}` |

---

## Create Wage

```http
POST /api/v1/wages
```

---

## Request

```json
{
  "employeeId": "uuid",
  "payPeriodStart": "2026-07-01",
  "payPeriodEnd": "2026-07-31",
  "grossAmount": 45000,
  "overtimeAmount": 3000,
  "deductions": 1500,
  "advances": 5000
}
```

---

## Response

```json
{
  "success": true,
  "message": "Payroll generated successfully."
}
```

---

## Get Employee Payroll

```http
GET /api/v1/wages?employeeId=uuid
```

---

## Pending Payments

```http
GET /api/v1/wages?status=Pending
```

---

# Wage Formula

```text
Net Salary

=

Gross Salary

+

Overtime

-

Deductions

-

Advances
```

---

# 6. Payroll APIs

Payroll APIs automate salary generation.

---

## Generate Payroll

```http
POST /api/v1/payroll/generate
```

---

### Request

```json
{
  "month": 7,
  "year": 2026
}
```

---

### Response

```json
{
  "success": true,
  "message": "Payroll generated successfully."
}
```

---

## Payroll Summary

```http
GET /api/v1/payroll/summary
```

---

## Monthly Payroll

```http
GET /api/v1/payroll?month=7&year=2026
```

---

## Employee Payroll History

```http
GET /api/v1/payroll/{employeeId}/history
```

---

# Payroll Flow

```mermaid
flowchart LR

Attendance

-->

Overtime

-->

Salary Calculation

-->

Payroll Generation

-->

Payment
```

---

# Validation Rules

| Field | Validation |
|---------|------------|
| Employee | Required |
| Salary | >= 0 |
| Overtime | >= 0 |
| Deductions | >= 0 |
| Attendance Date | Required |
| Department | Required |

---

# Security

Only authorized roles may perform these actions.

| Role | Permission |
|------|------------|
| Admin | Full Access |
| HR | Employee & Attendance |
| Accountant | Payroll & Wages |
| Production Manager | View Employees |
| Employee | View Own Profile |

---

# Module Summary

This part includes:

- ✅ Employee APIs
- ✅ Department APIs
- ✅ Designation APIs
- ✅ Attendance APIs
- ✅ Wage APIs
- ✅ Payroll APIs

These endpoints manage the complete employee lifecycle, from hiring and attendance tracking to payroll generation.

---

# Next Document
