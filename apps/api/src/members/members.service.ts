import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.member.findMany({
      select: {
        id: true,
        name: true,
        title: true,
        bio: true,
        disciplines: true,
        profileImage: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        title: true,
        bio: true,
        disciplines: true,
        profileImage: true,
        role: true,
      },
    })

    if (!member) {
      throw new NotFoundException('Member not found')
    }

    return member
  }
}