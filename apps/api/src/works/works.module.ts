import { Controller, Get, Module } from '@nestjs/common'

@Controller('works')
class WorksController {
  @Get()
  listWorks() {
    return { message: 'Works API placeholder — connect Prisma next.' }
  }
}

@Module({ controllers: [WorksController] })
export class WorksModule {}
