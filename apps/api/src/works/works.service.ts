import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateWorkDto } from './dto/create-work.dto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class WorksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllApproved() {
    const works = await this.prisma.work.findMany({
      where: {
        status: 'APPROVED',
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        mediaUrl: true,
        thumbnailUrl: true,
        memberId: true,
        member: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return works.map((work) => ({
      id: work.id,
      title: work.title,
      description: work.description ?? '',
      category: work.category,
      image: work.thumbnailUrl || work.mediaUrl,
      memberId: work.memberId,
      memberName: work.member.name,
    }))
  }

  async findApprovedForMember(memberId: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true },
    })

    if (!member) {
      throw new NotFoundException('Member not found')
    }

    const works = await this.prisma.work.findMany({
      where: {
        memberId,
        status: 'APPROVED',
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        mediaUrl: true,
        thumbnailUrl: true,
        member: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Adapt the database fields to the shape currently used by WorkCard.
    return works.map((work) => ({
      id: work.id,
      title: work.title,
      description: work.description ?? '',
      category: work.category,
      image: work.thumbnailUrl || work.mediaUrl,
      memberId,
      memberName: work.member.name,
    }))
  }

  async findMine(memberId: string) {
    return this.prisma.work.findMany({
      where: { memberId },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        mediaUrl: true,
        thumbnailUrl: true,
        status: true,
        reviewedAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async createForMember(
    memberId: string,
    createWorkDto: CreateWorkDto,
  ) {
    return this.prisma.work.create({
      data: {
        memberId,
        title: createWorkDto.title,
        description: createWorkDto.description,
        category: createWorkDto.category,
        mediaUrl: createWorkDto.mediaUrl,
        thumbnailUrl: createWorkDto.thumbnailUrl,
        status: 'PENDING',
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        mediaUrl: true,
        thumbnailUrl: true,
        status: true,
        createdAt: true,
      },
    })
  }
}