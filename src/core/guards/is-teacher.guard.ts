import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class IsTeacherGuard extends GqlAuthGuard implements CanActivate {
  constructor(
    @Inject(UsersService) protected readonly usersService: UsersService,
    protected readonly reflector: Reflector,
  ) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const ctx = GqlExecutionContext.create(context);
    const { user: loggedUser } = ctx.getContext().req;

    if (!loggedUser) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.usersService.findOne(loggedUser._id);
      const { isTeacher } = user;

      if (isTeacher) {
        return true;
      }

      throw new UnauthorizedException();
    } catch (thrownError) {
      throw thrownError;
    }
  }
}
