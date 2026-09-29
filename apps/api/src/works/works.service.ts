import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class WorksService {
  constructor(private readonly prisma: PrismaService) {}

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
}