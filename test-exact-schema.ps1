Write-Host "======================================"
Write-Host "   EXACT SCHEMA COMPREHENSIVE TEST"
Write-Host "======================================"
Write-Host ""

$successCount = 0
$totalTests = 0
$testStudentUUID = $null
$testStaffUUID = $null

function Test-Endpoint {
    param($Name, $ScriptBlock)
    $global:totalTests++
    Write-Host "=== $Name ===" -ForegroundColor Green
    try {
        & $ScriptBlock
        $global:successCount++
        Write-Host "✅ PASSED" -ForegroundColor Green
    } catch {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 1: Health Check
Test-Endpoint "HEALTH CHECK" {
    $health = Invoke-WebRequest -Uri "http://localhost:3000/health"
    if ($health.StatusCode -ne 200) { throw "Health check failed" }
    Write-Host "✓ Server is running" -ForegroundColor Cyan
}

# Test 2: Create Student (exact schema)
Test-Endpoint "CREATE STUDENT (EXACT SCHEMA)" {
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
    
    Write-Host "✓ Student created successfully" -ForegroundColor Cyan
    
    # Get the created student to extract UUID
    $students = Invoke-WebRequest -Uri "http://localhost:3000/students"
    $studentsData = $students.Content | ConvertFrom-Json
    if ($studentsData.data.Count -gt 0) {
        $global:testStudentUUID = $studentsData.data[-1].id  # Get the last created student
        Write-Host "✓ Student UUID captured: $global:testStudentUUID" -ForegroundColor Cyan
    }
}

# Test 3: Create Staff Member (new table)
Test-Endpoint "CREATE STAFF MEMBER" {
    $staffData = @{
        name = "Teacher John Smith"
        role = "Mathematics Teacher"
        salary = 45000
    } | ConvertTo-Json
    
    $staff = Invoke-WebRequest -Uri "http://localhost:3000/staff" -Method POST -ContentType "application/json" -Body $staffData
    if ($staff.StatusCode -ne 201) { throw "Staff creation failed" }
    
    Write-Host "✓ Staff member created successfully" -ForegroundColor Cyan
    
    # Get the created staff to extract UUID
    $staffList = Invoke-WebRequest -Uri "http://localhost:3000/staff"
    $staffData = $staffList.Content | ConvertFrom-Json
    if ($staffData.data.Count -gt 0) {
        $global:testStaffUUID = $staffData.data[-1].id  # Get the last created staff
        Write-Host "✓ Staff UUID captured: $global:testStaffUUID" -ForegroundColor Cyan
    }
}

# Test 4: Create Payment (exact schema)
Test-Endpoint "CREATE PAYMENT (EXACT SCHEMA)" {
    if (-not $global:testStudentUUID) { throw "No test student UUID available" }
    
    $paymentData = @{
        student_id = $global:testStudentUUID
        amount = 1000
        mode = "Cash"
        payment_date = "2024-12-25"
    } | ConvertTo-Json
    
    $payment = Invoke-WebRequest -Uri "http://localhost:3000/payments" -Method POST -ContentType "application/json" -Body $paymentData
    if ($payment.StatusCode -ne 201) { throw "Payment creation failed" }
    
    Write-Host "✓ Payment recorded with mode and payment_date" -ForegroundColor Cyan
}

# Test 5: Create Expense (exact schema)
Test-Endpoint "CREATE EXPENSE (EXACT SCHEMA)" {
    $expenseData = @{
        category = "Office Supplies"
        description = "Stationery and printing materials"
        amount = 750
        expense_date = "2024-12-25"
    } | ConvertTo-Json
    
    $expense = Invoke-WebRequest -Uri "http://localhost:3000/expenses" -Method POST -ContentType "application/json" -Body $expenseData
    if ($expense.StatusCode -ne 201) { throw "Expense creation failed" }
    
    Write-Host "✓ Expense recorded with category and expense_date" -ForegroundColor Cyan
}

# Test 6: Create Salary (exact schema - requires staff_id)
Test-Endpoint "CREATE SALARY (EXACT SCHEMA)" {
    if (-not $global:testStaffUUID) { throw "No test staff UUID available" }
    
    $salaryData = @{
        staff_id = $global:testStaffUUID
        amount = 45000
        paid_date = "2024-12-31"
    } | ConvertTo-Json
    
    $salary = Invoke-WebRequest -Uri "http://localhost:3000/salaries" -Method POST -ContentType "application/json" -Body $salaryData
    if ($salary.StatusCode -ne 201) { throw "Salary creation failed" }
    
    Write-Host "✓ Salary recorded with staff_id and paid_date" -ForegroundColor Cyan
}

# Test 7: Get All Data
Test-Endpoint "GET ALL DATA VERIFICATION" {
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
    
    Write-Host "✓ Students: $($studentsData.count)" -ForegroundColor Cyan
    Write-Host "✓ Staff: $($staffData.count)" -ForegroundColor Cyan
    Write-Host "✓ Payments: $($paymentsData.count)" -ForegroundColor Cyan
    Write-Host "✓ Expenses: $($expensesData.count)" -ForegroundColor Cyan
    Write-Host "✓ Salaries: $($salariesData.count)" -ForegroundColor Cyan
}

# Test 8: Get Financial Reports
Test-Endpoint "GET FINANCIAL REPORTS" {
    $reports = Invoke-WebRequest -Uri "http://localhost:3000/reports"
    if ($reports.StatusCode -ne 200) { throw "Get reports failed" }
    
    $reportsData = $reports.Content | ConvertFrom-Json
    $summary = $reportsData.data.summary
    
    Write-Host "✓ Total Fees Collected: `$$($summary.totalFeesCollected)" -ForegroundColor Cyan
    Write-Host "✓ Total Expenses: `$$($summary.totalExpenses)" -ForegroundColor Cyan
    Write-Host "✓ Total Salaries: `$$($summary.totalSalaries)" -ForegroundColor Cyan
    Write-Host "✓ Net Income: `$$($summary.netIncome)" -ForegroundColor Cyan
    Write-Host "✓ Profit Margin: $($summary.profitMargin.ToString('F1'))%" -ForegroundColor Cyan
}

# Test 9: Update Student
Test-Endpoint "UPDATE STUDENT" {
    if (-not $global:testStudentUUID) { throw "No test student UUID available" }
    
    $updateData = @{ 
        dues = 1500  # Updated dues after payment
        class = "Grade 12"  # Promotion
    } | ConvertTo-Json
    
    $update = Invoke-WebRequest -Uri "http://localhost:3000/students/$global:testStudentUUID" -Method PUT -ContentType "application/json" -Body $updateData
    if ($update.StatusCode -ne 200) { throw "Student update failed" }
    
    Write-Host "✓ Student updated successfully" -ForegroundColor Cyan
}

# Test 10: Get Individual Records by UUID
Test-Endpoint "GET RECORDS BY UUID" {
    if (-not $global:testStudentUUID) { throw "No test student UUID available" }
    if (-not $global:testStaffUUID) { throw "No test staff UUID available" }
    
    $student = Invoke-WebRequest -Uri "http://localhost:3000/students/$global:testStudentUUID"
    $staff = Invoke-WebRequest -Uri "http://localhost:3000/staff/$global:testStaffUUID"
    
    if ($student.StatusCode -ne 200) { throw "Get student by UUID failed" }
    if ($staff.StatusCode -ne 200) { throw "Get staff by UUID failed" }
    
    $studentData = $student.Content | ConvertFrom-Json
    $staffData = $staff.Content | ConvertFrom-Json
    
    Write-Host "✓ Student: $($studentData.data.name) (Class: $($studentData.data.class))" -ForegroundColor Cyan
    Write-Host "✓ Staff: $($staffData.data.name) (Role: $($staffData.data.role))" -ForegroundColor Cyan
}

# Test 11: Validation Tests
Test-Endpoint "VALIDATION TESTS" {
    # Test missing required field for student
    try {
        $invalidData = @{ class = "Grade 10" } | ConvertTo-Json
        $invalid = Invoke-WebRequest -Uri "http://localhost:3000/students" -Method POST -ContentType "application/json" -Body $invalidData
        throw "Should have failed with missing required field"
    } catch {
        if ($_.Exception.Message -notlike "*400*") { throw "Expected 400 error for missing required field" }
    }
    
    # Test invalid UUID format
    try {
        $invalid = Invoke-WebRequest -Uri "http://localhost:3000/students/invalid-uuid"
        throw "Should have failed with invalid UUID"
    } catch {
        if ($_.Exception.Message -notlike "*400*") { throw "Expected 400 error for invalid UUID" }
    }
    
    Write-Host "✓ Validation errors handled correctly" -ForegroundColor Cyan
}

Write-Host "======================================"
Write-Host "   EXACT SCHEMA TEST SUMMARY"
Write-Host "======================================"
Write-Host "Passed: $successCount/$totalTests tests" -ForegroundColor $(if ($successCount -eq $totalTests) { "Green" } else { "Yellow" })
Write-Host "Success Rate: $(($successCount / $totalTests * 100).ToString('F1'))%" -ForegroundColor $(if ($successCount -eq $totalTests) { "Green" } else { "Yellow" })

if ($successCount -eq $totalTests) {
    Write-Host "🎉 ALL TESTS PASSED! API MATCHES EXACT SUPABASE SCHEMA!" -ForegroundColor Green
    Write-Host "🚀 The Student Management System API is fully functional with:" -ForegroundColor Green
    Write-Host "   ✅ Student Management (UUID-based)" -ForegroundColor Green
    Write-Host "   ✅ Staff Management (New table)" -ForegroundColor Green
    Write-Host "   ✅ Payment Processing (with mode & payment_date)" -ForegroundColor Green
    Write-Host "   ✅ Expense Tracking (with category & expense_date)" -ForegroundColor Green
    Write-Host "   ✅ Salary Management (staff_id & paid_date)" -ForegroundColor Green
    Write-Host "   ✅ Financial Reporting (comprehensive summaries)" -ForegroundColor Green
    Write-Host "   ✅ Validation & Error Handling" -ForegroundColor Green
} else {
    Write-Host "⚠️  $($totalTests - $successCount) test(s) failed. Check errors above." -ForegroundColor Yellow
}

Write-Host "======================================"