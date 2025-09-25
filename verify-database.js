import { config } from './config.js';

/**
 * Database verification script to check Supabase tables and schemas
 */
async function verifyDatabase() {
  console.log('🔍 Verifying Supabase Database Connection and Schema...\n');
  
  const baseUrl = config.supabaseUrl;
  const headers = config.headers;

  // Test connection and get table schemas
  const tables = ['students', 'payments', 'expenses', 'salaries'];
  
  for (const table of tables) {
    console.log(`📋 Checking table: ${table}`);
    
    try {
      // Try to get table schema by querying with a limit
      const url = `${baseUrl}/rest/v1/${table}?limit=1`;
      const response = await fetch(url, { headers });
      
      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Table exists and accessible`);
        console.log(`   📊 Sample data count: ${data.length}`);
        if (data.length > 0) {
          console.log(`   🔑 Sample columns: ${Object.keys(data[0]).join(', ')}`);
        }
      } else {
        const errorText = await response.text();
        console.log(`   ❌ Error: ${response.status} - ${errorText}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Connection Error: ${error.message}`);
    }
    
    console.log('');
  }

  // Test a simple POST to see what specific error we get
  console.log('🧪 Testing POST operation to students table...');
  try {
    const testStudent = {
      name: 'Test Student',
      email: 'test@example.com',
      dues: 100
    };
    
    const url = `${baseUrl}/rest/v1/students`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(testStudent)
    });
    
    const responseText = await response.text();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${responseText}`);
    
    if (response.ok) {
      console.log('   ✅ POST operation successful!');
    } else {
      console.log('   ❌ POST operation failed - this tells us about table schema requirements');
    }
    
  } catch (error) {
    console.log(`   ❌ POST Error: ${error.message}`);
  }
  
  console.log('\n🏁 Database verification completed.');
}

// Run verification
verifyDatabase().catch(console.error);