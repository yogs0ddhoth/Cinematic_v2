import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v5 as uuidv5 } from 'uuid';
import { namespace } from '../src/auth/constants';

const prisma = new PrismaClient();
const userData: Prisma.UserCreateInput[] = [
  {
    id: uuidv5('asdf@prisma.io', namespace),
    email: 'asdf@prisma.io',
    password: bcrypt.hashSync('asdfASDF1234!@#$', 12),
  },
  {
    id: uuidv5('qwer@mail.com', namespace),
    email: 'qwer@mail.com',
    password: bcrypt.hashSync('qwerQWER5678%^&*', 12),
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
