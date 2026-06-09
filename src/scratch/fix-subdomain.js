const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db', 'db-storage.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Change the subdomain of the old demo user (rb02ajd5e)
data.portfolios = data.portfolios.map(p => {
  if (p.userId === 'rb02ajd5e') {
    return { ...p, subdomain: 'alexmercer-demo' };
  }
  return p;
});

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
console.log('Fixed subdomains in db-storage.json');
