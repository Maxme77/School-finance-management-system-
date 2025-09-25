import { config } from './config.js';

/**
 * Test all database tables with correct schema
 */
async function testCompleteSchema() {
  console.log('🔍 Testing Complete Database Schema...\n');
  
  const baseUrl = config.supabaseUrl;
  const headers = config.headers;

  // Get the UUID of the existing student
  console.log('📋 Getting existing student for UUID reference...');
  const studentsResponse = await fetch(`${baseUrl}/rest/v1/students`, { headers });
  const studentsData = await studentsResponse.json();
  
  if (studentsData.length > 0) {
    const studentId = studentsData[0].id;
    console.log(`   Found student UUID: ${studentId}`);
    
    // Test payments with correct UUID
    console.log('\n📋 Testing payments table with UUID...');
    const paymentData = {
      student_id: studentId,
      amount: 500
    };
    
    try {
      const paymentResponse = await fetch(`${baseUrl}/rest/v1/payments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(paymentData)
      });
      
      const paymentResult = await paymentResponse.text();
      console.log(`   Status: ${paymentResponse.status}`);
      console.log(`   Response: ${paymentResult}`);
      
      if (paymentResponse.ok) {
        console.log('   ✅ Payments table working!');
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  // Test expenses table
  console.log('\n📋 Testing expenses table...');
  const expenseTestCases = [
    { description: 'Office supplies', amount: 200 },
    { expense_description: 'Office supplies', expense_amount: 200 },
    { title: 'Office supplies', amount: 200 },
    { name: 'Office supplies', cost: 200 }
  ];

  for (let i = 0; i < expenseTestCases.length; i++) {
    const testData = expenseTestCases[i];
    console.log(`   Test ${i + 1}: ${JSON.stringify(testData)}`);
    
    try {
      const response = await fetch(`${baseUrl}/rest/v1/expenses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(testData)
      });
      
      const responseText = await response.text();
      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        console.log(`   ✅ SUCCESS! Working schema: ${JSON.stringify(testData)}`);
        console.log(`   Response: ${responseText}`);
        break;
      } else {
        console.log(`   ❌ Failed: ${responseText.substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  // Test salaries table
  console.log('\n📋 Testing salaries table...');
  const salaryTestCases = [
    { employee_name: 'Teacher Jane', amount: 3000 },
    { name: 'Teacher Jane', salary: 3000 },
    { teacher_name: 'Teacher Jane', salary_amount: 3000 },
    { employee: 'Teacher Jane', amount: 3000 }
  ];

  for (let i = 0; i < salaryTestCases.length; i++) {
    const testData = salaryTestCases[i];
    console.log(`   Test ${i + 1}: ${JSON.stringify(testData)}`);
    
    try {
      const response = await fetch(`${baseUrl}/rest/v1/salaries`, {
        method: 'POST',
        headers,
        body: JSON.stringify(testData)
      });
      
      const responseText = await response.text();
      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        console.log(`   ✅ SUCCESS! Working schema: ${JSON.stringify(testData)}`);
        console.log(`   Response: ${responseText}`);
        break;
      } else {
        console.log(`   ❌ Failed: ${responseText.substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('\n🏁 Complete schema testing finished.');
}

// Run complete schema test
testCompleteSchema().catch(console.error);