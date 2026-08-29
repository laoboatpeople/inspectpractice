const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  
  // Find admin user
  const admin = await prisma.user.findUnique({ where: { email: 'admin@inspectpractice.ca' } });
  if (!admin) {
    console.log('Admin user not found, creating...');
    const hash = await bcrypt.hash('Admin1234!', 12);
    const user = await prisma.user.create({
      data: { email: 'admin@inspectpractice.ca', passwordHash: hash, name: 'SkyAdmin', role: 'ADMIN' }
    });
    console.log('Created:', user.email, user.role);
  } else {
    console.log('Found:', admin.email, admin.role);
    // Reset password
    const hash = await bcrypt.hash('Admin1234!', 12);
    await prisma.user.update({
      where: { email: 'admin@inspectpractice.ca' },
      data: { passwordHash: hash }
    });
    console.log('Password reset to: Admin1234!');
  }
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
