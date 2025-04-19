const fs = require('fs');
const { exec } = require('child_process');

// Run your Python script 'request.py'
exec('python request.py', (error, stdout, stderr) => {
  if (error || stderr) {
    console.error('❌ Error running Python script:', error || stderr);
    return;
  }

  console.log('✅ Python script executed successfully.');
  
  // Read the generated file.html
  const html = fs.readFileSync('file.html', 'utf-8');
  console.log('\n🌐 HTML fetched:\n');
  console.log(html.slice(0, 500)); // Print only the first 500 chars
});
