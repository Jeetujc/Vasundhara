// Auth controller placeholder
import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  login() {
    // TODO: implement
    return { message: 'IMPLEMENTATION PENDING' };
  }

  @Post('refresh')
  refresh() {
    // TODO: implement
    return { message: 'IMPLEMENTATION PENDING' };
  }
}
