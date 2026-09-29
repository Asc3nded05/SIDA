import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { ModerationService } from './moderation.service'

@Controller('moderation')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('LEADERSHIP')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get('queue')
  getQueue() {
    return this.moderationService.getQueue()
  }

  @Patch(':workId/approve')
  approve(@Param('workId') workId: string) {
    return this.moderationService.reviewWork(workId, 'APPROVED')
  }

  @Patch(':workId/deny')
  deny(@Param('workId') workId: string) {
    return this.moderationService.reviewWork(workId, 'DENIED')
  }
}