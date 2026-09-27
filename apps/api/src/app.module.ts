import { Module } from '@nestjs/common'
import { HealthController } from './health.controller'
import { MembersModule } from './members/members.module'
import { WorksModule } from './works/works.module'
import { CommissionsModule } from './commissions/commissions.module'
import { ModerationModule } from './moderation/moderation.module'

@Module({
  imports: [MembersModule, WorksModule, CommissionsModule, ModerationModule],
  controllers: [HealthController],
})
export class AppModule {}
