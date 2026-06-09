const fs = require('fs');

function fixPublicCert(path) {
  if (!fs.existsSync(path)) return;
  let code = fs.readFileSync(path, 'utf8');
  
  let modified = false;
  
  if (code.includes('{cert.title}')) {
    code = code.replace(/\{cert\.title\}/g, "{typeof cert === 'string' ? cert : (cert.title || cert.name)}");
    modified = true;
  }
  if (code.includes('{cert.name}')) {
    code = code.replace(/\{cert\.name\}/g, "{typeof cert === 'string' ? cert : (cert.name || cert.title)}");
    modified = true;
  }
  if (code.includes('{cert.issuer}')) {
    code = code.replace(/\{cert\.issuer\}/g, "{typeof cert === 'string' ? '' : cert.issuer}");
    modified = true;
  }
  if (code.includes('{cert.issueDate}')) {
    code = code.replace(/\{cert\.issueDate\}/g, "{typeof cert === 'string' ? '' : cert.issueDate}");
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(path, code);
    console.log('Fixed certifications in', path);
  }
}

fixPublicCert('c:/Projects/Portfolio builder/src/app/u/[username]/public-client.tsx');
fixPublicCert('c:/Projects/Portfolio builder/src/components/premium/ExecutiveTemplate.tsx');
fixPublicCert('c:/Projects/Portfolio builder/src/components/premium/InteractiveTemplate.tsx');
fixPublicCert('c:/Projects/Portfolio builder/src/components/premium/ProductBuilderTemplate.tsx');
fixPublicCert('c:/Projects/Portfolio builder/src/app/(dashboard)/dashboard/resume-renderers.tsx');
