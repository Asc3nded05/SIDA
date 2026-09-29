import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { HealthController } from './health.controller'
import { MembersModule } from './members/members.module'
import { WorksModule } from './works/works.module'
import { CommissionsModule } from './commissions/commissions.module'
import { ModerationModule } from './moderation/moderation.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    MembersModule,
    WorksModule,
    CommissionsModule,
    ModerationModule,
    PrismaModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}