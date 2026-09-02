import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getProfile() {
    return this.prisma.profile.findFirst({
      include: {
        skills: true,
        experiences: true,
        projects: true,
      },
    });
  }
}
