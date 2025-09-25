# Student Management System API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
All requests to Supabase are authenticated using the API key configured in your environment variables.

## Response Format
All API responses follow this structure:
```json
{
  "success": true|false,
  "data": {...}|[...],
  "message": "Optional message",
  "error": "Error message if success is false"
}
```

## Endpoints

### Health Check
**GET** `/health`
```json
{
  "status": "OK",
  "message": "Student Management System API is running",
  "timestamp": "2024-12-25T10:00:00.000Z"
}
```

---

## Students API

### Get All Students
**GET** `/students`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "dues": 1000
    }
  ],
  "count": 1
}
```

### Create Student
**POST** `/students`

**Request Body:**
```json
{
  "name": "John Doe",        // Required
  "email": "john@example.com", // Required
  "dues": 1000               // Optional, defaults to 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "dues": 1000
  }
}
```

### Get Student by ID
**GET** `/students/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "dues": 1000
  }
}
```

### Update Student
**PUT** `/students/:id`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "dues": 500
}
```

### Delete Student (Soft Delete)
**DELETE** `/students/:id`

---

## Payments API

### Get All Payments
**GET** `/payments`

**Query Parameters:**
- `student_id` (optional): Filter payments by student ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "student_id": 1,
      "amount": 500,
      "date": "2024-12-25",
      "description": "Monthly fee payment"
    }
  ],
  "count": 1
}
```

### Record Payment
**POST** `/payments`

**Request Body:**
```json
{
  "student_id": 1,           // Required
  "amount": 500,             // Required
  "date": "2024-12-25",      // Optional, defaults to today
  "description": "Monthly fee" // Optional, defaults to "Fee payment"
}
```

### Get Payment by ID
**GET** `/payments/:id`

---

## Expenses API

### Get All Expenses
**GET** `/expenses`

**Query Parameters:**
- `category` (optional): Filter by expense category
- `start_date` & `end_date` (optional): Filter by date range (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "description": "Office supplies",
      "amount": 200,
      "date": "2024-12-25",
      "category": "supplies"
    }
  ],
  "count": 1
}
```

### Add Expense
**POST** `/expenses`

**Request Body:**
```json
{
  "description": "Office supplies", // Required
  "amount": 200,                    // Required
  "date": "2024-12-25",            // Optional, defaults to today
  "category": "supplies"            // Optional, defaults to "general"
}
```

### Get Expense by ID
**GET** `/expenses/:id`

---

## Salaries API

### Get All Salaries
**GET** `/salaries`

**Query Parameters:**
- `employee_name` (optional): Filter by employee name
- `month` & `year` (optional): Filter by month and year

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employee_name": "Teacher Jane",
      "amount": 3000,
      "month": "12",
      "year": "2024"
    }
  ],
  "count": 1
}
```

### Add Salary Record
**POST** `/salaries`

**Request Body:**
```json
{
  "employee_name": "Teacher Jane", // Required
  "amount": 3000,                  // Required
  "month": "12",                   // Required
  "year": "2024"                   // Required
}
```

### Get Salary by ID
**GET** `/salaries/:id`

---

## Reports API

### Get Financial Reports
**GET** `/reports`

**Query Parameters:**
- `month` & `year` (optional): Get monthly report instead of overall

**Response:**
```json
{
  "success": true,
  "data": {
    "feesCollected": [...],
    "expenses": [...],
    "salaries": [...],
    "summary": {
      "totalFeesCollected": 5000,
      "totalExpenses": 1200,
      "totalSalaries": 3000,
      "totalOutgoing": 4200,
      "netIncome": 800,
      "profitMargin": 16.0
    }
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Missing required fields",
  "missingFields": ["name", "email"]
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Student not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Example Usage with curl

### Create a student
```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","dues":1000}'
```

### Record a payment
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{"student_id":1,"amount":500,"description":"Monthly fee"}'
```

### Get financial reports
```bash
curl http://localhost:3000/reports
```