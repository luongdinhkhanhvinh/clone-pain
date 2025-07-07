#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fix TypeScript errors in route files
const routesDir = path.join(__dirname, 'routes');
const files = fs.readdirSync(routesDir).filter(file => file.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix return type issues
  content = content.replace(
    /router\.(get|post|put|delete)\('([^']+)',\s*async\s*\(([^)]+)\)\s*=>\s*{/g,
    'router.$1(\'$2\', async ($3): Promise<void> => {'
  );
  
  // Fix return statements
  content = content.replace(
    /return res\.status\((\d+)\)\.json\(([^)]+)\);/g,
    'res.status($1).json($2);\n      return;'
  );
  
  // Fix error handling
  content = content.replace(
    /} catch \(error\) {\s*console\.error\([^)]+\);\s*res\.status\((\d+)\)\.json\(([^)]+)\);\s*}/g,
    '} catch (error: any) {\n    console.error(error);\n    res.status($1).json($2);\n    return;\n  }'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${file}`);
});

console.log('TypeScript fixes applied to all route files');
