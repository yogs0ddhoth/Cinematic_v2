import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const userData: Prisma.UserCreateInput[] = [
  {
    email: 'asdf@prisma.io',
    password: bcrypt.hashSync('asdfasdf', 12),
  },
  {
    email: 'qwer@mail.com',
    password: bcrypt.hashSync('qwerqwer', 12),
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
