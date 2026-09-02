import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigPaths } from 'src/config/configuration';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(@Inject(ConfigService) private configService: ConfigService) {
    // const connectionString = configService.get<string>(ConfigPaths.databaseUrl);
    const connectionString = configService.get<string>(ConfigPaths.databaseUrl);
    Logger.log('connectionString:', connectionString);
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }
    const adapter = new PrismaPg({
      connectionString,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
