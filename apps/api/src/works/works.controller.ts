import { Controller, Get, Param } from '@nestjs/common'

import { WorksService } from './works.service'

@Controller('members/:memberId/works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Get()
  findApprovedForMember(@Param('memberId') memberId: string) {
    return this.worksService.findApprovedForMember(memberId)
  }
}