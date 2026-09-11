// generate-all-redirects.js
// Run with: node generate-all-redirects.js
// This script combines API-based and manual redirects into next.config.js

const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');

const projectRoot = process.cwd();

// ============================================
// MANUAL REDIRECTS (ADD YOUR CUSTOM ONES HERE)
// ============================================
const manualRedirects = [
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
];

// ============================================
// API FETCHING FUNCTION
// ============================================
function fetchData() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Fetching data from API...');
    https.get('https://api.ajur.app/api/active-category-cities', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// ============================================
// GENERATE API-BASED REDIRECTS
// ============================================
function generateApiRedirects(data) {
  const redirects = [];
  
  if (!data || !data.items) {
    console.log('⚠️ No API data found');
    return redirects;
  }
  
  data.items.forEach(item => {
    const cleanCat = item.cat.replace(/\n/g, '').trim();
    const cleanCity = item.city.trim();
    
    const englishPath = `/${item.slug}/${item.eng_cat}`;
    
    // VERSION 1: GOOGLE'S FORMAT - with spaces encoded as %20
    const googleFormatPath = `/${encodeURIComponent(cleanCity)}/${encodeURIComponent(cleanCat)}`;
    redirects.push({
      source: googleFormatPath,
      destination: englishPath,
      permanent: true,
    });
    
    // VERSION 2: Lowercase version of Google's format
    redirects.push({
      source: googleFormatPath.toLowerCase(),
      destination: englishPath,
      permanent: true,
    });
    
    // VERSION 3: HYPHEN FORMAT
    const hyphenPath = `/${encodeURIComponent(cleanCity.replace(/\s+/g, '-'))}/${encodeURIComponent(cleanCat.replace(/\s+/g, '-'))}`;
    redirects.push({
      source: hyphenPath,
      destination: englishPath,
      permanent: true,
    });
    
    // VERSION 4: Lowercase hyphen format
    redirects.push({
      source: hyphenPath.toLowerCase(),
      destination: englishPath,
      permanent: true,
    });
    
    // VERSION 5: DECODED Persian with spaces
    redirects.push({
      source: `/${cleanCity}/${cleanCat}`,
      destination: englishPath,
      permanent: true,
    });
    
    // VERSION 6: DECODED Persian with hyphens
    redirects.push({
      source: `/${cleanCity.replace(/\s+/g, '-')}/${cleanCat.replace(/\s+/g, '-')}`,
      destination: englishPath,
      permanent: true,
    });
    
    // Handle shortened city names
    if (cleanCity.includes('شهر جدید')) {
      const shortCity = cleanCity.replace('شهر جدید', '').trim();
      if (shortCity) {
        const shortGooglePath = `/${encodeURIComponent(shortCity)}/${encodeURIComponent(cleanCat)}`;
        redirects.push({
          source: shortGooglePath,
          destination: englishPath,
          permanent: true,
        });
        
        const shortHyphenPath = `/${encodeURIComponent(shortCity.replace(/\s+/g, '-'))}/${encodeURIComponent(cleanCat.replace(/\s+/g, '-'))}`;
        redirects.push({
          source: shortHyphenPath,
          destination: englishPath,
          permanent: true,
        });
      }
    }
  });
  
  return redirects;
}

// ============================================
// DEDUPLICATE REDIRECTS
// ============================================
function deduplicateRedirects(redirects) {
  const unique = [];
  const seen = new Set();
  
  redirects.forEach(redirect => {
    const key = `${redirect.source}|${redirect.destination}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(redirect);
    }
  });
  
  return unique;
}

// ============================================
// CREATE FRESH NEXT CONFIG
// ============================================
function createFreshNextConfig(allRedirects, includeManualOnly = false) {
  // Build the redirects array SAFELY using JSON.stringify
  let redirectsCode = '[\n';
  allRedirects.forEach((redirect, index) => {
    const comma = index < allRedirects.length - 1 ? ',' : '';
    redirectsCode += `    {\n`;
    redirectsCode += `      source: ${JSON.stringify(redirect.source)},\n`;
    redirectsCode += `      destination: ${JSON.stringify(redirect.destination)},\n`;
    redirectsCode += `      permanent: ${redirect.permanent},\n`;
    redirectsCode += `    }${comma}\n`;
  });
  redirectsCode += '  ]';
  
  // Base Next.js 16+ config
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.ajur.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.api.ajur.app',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  
  trailingSlash: false,
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  async redirects() {
    return ${redirectsCode};
  },
};

module.exports = nextConfig;`;
}

// ============================================
// SAVE JSON BACKUP
// ============================================
function saveJsonBackup(redirects, source) {
  const jsonOutputPath = path.join(projectRoot, `redirects-${source}-${Date.now()}.json`);
  fs.writeFileSync(jsonOutputPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalRedirects: redirects.length,
    source: source,
    redirects: redirects,
  }, null, 2));
  
  console.log(`📁 Saved JSON backup to: ${jsonOutputPath}`);
  return jsonOutputPath;
}

// ============================================
// UPDATE NEXT CONFIG
// ============================================
function updateNextConfig(configContent) {
  try {
    const configPath = path.join(projectRoot, 'next.config.js');
    
    // Create backup of existing config
    if (fs.existsSync(configPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const backupPath = path.join(projectRoot, `next.config.js.backup-${timestamp}.js`);
      fs.writeFileSync(backupPath, fs.readFileSync(configPath, 'utf8'));
      console.log(`📁 Backup created: ${backupPath}`);
    }
    
    // Write the new config
    fs.writeFileSync(configPath, configContent);
    console.log('✅ Updated next.config.js successfully!\n');
    
    // Quick syntax check
    try {
      const result = require('child_process').execSync('node -c next.config.js', { encoding: 'utf8' });
      console.log('✅ Syntax check passed');
    } catch (error) {
      console.error('❌ Syntax error in config!');
      if (error.stderr) {
        console.error('Details:', error.stderr.toString());
      }
      
      // Restore from backup if syntax check fails
      console.log('🔄 Restoring from backup...');
      const backups = fs.readdirSync(projectRoot)
        .filter(f => f.startsWith('next.config.js.backup-'))
        .sort()
        .reverse();
      
      if (backups.length > 0) {
        const latestBackup = path.join(projectRoot, backups[0]);
        fs.writeFileSync(configPath, fs.readFileSync(latestBackup, 'utf8'));
        console.log('✅ Restored from backup');
      }
      
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error updating next.config.js:', error.message);
    return false;
  }
}

// ============================================
// DISPLAY REDIRECT STATS
// ============================================
function displayStats(apiRedirects, manualRedirects, totalRedirects) {
  console.log('\n📊 REDIRECT STATISTICS');
  console.log('======================');
  console.log(`📡 API-generated redirects: ${apiRedirects.length}`);
  console.log(`✍️  Manual redirects: ${manualRedirects.length}`);
  console.log(`🎯 Total unique redirects: ${totalRedirects.length}`);
  
  // Show sample
  if (totalRedirects.length > 0) {
    console.log('\n📋 Sample redirects:');
    const sample = totalRedirects.slice(0, 3);
    sample.forEach((r, i) => {
      console.log(`   ${i+1}. ${r.source} → ${r.destination}`);
    });
  }
}

// ============================================
// ASK FOR CONFIRMATION
// ============================================
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

// ============================================
// MAIN FUNCTION
// ============================================
async function main() {
  console.log('='.repeat(60));
  console.log('🔄 GENERATE ALL REDIRECTS (API + MANUAL)');
  console.log('='.repeat(60) + '\n');

  let apiRedirects = [];
  let apiData = null;
  
  // Try to fetch API data
  try {
    apiData = await fetchData();
    if (apiData && apiData.items) {
      console.log(`✅ API returned ${apiData.items.length} items`);
      apiRedirects = generateApiRedirects(apiData);
      console.log(`📡 Generated ${apiRedirects.length} API-based redirects`);
    }
  } catch (error) {
    console.log('⚠️ Could not fetch API data:', error.message);
    console.log('   Continuing with manual redirects only...');
  }
  
  // Combine all redirects
  console.log(`✍️  Manual redirects: ${manualRedirects.length}`);
  const allRedirects = [...apiRedirects, ...manualRedirects];
  const uniqueRedirects = deduplicateRedirects(allRedirects);
  
  displayStats(apiRedirects, manualRedirects, uniqueRedirects);
  
  if (uniqueRedirects.length === 0) {
    console.log('\n❌ No redirects to add!');
    process.exit(1);
  }
  
  // Ask for confirmation
  console.log('\n⚠️  This will overwrite your next.config.js');
  const shouldContinue = await askForConfirmation('Continue?');
  
  if (!shouldContinue) {
    console.log('\n❌ Operation cancelled.');
    
    // Still save JSON backup
    const jsonPath = saveJsonBackup(uniqueRedirects, 'combined');
    console.log(`\n💡 Redirects saved to: ${jsonPath}`);
    console.log('   You can manually add them to next.config.js later.');
    process.exit(0);
  }
  
  // Create and save JSON backup
  const jsonPath = saveJsonBackup(uniqueRedirects, 'combined');
  
  // Create fresh config
  console.log('\n📝 Creating fresh next.config.js...');
  const freshConfig = createFreshNextConfig(uniqueRedirects);
  
  // Update next.config.js
  const success = updateNextConfig(freshConfig);
  
  if (success) {
    console.log('\n🎉 SUCCESS! Redirects have been added.');
    console.log('\n📋 Next steps:');
    console.log('   1. Restart your dev server: npm run dev');
    console.log('   2. Test a few redirects in your browser');
    console.log('   3. Deploy the changes');
    console.log(`\n📁 JSON backup saved to: ${jsonPath}`);
  } else {
    console.log('\n❌ Failed to update next.config.js');
    console.log(`\n💡 You can manually update using the JSON file: ${jsonPath}`);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

// Export for use in other files
module.exports = {
  manualRedirects,
  generateApiRedirects,
  createFreshNextConfig,
};