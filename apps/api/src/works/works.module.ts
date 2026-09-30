import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { PrismaModule } from '../prisma/prisma.module'
import { WorksController } from './works.controller'
import { WorkSubmissionController } from './work-submission.controller'
import { WorksService } from './works.service'

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    WorksController,
    WorkSubmissionController,
  ],
  providers: [WorksService],
})
export class WorksModule {}