Write-Host "======================================"
Write-Host "   FINAL COMPREHENSIVE API TEST SUITE"
Write-Host "======================================"
Write-Host ""

$successCount = 0
$totalTests = 0

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
    Write-Host "Status: $($health.StatusCode)" -ForegroundColor Yellow
}

# Test 2: Create Student
Test-Endpoint "CREATE STUDENT" {
    $studentData = @{
        name = "Final Test Student"
        class = "Grade 12"
        roll_no = "FT001"
        parent_contact = "+9876543210"
        dues = 2000
    } | ConvertTo-Json
    
    $student = Invoke-WebRequest -Uri "http://localhost:3000/students" -Method POST -ContentType "application/json" -Body $studentData
    if ($student.StatusCode -ne 201) { throw "Student creation failed" }
    
    $studentResponse = $student.Content | ConvertFrom-Json
    $global:testStudentUUID = $studentResponse.data.id
    Write-Host "Created student UUID: $global:testStudentUUID" -ForegroundColor Cyan
}

# Test 3: Get All Students
Test-Endpoint "GET ALL STUDENTS" {
    $students = Invoke-WebRequest -Uri "http://localhost:3000/students"
    if ($students.StatusCode -ne 200) { throw "Get students failed" }
    
    $studentsData = $students.Content | ConvertFrom-Json
    Write-Host "Total students: $($studentsData.count)" -ForegroundColor Cyan
}

# Test 4: Get Student by UUID
Test-Endpoint "GET STUDENT BY UUID" {
    if (-not $global:testStudentUUID) { throw "No test student UUID available" }
    
    $student = Invoke-WebRequest -Uri "http://localhost:3000/students/$global:testStudentUUID"
    if ($student.StatusCode -ne 200) { throw "Get student by UUID failed" }
    
    $studentData = $student.Content | ConvertFrom-Json
    Write-Host "Student name: $($studentData.data.name)" -ForegroundColor Cyan
}

# Test 5: Update Student
Test-Endpoint "UPDATE STUDENT" {
    if (-not $global:testStudentUUID) { throw "No test student UUID available" }
    
    $updateData = @{ dues = 1500 } | ConvertTo-Json
    $update = Invoke-WebRequest -Uri "http://localhost:3000/students/$global:testStudentUUID" -Method PUT -ContentType "application/json" -Body $updateData
    if ($update.StatusCode -ne 200) { throw "Student update failed" }
    Write-Host "Student updated successfully" -ForegroundColor Cyan
}

# Test 6: Create Payment
Test-Endpoint "CREATE PAYMENT" {
    if (-not $global:testStudentUUID) { throw "No test student UUID available" }
    
    $paymentData = @{
        student_id = $global:testStudentUUID
        amount = 750
    } | ConvertTo-Json
    
    $payment = Invoke-WebRequest -Uri "http://localhost:3000/payments" -Method POST -ContentType "application/json" -Body $paymentData
    if ($payment.StatusCode -ne 201) { throw "Payment creation failed" }
    Write-Host "Payment recorded successfully" -ForegroundColor Cyan
}

# Test 7: Get All Payments
Test-Endpoint "GET ALL PAYMENTS" {
    $payments = Invoke-WebRequest -Uri "http://localhost:3000/payments"
    if ($payments.StatusCode -ne 200) { throw "Get payments failed" }
    
    $paymentsData = $payments.Content | ConvertFrom-Json
    Write-Host "Total payments: $($paymentsData.count)" -ForegroundColor Cyan
}

# Test 8: Create Expense
Test-Endpoint "CREATE EXPENSE" {
    $expenseData = @{
        description = "Final Test Office Equipment"
        amount = 450
        category = "equipment"
    } | ConvertTo-Json
    
    $expense = Invoke-WebRequest -Uri "http://localhost:3000/expenses" -Method POST -ContentType "application/json" -Body $expenseData
    if ($expense.StatusCode -ne 201) { throw "Expense creation failed" }
    Write-Host "Expense recorded successfully" -ForegroundColor Cyan
}

# Test 9: Get All Expenses
Test-Endpoint "GET ALL EXPENSES" {
    $expenses = Invoke-WebRequest -Uri "http://localhost:3000/expenses"
    if ($expenses.StatusCode -ne 200) { throw "Get expenses failed" }
    
    $expensesData = $expenses.Content | ConvertFrom-Json
    Write-Host "Total expenses: $($expensesData.count)" -ForegroundColor Cyan
}

# Test 10: Get Financial Reports
Test-Endpoint "GET FINANCIAL REPORTS" {
    $reports = Invoke-WebRequest -Uri "http://localhost:3000/reports"
    if ($reports.StatusCode -ne 200) { throw "Get reports failed" }
    
    $reportsData = $reports.Content | ConvertFrom-Json
    $summary = $reportsData.data.summary
    Write-Host "Total Fees: `$$($summary.totalFeesCollected)" -ForegroundColor Cyan
    Write-Host "Total Expenses: `$$($summary.totalExpenses)" -ForegroundColor Cyan
    Write-Host "Net Income: `$$($summary.netIncome)" -ForegroundColor Cyan
    Write-Host "Profit Margin: $($summary.profitMargin.ToString('F1'))%" -ForegroundColor Cyan
}

# Test 11: Error Handling - Invalid UUID
Test-Endpoint "ERROR HANDLING - INVALID UUID" {
    try {
        $invalid = Invoke-WebRequest -Uri "http://localhost:3000/students/invalid-uuid"
        throw "Should have failed with invalid UUID"
    } catch {
        if ($_.Exception.Message -notlike "*400*") { throw "Expected 400 error for invalid UUID" }
        Write-Host "Correctly rejected invalid UUID" -ForegroundColor Cyan
    }
}

# Test 12: Validation - Missing Required Fields
Test-Endpoint "VALIDATION - MISSING REQUIRED FIELDS" {
    try {
        $invalidData = @{ class = "Grade 10" } | ConvertTo-Json
        $invalid = Invoke-WebRequest -Uri "http://localhost:3000/students" -Method POST -ContentType "application/json" -Body $invalidData
        throw "Should have failed with missing required field"
    } catch {
        if ($_.Exception.Message -notlike "*400*") { throw "Expected 400 error for missing required field" }
        Write-Host "Correctly rejected missing required field" -ForegroundColor Cyan
    }
}

Write-Host "======================================"
Write-Host "   FINAL TEST SUMMARY"
Write-Host "======================================"
Write-Host "Passed: $successCount/$totalTests tests" -ForegroundColor $(if ($successCount -eq $totalTests) { "Green" } else { "Yellow" })
Write-Host "Success Rate: $(($successCount / $totalTests * 100).ToString('F1'))%" -ForegroundColor $(if ($successCount -eq $totalTests) { "Green" } else { "Yellow" })

if ($successCount -eq $totalTests) {
    Write-Host "🎉 ALL TESTS PASSED! API IS FULLY FUNCTIONAL!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Check the errors above." -ForegroundColor Yellow
}

Write-Host "======================================"