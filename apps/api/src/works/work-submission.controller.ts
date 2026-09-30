import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CurrentMember } from '../auth/current-member.decorator'
import { CreateWorkDto } from './dto/create-work.dto'
import { WorksService } from './works.service'

type AuthenticatedMember = {
  memberId: string
  email: string
  role: 'MEMBER' | 'LEADERSHIP'
}

@Controller('works')
@UseGuards(AuthGuard('jwt'))
export class WorkSubmissionController {
  constructor(private readonly worksService: WorksService) {}

  @Get('mine')
  findMine(@CurrentMember() member: AuthenticatedMember) {
    return this.worksService.findMine(member.memberId)
  }

  @Post()
  create(
    @CurrentMember() member: AuthenticatedMember,
    @Body() createWorkDto: CreateWorkDto,
  ) {
    return this.worksService.createForMember(
      member.memberId,
      createWorkDto,
    )
  }
}