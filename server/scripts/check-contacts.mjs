import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const unreplied = await prisma.contactMessage.findMany({
    where: { repliedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  if (unreplied.length === 0) {
    console.log('NO_UNREPLIED');
  } else {
    console.log(JSON.stringify(unreplied.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      message: m.message.substring(0, 200),
      createdAt: m.createdAt.toISOString(),
    })), null, 2));
  }
} catch (err) {
  console.error('DB_ERROR:', err.message);
} finally {
  await prisma.$disconnect();
}
