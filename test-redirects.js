// test-redirects.js
const http = require('http');

console.log('🧪 Testing redirects after update\n');

const testCases = [
  // Test Persian URLs with spaces (%20) - Google's format
  {
    name: 'رباط کریم/خرید آپارتمان (Google format)',
    path: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
    expected: '/robat-karim/buy-apartment'
  },
  {
    name: 'رباط کریم/اجاره خانه (Google format)',
    path: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D8%AE%D8%A7%D9%86%D9%87',
    expected: '/robat-karim/rent-villa'
  },
  // Test Persian URLs with hyphens
  {
    name: 'رباط کریم/خرید آپارتمان (hyphen format)',
    path: '/%D8%B1%D8%A8%D8%A7%D8%B7-%DA%A9%D8%B1%DB%8C%D9%85/%D8%AE%D8%B1%DB%8C%D8%AF-%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
    expected: '/robat-karim/buy-apartment'
  },
  // Test simple redirect
  {
    name: 'Test simple redirect',
    path: '/test-123',
    expected: '/tehran/buy-apartment'
  }
];

let completed = 0;

testCases.forEach((testCase, index) => {
  setTimeout(() => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: testCase.path,
      method: 'HEAD'
    }, (res) => {
      completed++;
      
      const isRedirect = res.statusCode === 301 || res.statusCode === 302 || 
                         res.statusCode === 307 || res.statusCode === 308;
      const redirectsTo = res.headers.location;
      
      console.log(`${testCase.name}:`);
      console.log(`  Path: ${testCase.path}`);
      console.log(`  Status: ${res.statusCode}`);
      
      if (isRedirect && redirectsTo === testCase.expected) {
        console.log(`  ✅ PASS: Redirects to ${redirectsTo}`);
      } else if (isRedirect) {
        console.log(`  ❌ FAIL: Redirects to ${redirectsTo} (expected ${testCase.expected})`);
      } else {
        console.log(`  ❌ FAIL: No redirect (status ${res.statusCode})`);
      }
      console.log('');
      
      if (completed === testCases.length) {
        console.log('='.repeat(50));
        console.log('📊 Test Summary:');
        console.log('   After running this script:');
        console.log('   1. Restart your Next.js dev server');
        console.log('   2. Run: node test-redirects.js');
        console.log('   3. All tests should pass with ✅');
        console.log('='.repeat(50));
      }
    });
    
    req.on('error', (error) => {
      completed++;
      console.log(`${testCase.name}:`);
      console.log(`  ❌ ERROR: ${error.message}`);
      console.log(`  💡 Make sure Next.js dev server is running: npm run dev`);
      console.log('');
    });
    
    req.end();
  }, index * 300);
});
