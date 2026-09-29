import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async getQueue() {
    return this.prisma.work.findMany({
      where: {
        status: 'PENDING',
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        mediaUrl: true,
        thumbnailUrl: true,
        createdAt: true,
        member: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
  }

  async reviewWork(workId: string, decision: 'APPROVED' | 'DENIED') {
    const result = await this.prisma.work.updateMany({
      where: {
        id: workId,
        status: 'PENDING',
      },
      data: {
        status: decision,
        reviewedAt: new Date(),
      },
    })

    if (result.count === 0) {
      const work = await this.prisma.work.findUnique({
        where: { id: workId },
        select: { id: true },
      })

      if (!work) {
        throw new NotFoundException('Work submission not found.')
      }

      throw new BadRequestException(
        'This submission has already been reviewed.',
      )
    }

    return this.prisma.work.findUnique({
      where: { id: workId },
      select: {
        id: true,
        title: true,
        status: true,
        reviewedAt: true,
      },
    })
  }
}