# Updated API Testing Script for Student Management System (Fixed Schema)

Write-Host "======================================"
Write-Host "   UPDATED API TESTS (CORRECT SCHEMA)"
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

# Test GET Students (get existing student UUID)
Write-Host "=== GET STUDENTS ===" -ForegroundColor Green
try {
    $students = Invoke-WebRequest -Uri "http://localhost:3000/students"
    Write-Host "Status: $($students.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($students.Content)" -ForegroundColor Cyan
    
    # Parse to get student UUID
    $studentsData = $students.Content | ConvertFrom-Json
    if ($studentsData.data.Count -gt 0) {
        $studentUUID = $studentsData.data[0].id
        Write-Host "Found existing student UUID: $studentUUID" -ForegroundColor Magenta
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test POST Student (with correct schema - only name required)
Write-Host "=== CREATE STUDENT (CORRECT SCHEMA) ===" -ForegroundColor Green
try {
    $studentData = @{
        name = "API Test Student"
        class = "Grade 10"
        roll_no = "2024001"
        parent_contact = "+1234567890"
        dues = 1500
    } | ConvertTo-Json
    
    $newStudent = Invoke-WebRequest -Uri "http://localhost:3000/students" -Method POST -ContentType "application/json" -Body $studentData
    Write-Host "Status: $($newStudent.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($newStudent.Content)" -ForegroundColor Cyan
    
    # Get the new student UUID
    $newStudentData = $newStudent.Content | ConvertFrom-Json
    if ($newStudentData.success -and $newStudentData.data) {
        $newStudentUUID = $newStudentData.data.id
        Write-Host "New student UUID: $newStudentUUID" -ForegroundColor Magenta
        $studentUUID = $newStudentUUID
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test GET Student by UUID
if ($studentUUID) {
    Write-Host "=== GET STUDENT BY UUID ===" -ForegroundColor Green
    try {
        $student = Invoke-WebRequest -Uri "http://localhost:3000/students/$studentUUID"
        Write-Host "Status: $($student.StatusCode)" -ForegroundColor Yellow
        Write-Host "Response: $($student.Content)" -ForegroundColor Cyan
    } catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test POST Payment (with UUID)
if ($studentUUID) {
    Write-Host "=== CREATE PAYMENT (WITH UUID) ===" -ForegroundColor Green
    try {
        $paymentData = @{
            student_id = $studentUUID
            amount = 500
        } | ConvertTo-Json
        
        $newPayment = Invoke-WebRequest -Uri "http://localhost:3000/payments" -Method POST -ContentType "application/json" -Body $paymentData
        Write-Host "Status: $($newPayment.StatusCode)" -ForegroundColor Yellow
        Write-Host "Response: $($newPayment.Content)" -ForegroundColor Cyan
    } catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

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

# Test POST Expense (confirmed working schema)
Write-Host "=== CREATE EXPENSE (CONFIRMED SCHEMA) ===" -ForegroundColor Green
try {
    $expenseData = @{
        description = "API Test Supplies"
        amount = 250
    } | ConvertTo-Json
    
    $newExpense = Invoke-WebRequest -Uri "http://localhost:3000/expenses" -Method POST -ContentType "application/json" -Body $expenseData
    Write-Host "Status: $($newExpense.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($newExpense.Content)" -ForegroundColor Cyan
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

# Test GET Reports
Write-Host "=== GET REPORTS (FINAL TEST) ===" -ForegroundColor Green
try {
    $reports = Invoke-WebRequest -Uri "http://localhost:3000/reports"
    Write-Host "Status: $($reports.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($reports.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test Validation - Missing required field
Write-Host "=== TEST VALIDATION (MISSING NAME) ===" -ForegroundColor Green
try {
    $invalidData = @{
        class = "Grade 11"
        # Missing required name field
    } | ConvertTo-Json
    
    $validationError = Invoke-WebRequest -Uri "http://localhost:3000/students" -Method POST -ContentType "application/json" -Body $invalidData
    Write-Host "Unexpected success: $($validationError.Content)" -ForegroundColor Yellow
} catch {
    Write-Host "Expected validation error: $($_.Exception.Message)" -ForegroundColor Magenta
}
Write-Host ""

# Test UUID validation
Write-Host "=== TEST UUID VALIDATION ===" -ForegroundColor Green
try {
    $invalidUUID = Invoke-WebRequest -Uri "http://localhost:3000/students/invalid-uuid-format"
    Write-Host "Unexpected success: $($invalidUUID.Content)" -ForegroundColor Yellow
} catch {
    Write-Host "Expected UUID validation error: $($_.Exception.Message)" -ForegroundColor Magenta
}
Write-Host ""

Write-Host "======================================"
Write-Host "   UPDATED API TESTING COMPLETED"
Write-Host "======================================"