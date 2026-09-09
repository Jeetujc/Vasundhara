import {
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { PrismaPg } from '@prisma/adapter-pg';
  
  import { PrismaClient } from '../generated/prisma/client.js';
  
  @Injectable()
  export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
  {
    constructor(config: ConfigService) {
      const connectionString =
        config.getOrThrow<string>('DATABASE_URL');
  
      const adapter = new PrismaPg({
        connectionString,
      });
  
      super({ adapter });
    }
  
    async onModuleInit(): Promise<void> {
      await this.$connect();
    }
  
    async onModuleDestroy(): Promise<void> {
      await this.$disconnect();
    }
  }