import { Controller, Get, Module } from '@nestjs/common'

@Controller('members')
class MembersController {
  @Get()
  listMembers() {
    return { message: 'Member API placeholder — connect Prisma next.' }
  }
}

@Module({ controllers: [MembersController] })
export class MembersModule {}
