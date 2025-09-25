# API Testing Script for Student Management System

Write-Host "======================================"
Write-Host "   STUDENT MANAGEMENT SYSTEM API TESTS"
Write-Host "======================================"
Write-Host ""

# Test Health Check
Write-Host "=== HEALTH CHECK ===" -ForegroundColor Green
try {
    $health = Invoke-WebRequest -Uri "http://localhost:3000/health"
    Write-Host "Status: $($health.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($health.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test GET Students
Write-Host "=== GET STUDENTS ===" -ForegroundColor Green
try {
    $students = Invoke-WebRequest -Uri "http://localhost:3000/students"
    Write-Host "Status: $($students.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($students.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test POST Student
Write-Host "=== CREATE STUDENT ===" -ForegroundColor Green
try {
    $studentData = @{
        name = "John Doe"
        email = "john@example.com"
        dues = 1000
    } | ConvertTo-Json
    
    $newStudent = Invoke-WebRequest -Uri "http://localhost:3000/students" -Method POST -ContentType "application/json" -Body $studentData
    Write-Host "Status: $($newStudent.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($newStudent.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test GET Payments
Write-Host "=== GET PAYMENTS ===" -ForegroundColor Green
try {
    $payments = Invoke-WebRequest -Uri "http://localhost:3000/payments"
    Write-Host "Status: $($payments.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($payments.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test POST Payment
Write-Host "=== CREATE PAYMENT ===" -ForegroundColor Green
try {
    $paymentData = @{
        student_id = 1
        amount = 500
        description = "Test payment"
        date = (Get-Date).ToString("yyyy-MM-dd")
    } | ConvertTo-Json
    
    $newPayment = Invoke-WebRequest -Uri "http://localhost:3000/payments" -Method POST -ContentType "application/json" -Body $paymentData
    Write-Host "Status: $($newPayment.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($newPayment.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test GET Expenses
Write-Host "=== GET EXPENSES ===" -ForegroundColor Green
try {
    $expenses = Invoke-WebRequest -Uri "http://localhost:3000/expenses"
    Write-Host "Status: $($expenses.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($expenses.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test POST Expense
Write-Host "=== CREATE EXPENSE ===" -ForegroundColor Green
try {
    $expenseData = @{
        description = "Office supplies"
        amount = 200
        category = "supplies"
        date = (Get-Date).ToString("yyyy-MM-dd")
    } | ConvertTo-Json
    
    $newExpense = Invoke-WebRequest -Uri "http://localhost:3000/expenses" -Method POST -ContentType "application/json" -Body $expenseData
    Write-Host "Status: $($newExpense.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($newExpense.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test GET Salaries
Write-Host "=== GET SALARIES ===" -ForegroundColor Green
try {
    $salaries = Invoke-WebRequest -Uri "http://localhost:3000/salaries"
    Write-Host "Status: $($salaries.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($salaries.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test POST Salary
Write-Host "=== CREATE SALARY ===" -ForegroundColor Green
try {
    $salaryData = @{
        employee_name = "Teacher Jane"
        amount = 3000
        month = "12"
        year = "2024"
    } | ConvertTo-Json
    
    $newSalary = Invoke-WebRequest -Uri "http://localhost:3000/salaries" -Method POST -ContentType "application/json" -Body $salaryData
    Write-Host "Status: $($newSalary.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($newSalary.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test GET Reports
Write-Host "=== GET REPORTS ===" -ForegroundColor Green
try {
    $reports = Invoke-WebRequest -Uri "http://localhost:3000/reports"
    Write-Host "Status: $($reports.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($reports.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test Error Handling - Invalid Endpoint
Write-Host "=== TEST 404 ERROR ===" -ForegroundColor Green
try {
    $notFound = Invoke-WebRequest -Uri "http://localhost:3000/invalid-endpoint"
    Write-Host "Status: $($notFound.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($notFound.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Expected 404 Error: $($_.Exception.Message)" -ForegroundColor Magenta
}
Write-Host ""

# Test Validation Error - Missing Required Fields
Write-Host "=== TEST VALIDATION ERROR ===" -ForegroundColor Green
try {
    $invalidData = @{
        name = "Incomplete Student"
        # Missing required email field
    } | ConvertTo-Json
    
    $validationError = Invoke-WebRequest -Uri "http://localhost:3000/students" -Method POST -ContentType "application/json" -Body $invalidData
    Write-Host "Status: $($validationError.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($validationError.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Expected Validation Error: $($_.Exception.Message)" -ForegroundColor Magenta
}
Write-Host ""

Write-Host "======================================"
Write-Host "   API TESTING COMPLETED"
Write-Host "======================================"