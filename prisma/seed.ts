import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.profile.findFirst();
  if (existing) {
    console.log('Profile already exists, skipping seed.');
    return;
  }

  const profile = await prisma.profile.create({
    data: {
      name: 'Тестовый тест',
      email: 'test@email.com',
      telegram: '@test',
      phone: '+7 999 999-99-99',
      description: 'Тестовый тестировщик.',
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/in/test',
    },
  });

  await prisma.skill.createMany({
    data: [
      { name: 'JavaScript', profileId: profile.id },
      { name: 'TypeScript', profileId: profile.id },
      { name: 'NestJS', profileId: profile.id },
      { name: 'Prisma', profileId: profile.id },
      { name: 'GraphQL', profileId: profile.id },
      { name: 'Docker', profileId: profile.id },
    ],
  });

  await prisma.experience.createMany({
    data: [
      {
        company: 'Компания А',
        position: 'Разработчик',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2022-12-31'),
        description: 'Разработка веб-приложений, работа в команде.',
        profileId: profile.id,
      },
      {
        company: 'Компания Б',
        position: 'Старший разработчик',
        startDate: new Date('2023-01-01'),
        endDate: null,
        description: 'Руководство командой, архитектура микросервисов.',
        profileId: profile.id,
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        name: 'Проект 1',
        url: 'https://github.com/test/project1',
        description: 'Описание проекта 1',
        profileId: profile.id,
      },
      {
        name: 'Проект 2',
        url: 'https://github.com/test/project2',
        description: 'Описание проекта 2',
        profileId: profile.id,
      },
    ],
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
