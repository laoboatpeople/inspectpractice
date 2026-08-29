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
      res.on('end',() => { try { resolve(JSON.parse(body)); } catch(e) { reject(e); } });
    });
    req.on('error',reject);
    req.write(data);
    req.end();
  });
}

function getMessages(token) {
  return new Promise((resolve, reject) => {
    const req = http.get({
      hostname:'127.0.0.1', port:4000, path:'/api/admin/contact-messages',
      headers:{'Authorization':'Bearer ' + token}
    }, res => {
      let body='';
      res.on('data',c=>body+=c);
      res.on('end',() => { try { resolve(JSON.parse(body)); } catch(e) { reject(e); } });
    });
    req.on('error',reject);
    req.end();
  });
}

async function main() {
  const loginData = await login();
  const localToken = jwt.sign(
    {id:loginData.user.id, email:loginData.user.email, role:loginData.user.role},
    env.JWT_SECRET, {expiresIn:'7d'}
  );

  const data = await getMessages(localToken);
  const msgs = data.messages || [];

  // The system sends from info@inspectpractice.com for outbound
  const outboundEmails = ['info@inspectpractice.com', 'admin@inspectpractice.ca'];

  // Separate outbound vs potential inbound
  const outbound = msgs.filter(m => outboundEmails.includes((m.email||'').toLowerCase().trim()));
  const inbound = msgs.filter(m => !outboundEmails.includes((m.email||'').toLowerCase().trim()));

  console.log('Total:', msgs.length);
  console.log('Outbound (sent by us):', outbound.length);
  console.log('Inbound (from public/contacts):', inbound.length);

  // Among inbound, which are unreplied?
  const unreplied = inbound.filter(m => !m.repliedAt);
  console.log('Unreplied inbound:', unreplied.length);

  // Show unreplied inbound messages
  for (const m of unreplied.slice(0,10)) {
    const msg = (m.message||'').slice(0,200);
    const created = m.createdAt ? new Date(m.createdAt).toISOString().slice(0,16) : '?';
    console.log(`\n  [${(m.id||'').slice(0,8)}] ${created} | ${m.name} <${m.email}>`);
    console.log(`  MSG: ${msg}`);
  }

  // Also show all inbound messages (even replied)
  console.log('\n=== ALL INBOUND MESSAGES ===');
  for (const m of inbound.slice(0,20)) {
    const msg = (m.message||'').slice(0,150);
    const created = m.createdAt ? new Date(m.createdAt).toISOString().slice(0,16) : '?';
    const replied = m.repliedAt ? 'REPLIED' : 'PENDING';
    console.log(`  [${(m.id||'').slice(0,8)}] ${created} ${replied} | ${m.name} <${m.email}>: ${msg}`);
  }

  // Show all messages that look like contact form submissions (short, not business outreach)
  console.log('\n=== POTENTIAL CONTACT FORM SUBMISSIONS ===');
  for (const m of inbound) {
    const msg = (m.message||'').trim();
    // Contact form messages are typically shorter and not starting with "Hi"
    if (msg.length < 500 && !msg.startsWith('Hi ') && !msg.startsWith('Bonjour ')) {
      console.log(`  [${(m.id||'').slice(0,8)}] ${m.name} <${m.email}>: ${msg.slice(0,500)}`);
    }
  }
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
