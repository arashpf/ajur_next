// manual-redirects.js
// Add your manual redirects here, then run: node manual-redirects.js
// This will update next.config.js with your manual redirects

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const projectRoot = process.cwd();

// ============================================
// ADD YOUR MANUAL REDIRECTS IN THIS ARRAY
// ============================================
const manualRedirects = [
  // Your redirects remain EXACTLY as they are
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%B2%D9%85%DB%8C%D9%86',
    destination: '/robat-karim/buy-residential-land',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D9%81%D8%B1%D9%88%D8%B4%20%20%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C%20%D9%88%20%D8%AA%D8%AC%D8%A7%D8%B1%DB%8C',
    destination: '/robat-karim/buy-commercial-property',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D8%AE%D8%A7%D9%86%D9%87',
    destination: '/robat-karim/rent-apartment',
    permanent: true,
  },
  {
    source: '/noshahr/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
    destination: '/noshahr/buy-residential-land',
    permanent: true,
  },
  {
    source: '/robat-karim/%D8%B2%D9%85%DB%8C%D9%86',
    destination: '/robat-karim/buy-residential-land',
    permanent: true,
  },
  {
    source: '/malard/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
    destination: '/malard/buy-apartment',
    permanent: true,
  },
  {
    source: '/astane-ashrafiye/%D8%B2%D9%85%DB%8C%D9%86',
    destination: '/astane-ashrafiye/buy-residential-land',
    permanent: true,
  },
  {
    source: '/lahijan/%D9%81%D8%B1%D9%88%D8%B4%20%D8%AE%D8%A7%D9%86%D9%87',
    destination: '/lahijan/buy-apartment',
    permanent: true,
  },
  {
    source: '/%D9%85%D8%B4%D9%87%D8%AF/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
    destination: '/mashhad/rent-apartment',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D9%81%D8%B1%D9%88%D8%B4%20%D8%AE%D8%A7%D9%86%D9%87',
    destination: '/robat-karim/buy-apartment',
    permanent: true,
  },
  {
    source: '/chaf-chamkhale/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
    destination: '/chaf-chamkhale/buy-villa',
    permanent: true,
  },
  {
    source: '/ramsar/%D9%81%D8%B1%D9%88%D8%B4%20%D8%AE%D8%A7%D9%86%D9%87',
    destination: '/ramsar/buy-apartment',
    permanent: true,
  },
  {
    source: '/noshahr/%D8%B2%D9%85%DB%8C%D9%86',
    destination: '/noshahr/buy-residential-land',
    permanent: true,
  },
  {
    source: '/amol/%D8%AE%D8%B1%DB%8C%D8%AF%20%D8%B2%D9%85%DB%8C%D9%86%20%D9%85%D8%B3%DA%A9%D9%88%D9%86%DB%8C',
    destination: '/amol/buy-residential-land',
    permanent: true,
  },
  {
    source: '/tehran/%D8%A7%D8%AC%D8%A7%D8%B1%D9%87%20%D8%AF%D9%81%D8%AA%D8%B1%20%DA%A9%D8%A7%D8%B1%20%D9%88%20%D8%A7%D8%AF%D8%A7%D8%B1%DB%8C',
    destination: '/tehran/rent-office',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D9%81%D8%B1%D9%88%D8%B4%20%D8%B2%D9%85%DB%8C%D9%86%20%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
    destination: '/robat-karim/buy-industrial-land',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D9%81%D8%B1%D9%88%D8%B4%20%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
    destination: '/robat-karim/buy-commercial-property',
    permanent: true,
  },
  {
    source: '/%D8%B4%D9%87%D8%B1%20%D8%AC%D8%AF%DB%8C%D8%AF%20%D9%BE%D8%B1%D9%86%D8%AF/%D9%81%D8%B1%D9%88%D8%B4%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
    destination: '/parand/buy-villa',
    permanent: true,
  },
  {
    source: '/%D9%85%D9%84%D8%A7%D8%B1%D8%AF/%D9%81%D8%B1%D9%88%D8%B4%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
    destination: '/malard/buy-apartment',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D9%81%D8%B1%D9%88%D8%B4%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
    destination: '/robat-karim/buy-villa',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D9%81%D8%B1%D9%88%D8%B4%20%D8%A8%D8%A7%D8%BA%20%D9%88%20%D8%A8%D8%A7%D8%BA%DA%86%D9%87',
    destination: '/robat-karim/buy-garden',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D9%81%D8%B1%D9%88%D8%B4%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
    destination: '/robat-karim/buy-apartment',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%B4%D8%AA/%D9%81%D8%B1%D9%88%D8%B4%20%D8%B2%D9%85%DB%8C%D9%86%20%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
    destination: '/rasht/buy-industrial-land',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D9%81%D8%B1%D9%88%D8%B4%20%D8%B2%D9%85%DB%8C%D9%86%20%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
    destination: '/robat-karim/buy-industrial-land',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D9%81%D8%B1%D9%88%D8%B4%20%D9%85%D8%BA%D8%A7%D8%B2%D9%87',
    destination: '/robat-karim/buy-commercial-property',
    permanent: true,
  },
  {
    source: '/%D8%B4%D9%87%D8%B1%20%D8%AC%D8%AF%DB%8C%D8%AF%20%D9%BE%D8%B1%D9%86%D8%AF/%D9%81%D8%B1%D9%88%D8%B4%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
    destination: '/parand/buy-villa',
    permanent: true,
  },
  {
    source: '/%D9%85%D9%84%D8%A7%D8%B1%D8%AF/%D9%81%D8%B1%D9%88%D8%B4%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
    destination: '/malard/buy-apartment',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D9%81%D8%B1%D9%88%D8%B4%20%D8%AE%D8%A7%D9%86%D9%87%20%D9%88%DB%8C%D9%84%D8%A7%DB%8C%DB%8C',
    destination: '/robat-karim/buy-villa',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D9%81%D8%B1%D9%88%D8%B4%20%D8%A8%D8%A7%D8%BA%20%D9%88%20%D8%A8%D8%A7%D8%BA%DA%86%D9%87',
    destination: '/robat-karim/buy-garden',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%A8%D8%A7%D8%B7%20%DA%A9%D8%B1%DB%8C%D9%85/%D9%81%D8%B1%D9%88%D8%B4%20%D8%A2%D9%BE%D8%A7%D8%B1%D8%AA%D9%85%D8%A7%D9%86',
    destination: '/robat-karim/buy-apartment',
    permanent: true,
  },
  {
    source: '/%D8%B1%D8%B4%D8%AA/%D9%81%D8%B1%D9%88%D8%B4%20%D8%B2%D9%85%DB%8C%D9%86%20%D8%B5%D9%86%D8%B9%D8%AA%DB%8C',
    destination: '/rasht/buy-industrial-land',
    permanent: true,
  },
];
// ============================================

