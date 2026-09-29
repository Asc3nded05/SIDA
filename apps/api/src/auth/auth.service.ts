import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const email = loginDto.email.trim().toLowerCase()

        const member = await this.prisma.member.findUnique({
            where: { email },
        })

        if (!member) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const passwordMatches = await compare(
            loginDto.password,
            member.passwordHash,
        )

        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const payload = {
            sub: member.id,
            email: member.email,
            role: member.role,
        }

        const accessToken = await this.jwtService.signAsync(payload)

        return {
        accessToken,
        member: {
            id: member.id,
            name: member.name,
            email: member.email,
            role: member.role,
            title: member.title,
            bio: member.bio,
            disciplines: member.disciplines,
            profileImage: member.profileImage,
        },
        }
    }

    async updateProfile(memberId: string, updateProfileDto: UpdateProfileDto) {
        const member = await this.prisma.member.update({
            where: { id: memberId },
            data: updateProfileDto,
            select: {
            id: true,
            name: true,
            email: true,
            role: true,
            title: true,
            bio: true,
            disciplines: true,
            profileImage: true,
            },
        })

        return member
    }
}