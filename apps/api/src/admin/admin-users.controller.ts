import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
  } from '@nestjs/common';
  
  import { AdminUsersService } from './admin-users.service.js';
  import { CreateAdminUserDto } from './dto/create-admin-user.dto.js';
  
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
  import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
  
  import { Role } from '../generated/prisma/client.js';
  
  @Controller('admin/users')
  @UseGuards(JwtAuthGuard)
  export class AdminUsersController {
    constructor(
      private readonly adminUsersService: AdminUsersService,
    ) {}
  
    @Post()
    async create(
      @CurrentUser() user: any,
      @Body() dto: CreateAdminUserDto,
    ) {
      // Only ADMIN can create authority accounts
      if (user.role !== Role.ADMIN) {
        throw new Error('Only ADMIN can create users');
      }
  
      return this.adminUsersService.create(dto);
    }
  
    @Get()
    async findAll(@CurrentUser() user: any) {
      if (user.role !== Role.ADMIN) {
        throw new Error('Only ADMIN can view users');
      }
  
      return this.adminUsersService.findAll();
    }
  }