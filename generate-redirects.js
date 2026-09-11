// generate-redirects.js - FIXED with proper next.config.js replacement
const fs = require('fs');
const path = require('path');
const https = require('https');

const projectRoot = process.cwd();

function fetchData() {
  return new Promise((resolve, reject) => {
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

async function main() {
  try {
    console.log('🔄 Fetching data from API...');
    const data = await fetchData();
    
    const redirects = [];
    
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
    
    // Remove duplicates
    const uniqueRedirects = [];
    const seen = new Set();
    
    redirects.forEach(redirect => {
      const key = `${redirect.source}|${redirect.destination}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueRedirects.push(redirect);
      }
    });
    
    console.log(`📊 Stats:`);
    console.log(`  - API items: ${data.items.length}`);
    console.log(`  - Total redirects generated: ${uniqueRedirects.length}`);
    
    // Save to JSON file
    const jsonOutputPath = path.join(projectRoot, 'redirects.json');
    fs.writeFileSync(jsonOutputPath, JSON.stringify({
      generatedAt: new Date().toISOString(),
      itemCount: data.items.length,
      redirects: uniqueRedirects,
      note: 'Auto-generated redirects including Google Persian URLs with %20 spaces and hyphen variants'
    }, null, 2));
    
    console.log(`✅ Generated ${uniqueRedirects.length} redirects`);
    console.log(`📁 Saved JSON to: ${jsonOutputPath}`);
    
    // Update next.config.js
    updateNextConfig(uniqueRedirects);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function updateNextConfig(redirects) {
  try {
    const configPath = path.join(projectRoot, 'next.config.js');
    
    if (!fs.existsSync(configPath)) {
      console.error('❌ next.config.js not found!');
      return;
    }
    
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    console.log('🛠️  Updating next.config.js...');
    
    // Create the redirects array code
    let redirectsCode = '    return [\n';
    
    redirects.forEach((redirect, index) => {
      const comma = index < redirects.length - 1 ? ',' : '';
      redirectsCode += `      {\n`;
      redirectsCode += `        source: '${redirect.source.replace(/'/g, "\\'")}',\n`;
      redirectsCode += `        destination: '${redirect.destination}',\n`;
      redirectsCode += `        permanent: true,\n`;
      redirectsCode += `      }${comma}\n`;
    });
    
    redirectsCode += '    ];';
    
    const newRedirectsFunction = `  async redirects() {\n${redirectsCode}\n  },`;
    
    // FIXED: Better pattern matching for the redirects function
    // Look for async redirects() and everything until the next top-level property
    const redirectsPattern = /(\s+)(async redirects\(\)\s*\{[\s\S]*?\n\s*\},)/;
    
    if (configContent.match(redirectsPattern)) {
      configContent = configContent.replace(redirectsPattern, `$1${newRedirectsFunction}`);
      console.log('✅ Replaced existing redirects function');
    } else {
      console.log('⚠️ Could not find redirects function pattern');
      console.log('🔍 Looking for alternative patterns...');
      
      // Try to find where to insert the redirects function
      // Look for the transpilePackages line and insert before it
      const transpileIndex = configContent.indexOf('transpilePackages:');
      if (transpileIndex !== -1) {
        // Find the start of the line
        let insertIndex = configContent.lastIndexOf('\n', transpileIndex);
        if (insertIndex === -1) insertIndex = 0;
        
        configContent = configContent.slice(0, insertIndex) + 
                       '\n' + newRedirectsFunction + '\n' + 
                       configContent.slice(insertIndex);
        console.log('✅ Inserted redirects function before transpilePackages');
      } else {
        // Last resort: insert before the final closing brace
        const lastBraceIndex = configContent.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
          configContent = configContent.slice(0, lastBraceIndex) + 
                         ',\n' + newRedirectsFunction + '\n' + 
                         configContent.slice(lastBraceIndex);
          console.log('✅ Added redirects function before final closing brace');
        } else {
          console.error('❌ Could not find where to insert redirects function');
          return;
        }
      }
    }
    
    // Write the updated config
    fs.writeFileSync(configPath, configContent);
    console.log('📁 Updated next.config.js successfully');
    
    // Create a backup
    const backupPath = configPath + '.backup-' + Date.now() + '.js';
    fs.writeFileSync(backupPath, configContent);
    console.log(`📁 Backup saved to: ${backupPath}`);
    
  } catch (error) {
    console.error('⚠️ Error updating next.config.js:', error.message);
    console.log('\n💡 You can manually update next.config.js:');
    console.log('1. Copy the redirects from redirects.json');
    console.log('2. Replace the async redirects() function in next.config.js');
  }
}

main();