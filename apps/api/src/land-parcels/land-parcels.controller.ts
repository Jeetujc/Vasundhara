// Parcels controller placeholder
import { Controller, Get } from '@nestjs/common';

@Controller('parcels')
export class ParcelsController {
  @Get()
  list() { return { message: 'IMPLEMENTATION PENDING' } }

  @Get(':id')
  get() { return { message: 'IMPLEMENTATION PENDING' } }
}
