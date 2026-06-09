const fs = require('fs');
const path = require('path');

function fixPublicClient() {
  const file = path.join(__dirname, 'src/app/u/[username]/public-client.tsx');
  let content = fs.readFileSync(file, 'utf-8');

  // Regex replacements for parsedData
  content = content.replace(/parsedData\.github/g, 'parsedData.personalInfo.github');
  content = content.replace(/parsedData\.linkedin/g, 'parsedData.personalInfo.linkedin');
  content = content.replace(/parsedData\.email/g, 'parsedData.personalInfo.email');
  content = content.replace(/parsedData\.fullName/g, 'parsedData.personalInfo.fullName');
  content = content.replace(/parsedData\.location/g, 'parsedData.personalInfo.location');
  content = content.replace(/parsedData\.summary/g, 'parsedData.personalInfo.summary');
  
  // Projects
  content = content.replace(/proj\.techStack/g, 'proj.technologies');
  content = content.replace(/proj\.keyImpact/g, 'proj.impact');
  
  // Experience
  content = content.replace(/exp\.highlights/g, 'exp.achievements');

  // Certifications - in public-client.tsx it's mapped over `cert`
  content = content.replace(/\{cert\}/g, '{cert.title || cert.issuer}');

  fs.writeFileSync(file, content, 'utf-8');
  console.log('Fixed public-client.tsx');
}

function fixDashboardClient() {
  const file = path.join(__dirname, 'src/app/(dashboard)/dashboard/dashboard-client.tsx');
  let content = fs.readFileSync(file, 'utf-8');
  
  // Certifications array was joined incorrectly
  content = content.replace(/parsedData\.certifications\.join\(\', \'\)/g, "parsedData.certifications.map(c => c.title || c.issuer).filter(Boolean).join(', ')");
  
  fs.writeFileSync(file, content, 'utf-8');
  console.log('Fixed dashboard-client.tsx');
}

fixPublicClient();
fixDashboardClient();
