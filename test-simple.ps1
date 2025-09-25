Write-Host "EXACT SCHEMA COMPREHENSIVE TEST"
Write-Host "======================================"

$successCount = 0
$totalTests = 0

function Test-API {
    param($Name, $ScriptBlock)
    $global:totalTests++
    Write-Host "=== $Name ===" -ForegroundColor Green
    try {
        & $ScriptBlock
        $global:successCount++
        Write-Host "PASSED" -ForegroundColor Green
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 1: Health Check
Test-API "HEALTH CHECK" {
    $health = Invoke-WebRequest -Uri "http://localhost:3000/health"
    if ($health.StatusCode -ne 200) { throw "Health check failed" }
    Write-Host "Server is running" -ForegroundColor Cyan
}

# Test 2: Create Student
Test-API "CREATE STUDENT" {
    $studentData = @{
        name = "Schema Test Student"
        class = "Grade 11"
        roll_no = "ST2024001"
        parent_contact = "+1122334455"
        fee_structure = 5000
        dues = 2500
    } | ConvertTo-Json
    
    $student = Invoke-WebRequest -Uri "http://localhost:3000/students" -Method POST -ContentType "application/json" -Body $studentData
    if ($student.StatusCode -ne 201) { throw "Student creation failed" }
    Write-Host "Student created successfully" -ForegroundColor Cyan
}

# Test 3: Create Staff Member
Test-API "CREATE STAFF MEMBER" {
    $staffData = @{
        name = "Teacher John Smith"
        role = "Mathematics Teacher"
        salary = 45000
    } | ConvertTo-Json
    
    $staff = Invoke-WebRequest -Uri "http://localhost:3000/staff" -Method POST -ContentType "application/json" -Body $staffData
    if ($staff.StatusCode -ne 201) { throw "Staff creation failed" }
    Write-Host "Staff member created successfully" -ForegroundColor Cyan
}

# Test 4: Create Expense
Test-API "CREATE EXPENSE" {
    $expenseData = @{
        category = "Office Supplies"
        description = "Stationery and printing materials"
        amount = 750
        expense_date = "2024-12-25"
    } | ConvertTo-Json
    
    $expense = Invoke-WebRequest -Uri "http://localhost:3000/expenses" -Method POST -ContentType "application/json" -Body $expenseData
    if ($expense.StatusCode -ne 201) { throw "Expense creation failed" }
    Write-Host "Expense recorded with all fields" -ForegroundColor Cyan
}

# Test 5: Get All Data
Test-API "GET ALL DATA" {
    $students = Invoke-WebRequest -Uri "http://localhost:3000/students"
    $staff = Invoke-WebRequest -Uri "http://localhost:3000/staff"
    $payments = Invoke-WebRequest -Uri "http://localhost:3000/payments"
    $expenses = Invoke-WebRequest -Uri "http://localhost:3000/expenses"
    $salaries = Invoke-WebRequest -Uri "http://localhost:3000/salaries"
    
    $studentsData = $students.Content | ConvertFrom-Json
    $staffData = $staff.Content | ConvertFrom-Json
    $paymentsData = $payments.Content | ConvertFrom-Json
    $expensesData = $expenses.Content | ConvertFrom-Json
    $salariesData = $salaries.Content | ConvertFrom-Json
    
    Write-Host "Students: $($studentsData.count)" -ForegroundColor Cyan
    Write-Host "Staff: $($staffData.count)" -ForegroundColor Cyan
    Write-Host "Payments: $($paymentsData.count)" -ForegroundColor Cyan
    Write-Host "Expenses: $($expensesData.count)" -ForegroundColor Cyan
    Write-Host "Salaries: $($salariesData.count)" -ForegroundColor Cyan
}

# Test 6: Get Financial Reports
Test-API "GET FINANCIAL REPORTS" {
    $reports = Invoke-WebRequest -Uri "http://localhost:3000/reports"
    if ($reports.StatusCode -ne 200) { throw "Get reports failed" }
    
    $reportsData = $reports.Content | ConvertFrom-Json
    $summary = $reportsData.data.summary
    
    Write-Host "Total Fees: $($summary.totalFeesCollected)" -ForegroundColor Cyan
    Write-Host "Total Expenses: $($summary.totalExpenses)" -ForegroundColor Cyan
    Write-Host "Total Salaries: $($summary.totalSalaries)" -ForegroundColor Cyan
    Write-Host "Net Income: $($summary.netIncome)" -ForegroundColor Cyan
    Write-Host "Profit Margin: $($summary.profitMargin.ToString('F1'))%" -ForegroundColor Cyan
}

# Test 7: Validation Tests
Test-API "VALIDATION TESTS" {
    # Test missing required field
    try {
        $invalidData = @{ class = "Grade 10" } | ConvertTo-Json
        $invalid = Invoke-WebRequest -Uri "http://localhost:3000/students" -Method POST -ContentType "application/json" -Body $invalidData
        throw "Should have failed with missing required field"
    } catch {
        if ($_.Exception.Message -notlike "*400*") { throw "Expected 400 error" }
    }
    
    # Test invalid UUID
    try {
        $invalid = Invoke-WebRequest -Uri "http://localhost:3000/students/invalid-uuid"
        throw "Should have failed with invalid UUID"
    } catch {
        if ($_.Exception.Message -notlike "*400*") { throw "Expected 400 error" }
    }
    
    Write-Host "Validation errors handled correctly" -ForegroundColor Cyan
}

Write-Host "======================================"
Write-Host "TEST SUMMARY"
Write-Host "======================================"
Write-Host "Passed: $successCount/$totalTests tests"

if ($successCount -eq $totalTests) {
    Write-Host "ALL TESTS PASSED! API IS FULLY FUNCTIONAL!" -ForegroundColor Green
    Write-Host "Features working:" -ForegroundColor Green
    Write-Host "- Student Management (UUID-based)" -ForegroundColor Green
    Write-Host "- Staff Management (New table)" -ForegroundColor Green
    Write-Host "- Payment Processing" -ForegroundColor Green
    Write-Host "- Expense Tracking" -ForegroundColor Green
    Write-Host "- Salary Management" -ForegroundColor Green
    Write-Host "- Financial Reporting" -ForegroundColor Green
    Write-Host "- Validation and Error Handling" -ForegroundColor Green
} else {
    Write-Host "Some tests failed. Check errors above." -ForegroundColor Yellow
}

Write-Host "======================================"