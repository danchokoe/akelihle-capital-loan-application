#!/usr/bin/env node

const bcrypt = require('bcryptjs');

console.log('🔐 Akelihle Capital - Test Credentials\n');

// Test admin credentials
const adminHash = '$2a$10$7MteCQG2qtzUm9GRuz9gJuZPUwohaJuUuRC2LVXD3AG4RgjxZ9OUK';

async function testCredentials() {
  console.log('👨‍💼 ADMIN CREDENTIALS:');
  console.log('Username: admin');
  console.log('Password: password123');
  
  const adminMatch = await bcrypt.compare('password123', adminHash);
  console.log(`✅ Admin password verified: ${adminMatch}\n`);
  
  console.log('👤 TEST USER CREDENTIALS:');
  console.log('Email: ldchokoe@gmail.com');
  console.log('Password: test123');
  console.log('Note: This user needs to be created in the database\n');
  
  console.log('🌐 TESTING ENDPOINTS:');
  console.log('Local Backend: http://localhost:3001');
  console.log('AWS Frontend: https://main.d11901v661d27z.amplifyapp.com/');
  console.log('\n⚠️  IMPORTANT: AWS Amplify only hosts the frontend!');
  console.log('   The backend API is not running on AWS Amplify.');
  console.log('   You need to test locally or deploy backend separately.\n');
  
  // Test if local backend is running
  try {
    const response = await fetch('http://localhost:3001/api/health');
    if (response.ok) {
      console.log('✅ Local backend is running');
    } else {
      console.log('❌ Local backend returned error:', response.status);
    }
  } catch (error) {
    console.log('❌ Local backend is not running');
    console.log('   Start it with: cd backend && npm run dev');
  }
}

testCredentials().catch(console.error);