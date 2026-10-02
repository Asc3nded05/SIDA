import { Controller, Get, Param } from '@nestjs/common'
import { WorksService } from './works.service'

@Controller()
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Get('works')
  findAllApproved() {
    return this.worksService.findAllApproved()
  }

  @Get('members/:memberId/works')
  findApprovedForMember(@Param('memberId') memberId: string) {
    return this.worksService.findApprovedForMember(memberId)
  }
}