function displayRedirects() {
  console.log('📋 MANUAL REDIRECTS CONFIGURED');
  console.log('===============================\n');

  if (manualRedirects.length === 0) {
    console.log('❌ No redirects found in the array.');
    console.log('   Add redirects to the "manualRedirects" array above.\n');
    return false;
  }

  manualRedirects.forEach((redirect, index) => {
    console.log(`🔗 Redirect #${index + 1}:`);
    
    // Try to decode Persian URLs for display
    let displaySource = redirect.source;
    try {
      displaySource = decodeURIComponent(redirect.source);
    } catch (e) {
      // Keep encoded if can't decode
    }

    console.log(`   📍 Source:      ${displaySource}`);
    
    if (displaySource !== redirect.source) {
      console.log(`      (Encoded:    ${redirect.source})`);
    }
    
    console.log(`   🎯 Destination: ${redirect.destination}`);
    console.log(`   🔄 Type:        ${redirect.permanent ? '301 Permanent' : '302 Temporary'}`);
    console.log('');
  });

  console.log(`📊 Total: ${manualRedirects.length} redirect(s) configured\n`);
  return true;
}

// ============================================
// ULTRA-SIMPLE GUARANTEED WORKING FUNCTION
// ============================================
function updateNextConfig() {
  try {
    const configPath = path.join(projectRoot, 'next.config.js');
    
    if (!fs.existsSync(configPath)) {
      console.error('❌ Error: next.config.js not found!');
      return false;
    }

    console.log('📁 Creating fresh next.config.js...');
    
    // Build the redirects array SAFELY using JSON.stringify
    let redirectsCode = '[\n';
    manualRedirects.forEach((redirect, index) => {
      const comma = index < manualRedirects.length - 1 ? ',' : '';
      redirectsCode += `    {\n`;
      redirectsCode += `      source: ${JSON.stringify(redirect.source)},\n`;
      redirectsCode += `      destination: ${JSON.stringify(redirect.destination)},\n`;
      redirectsCode += `      permanent: ${redirect.permanent},\n`;
      redirectsCode += `    }${comma}\n`;
    });
    redirectsCode += '  ]';
    
    // Create a completely fresh, valid Next.js 16+ config
    const freshConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.ajur.app',
        pathname: '/**',
      },
    ],
  },
  
  transpilePackages: ['@ant-design', 'rc-util', 'antd', 'rc-pagination', 'rc-picker'],
  
  async redirects() {
    return ${redirectsCode};
  },
};

