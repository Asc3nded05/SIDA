import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaModule } from '../prisma/prisma.module'
import { ModerationController } from './moderation.controller'
import { ModerationService } from './moderation.service'

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ModerationController],
  providers: [ModerationService],
})
export class ModerationModule {}