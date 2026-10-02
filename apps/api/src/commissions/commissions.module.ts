import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { PrismaModule } from '../prisma/prisma.module'

import { CommissionsController } from './commissions.controller'
import { CommissionsService } from './commissions.service'

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [CommissionsController],
  providers: [CommissionsService],
})
export class CommissionsModule {}