import { Body, Controller, Get, Module, Post } from '@nestjs/common'

@Controller('commissions')
class CommissionsController {
  @Get()
  listCommissions() {
    return { message: 'Leadership commission queue placeholder.' }
  }

  @Post()
  createCommission(@Body() body: Record<string, unknown>) {
    return { message: 'Commission accepted by demo API.', data: body }
  }
}

@Module({ controllers: [CommissionsController] })
export class CommissionsModule {}
