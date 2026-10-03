import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCommissionDto } from './dto/create-commission.dto'
import { CommissionStatus } from '@prisma/client'

const ALLOWED_TRANSITIONS: Record<CommissionStatus, CommissionStatus[]> = {
  SUBMITTED: ['REVIEWING', 'DECLINED'],
  REVIEWING: ['MATCHED', 'DECLINED'],
  MATCHED: ['IN_PROGRESS', 'DECLINED'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
  DECLINED: [],
}

@Injectable()
export class CommissionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCommissionDto) {
    return this.prisma.commissionRequest.create({
      data: {
        title: dto.title,
        description: dto.description,
        requirements: dto.requirements,
        contactName: dto.contactName,
        contactEmail: dto.email,
        category: dto.category,
        timeline: dto.timeline,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        status: 'SUBMITTED',
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    })
  }

  async getQueue() {
    return this.prisma.commissionRequest.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        requirements: true,
        contactName: true,
        contactEmail: true,
        category: true,
        timeline: true,
        dueDate: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async updateStatus(id: string, status: CommissionStatus) {
    const request = await this.prisma.commissionRequest.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    })

    if (!request) {
      throw new NotFoundException('Commission request not found.')
    }

    if (!ALLOWED_TRANSITIONS[request.status as CommissionStatus].includes(status)) {
      throw new BadRequestException(
        `A request cannot move from ${request.status} to ${status}.`,
      )
    }

    const result = await this.prisma.commissionRequest.updateMany({
      where: {
        id,
        status: request.status,
      },
      data: { status },
    })

    if (result.count === 0) {
      throw new ConflictException(
        'This request was updated by someone else. Refresh and try again.',
      )
    }

    return this.prisma.commissionRequest.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    })
  }
}