module.exports = nextConfig;`;

    // Create backup of existing config
    if (fs.existsSync(configPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const backupPath = path.join(projectRoot, `next.config.js.backup-${timestamp}.js`);
      fs.writeFileSync(backupPath, fs.readFileSync(configPath, 'utf8'));
      console.log(`📁 Backup created: ${backupPath}`);
    }

    // Write the fresh config
    fs.writeFileSync(configPath, freshConfig);
    console.log('✅ Created fresh next.config.js!\n');
    
    // Test the config
    console.log('🔍 Testing config syntax...');
    try {
      // Quick syntax check
      const result = require('child_process').execSync('node -c next.config.js', { encoding: 'utf8' });
      console.log('✅ Syntax check passed:', result.trim());
    } catch (error) {
      console.error('❌ Syntax error in config!');
      console.error('Error:', error.message);
      
      // Try to show the error
      if (error.stderr) {
        console.error('Details:', error.stderr.toString());
      }
      
      // Restore from backup if exists
      const backups = fs.readdirSync(projectRoot)
        .filter(f => f.startsWith('next.config.js.backup-'))
        .sort()
        .reverse();
      
      if (backups.length > 0) {
        const latestBackup = path.join(projectRoot, backups[0]);
        console.log(`🔄 Restoring from ${backups[0]}...`);
        fs.writeFileSync(configPath, fs.readFileSync(latestBackup, 'utf8'));
      }
      
      return false;
    }
    
    console.log('\n🚀 All done! Your next.config.js is ready.');
    console.log('\n✅ Next steps:');
    console.log('   1. Restart dev server: npm run dev');
    console.log('   2. Test a redirect in browser');
    console.log('   3. Run build: npx next build\n');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    return false;
  }
}

// ============================================
// SIMPLE FALLBACK - JUST SHOW THE CONFIG
// ============================================
function showConfigOnly() {
  console.log('📝 Here\'s the config code you can manually copy:\n');
  
  // Build the redirects array
  let redirectsCode = '[\n';
  manualRedirects.forEach((redirect, index) => {
    const comma = index < manualRedirects.length - 1 ? ',' : '';
    redirectsCode += `    {\n`;
    redirectsCode += `      source: ${JSON.stringify(redirect.source)},\n`;
    redirectsCode += `      destination: ${JSON.stringify(redirect.destination)},\n`;
    redirectsCode += `      permanent: ${redirect.permanent},\n`;
    redirectsCode += `    }${comma}\n`;
  });
  redirectsCode += '  ]';
  
  console.log(`/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.ajur.app',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['@ant-design', 'rc-util', 'antd', 'rc-pagination', 'rc-picker'],
  async redirects() {
    return ${redirectsCode};
  },
};

module.exports = nextConfig;`);
  
  console.log('\n📋 Copy this entire code into your next.config.js file.');
  return true;
}

function askForConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question + ' (y/N): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function main() {
  console.log('='.repeat(60));
  console.log('🛠️  MANUAL REDIRECTS UPDATER');
  console.log('='.repeat(60) + '\n');

  const hasRedirects = displayRedirects();
  
  if (!hasRedirects) {
    console.log('💡 Tip: Add redirects to the "manualRedirects" array at the top of this file.');
    process.exit(1);
  }

  console.log('⚠️  This will modify your next.config.js file.');
  console.log('   A backup will be created automatically.\n');
  
  console.log('Choose update method:');
  console.log('1. Auto-update (creates fresh config)');
  console.log('2. Show config code only (manual copy)');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const answer = await new Promise(resolve => {
    rl.question('\nSelect option (1/2): ', resolve);
  });
  rl.close();
  
  const shouldContinue = answer === '1' ? await askForConfirmation('Create fresh next.config.js?') : true;
  
  if (!shouldContinue && answer === '1') {
    console.log('\n❌ Operation cancelled.');
    process.exit(0);
  }

  console.log('');
  let success = false;
  
  if (answer === '1') {
    success = updateNextConfig();
  } else if (answer === '2') {
    success = showConfigOnly();
  } else {
    console.log('❌ Invalid option, using auto-update');
    success = updateNextConfig();
  }
  
  if (success) {
    console.log('\n🎉 Done!');
  } else {
    console.log('\n💡 You can manually update:');
    console.log('   1. Open next.config.js');
    console.log('   2. Replace everything with the code above');
    console.log('   3. Save and restart server');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

// Export for use in other files
module.exports = {
  manualRedirects,
};