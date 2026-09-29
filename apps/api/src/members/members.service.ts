import { Injectable } from '@nestjs/common'

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
}