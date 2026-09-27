import { Controller, Get, Module, Patch } from '@nestjs/common'

@Controller('moderation')
class ModerationController {
  @Get('queue')
  getQueue() {
    return { message: 'Moderation queue placeholder.' }
  }

  @Patch(':workId/approve')
  approve() {
    return { message: 'Approval endpoint placeholder.' }
  }
}

@Module({ controllers: [ModerationController] })
export class ModerationModule {}
