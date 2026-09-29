import {
    Body,
    Controller,
    Get,
    Post,
    Patch,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { CurrentMember } from './current-member.decorator'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getCurrentMember(
    @CurrentMember()
    member: {
        memberId: string
        email: string
        role: 'MEMBER' | 'LEADERSHIP'
    },
    ) {
        return this.authService.getCurrentMember(member.memberId)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('me')
    updateCurrentMember(
    @CurrentMember()
    member: {
        memberId: string
        email: string
        role: 'MEMBER' | 'LEADERSHIP'
    },
    @Body() updateProfileDto: UpdateProfileDto,
    ) {
    return this.authService.updateProfile(member.memberId, updateProfileDto)
    }
}