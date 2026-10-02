import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'

import { CommissionsService } from './commissions.service'
import { CreateCommissionDto } from './dto/create-commission.dto'
import { UpdateCommissionStatusDto } from './dto/update-commission-status.dto'

@Controller('commissions')
export class CommissionsController {
  constructor(
    private readonly commissionsService: CommissionsService,
  ) {}

  // Public endpoint: anyone can submit a request.
  @Post()
  createCommission(@Body() dto: CreateCommissionDto) {
    return this.commissionsService.create(dto)
  }

  // Leadership-only endpoint: view all requests.
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('LEADERSHIP')
  getQueue() {
    return this.commissionsService.getQueue()
  }

  // Leadership-only endpoint: update a request's status.
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('LEADERSHIP')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCommissionStatusDto,
  ) {
    return this.commissionsService.updateStatus(id, dto.status)
  }
}