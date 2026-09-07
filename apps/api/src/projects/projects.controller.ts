// Projects controller placeholder
import { Controller, Get, Post, Patch } from '@nestjs/common';

@Controller('projects')
export class ProjectsController {
  @Get()
  list() { return { message: 'IMPLEMENTATION PENDING' } }

  @Get(':id')
  get() { return { message: 'IMPLEMENTATION PENDING' } }

  @Post()
  create() { return { message: 'IMPLEMENTATION PENDING' } }

  @Patch(':id')
  patch() { return { message: 'IMPLEMENTATION PENDING' } }
}
