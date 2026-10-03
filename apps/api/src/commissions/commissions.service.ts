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
        assignments: {
          select: {
            id: true,
            assignedAt: true,
            member: {
              select: {
                id: true,
                name: true,
                email: true,
                title: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            assignedAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getAssignableMembers() {
    return this.prisma.member.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        title: true,
        profileImage: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
  }

  async assignMember(commissionId: string, memberId: string) {
    const commission = await this.prisma.commissionRequest.findUnique({
      where: { id: commissionId },
      select: { id: true },
    })

    if (!commission) {
      throw new NotFoundException('Commission request not found.')
    }

    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true },
    })

    if (!member) {
      throw new NotFoundException('Member not found.')
    }

    try {
      return await this.prisma.commissionAssignment.create({
        data: {
          commissionRequestId: commissionId,
          memberId,
        },
        select: {
          id: true,
          assignedAt: true,
          member: {
            select: {
              id: true,
              name: true,
              email: true,
              title: true,
              profileImage: true,
            },
          },
        },
      })
    } catch (error) {
      // The database unique constraint prevents duplicate assignments.
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'This member is already assigned to this commission.',
        )
      }

      throw error
    }
  }

  async removeAssignment(commissionId: string, memberId: string) {
    const result = await this.prisma.commissionAssignment.deleteMany({
      where: {
        commissionRequestId: commissionId,
        memberId,
      },
    })

    if (result.count === 0) {
      throw new NotFoundException('Assignment not found.')
    }

    return {
      message: 'Member assignment removed.',
      commissionId,
      memberId,
    }
  }

  async getAssignedToMember(memberId: string) {
    return this.prisma.commissionAssignment.findMany({
      where: {
        memberId,
      },
      select: {
        id: true,
        assignedAt: true,
        commissionRequest: {
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
        },
      },
      orderBy: {
        assignedAt: 'desc',
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