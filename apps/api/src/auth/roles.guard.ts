import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PrismaService } from '../prisma/prisma.service'
import { ROLES_KEY, type Role } from './roles.decorator'

type AuthenticatedRequest = {
  user?: {
    memberId: string
    email: string
    role: Role
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    // No role requirement means the route only needs its other guards.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>()

    const memberId = request.user?.memberId

    if (!memberId) {
      throw new ForbiddenException('Access denied.')
    }

    // Check the current database role rather than trusting the JWT role.
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { role: true },
    })

    if (!member || !requiredRoles.includes(member.role)) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      )
    }

    return true
  }
}