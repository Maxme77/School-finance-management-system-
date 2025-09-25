Write-Host "=== TESTING EXPENSE CREATION ===" -ForegroundColor Green

$expenseData = @{
    description = "Test Expense Fixed"
    amount = 300
} | ConvertTo-Json

Write-Host "Request Data: $expenseData" -ForegroundColor Yellow

try {
    $result = Invoke-WebRequest -Uri "http://localhost:3000/expenses" -Method POST -ContentType "application/json" -Body $expenseData
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Status: $($result.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($result.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TESTING EXPENSE GET ===" -ForegroundColor Green
try {
    $expenses = Invoke-WebRequest -Uri "http://localhost:3000/expenses"
    Write-Host "Status: $($expenses.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response: $($expenses.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}