import { config } from './config.js';

/**
 * Inspect actual database schema by trying different field combinations
 */
async function inspectSchema() {
  console.log('🔍 Inspecting Supabase Database Schema...\n');
  
  const baseUrl = config.supabaseUrl;
  const headers = config.headers;

  // Test common field variations for students table
  console.log('📋 Testing students table with different fields...');
  
  const studentTestCases = [
    { name: 'Test Student' },
    { name: 'Test Student', email: 'test@example.com' },
    { name: 'Test Student', student_name: 'Test Student' },
    { student_name: 'Test Student', student_email: 'test@example.com' },
    { name: 'Test Student', dues: 100 },
    { student_name: 'Test Student', outstanding_dues: 100 },
    { full_name: 'Test Student', contact_email: 'test@example.com' }
  ];

  for (let i = 0; i < studentTestCases.length; i++) {
    const testData = studentTestCases[i];
    console.log(`   Test ${i + 1}: ${JSON.stringify(testData)}`);
    
    try {
      const response = await fetch(`${baseUrl}/rest/v1/students`, {
        method: 'POST',
        headers,
        body: JSON.stringify(testData)
      });
      
      const responseText = await response.text();
      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        console.log(`   ✅ SUCCESS! Working schema found: ${JSON.stringify(testData)}`);
        console.log(`   Response: ${responseText}`);
        break;
      } else {
        console.log(`   ❌ Failed: ${responseText.substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('\n📋 Testing payments table with different fields...');
  
  const paymentTestCases = [
    { student_id: 1, amount: 100 },
    { student_id: 1, payment_amount: 100 },
    { student_ref: 1, amount: 100 },
    { student_id: 1, amount: 100, date: '2024-12-25' },
    { student_id: 1, amount: 100, payment_date: '2024-12-25' },
    { student_id: 1, fee_amount: 100, payment_date: '2024-12-25' }
  ];

  for (let i = 0; i < paymentTestCases.length; i++) {
    const testData = paymentTestCases[i];
    console.log(`   Test ${i + 1}: ${JSON.stringify(testData)}`);
    
    try {
      const response = await fetch(`${baseUrl}/rest/v1/payments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(testData)
      });
      
      const responseText = await response.text();
      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        console.log(`   ✅ SUCCESS! Working schema found: ${JSON.stringify(testData)}`);
        console.log(`   Response: ${responseText}`);
        break;
      } else {
        console.log(`   ❌ Failed: ${responseText.substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('\n🏁 Schema inspection completed.');
}

// Run inspection
inspectSchema().catch(console.error);