const http = require('http');
const jwt = require('jsonwebtoken');
const { env } = require('./dist/src/config/env');

function login() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({email:"admin@inspectpractice.ca",password:"inspectpractice"});
    const req = http.request({
      hostname:'127.0.0.1', port:4000, path:'/api/auth/login',
      method:'POST',
      headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}
    }, res => {
      let body='';
      res.on('data',c=>body+=c);
      res.on('end',() => {
        try { resolve(JSON.parse(body)); }
        catch(e) { reject(e); }
      });
    });
    req.on('error',reject);
    req.write(data);
    req.end();
  });
}

function getMessages(token) {
  return new Promise((resolve, reject) => {
    const req = http.get({
      hostname:'127.0.0.1', port:4000,
      path:'/api/admin/contact-messages',
      headers:{'Authorization':'Bearer ' + token}
    }, res => {
      let body='';
      res.on('data',c=>body+=c);
      res.on('end',() => {
        try { resolve(JSON.parse(body)); }
        catch(e) { reject(e); }
      });
    });
    req.on('error',reject);
    req.end();
  });
}

async function main() {
  const loginData = await login();
  const localToken = jwt.sign(
    {id:loginData.user.id, email:loginData.user.email, role:loginData.user.role},
    env.JWT_SECRET,
    {expiresIn:'7d'}
  );

  const data = await getMessages(localToken);
  const msgs = data.messages || [];
  console.log('Total:', msgs.length);

  const adminEmails = ['info@inspectpractice.com', 'admin@inspectpractice.ca'];
  const unreplied = msgs.filter(m =>
    !m.repliedAt &&
    !adminEmails.includes((m.email||'').toLowerCase().trim())
  );

  console.log('Unreplied inbound:', unreplied.length);

  if (unreplied.length === 0) {
    console.log('NO_NEW_MESSAGES');
    return;
  }

  for (const m of unreplied.slice(0,5)) {
    console.log(`  [${(m.id||'').slice(0,12)}] ${m.name} <${m.email}>: ${(m.message||'').slice(0,300)}`);
  }
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
