import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class IsSectionTeacherGuard extends GqlAuthGuard implements CanActivate {
  constructor(
    @Inject(CoursesService) protected readonly coursesService: CoursesService,
    protected readonly reflector: Reflector,
  ) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const ctx = GqlExecutionContext.create(context);
    const loggedUser = this.getUser(ctx);
    const sectionInput = this.getSection(ctx);
    if (!loggedUser || !sectionInput) {
      throw new UnauthorizedException();
    }

    return this.validateSectionTeacher(loggedUser, sectionInput);
  }

  getUser(context: GqlExecutionContext) {
    const { user } = context.getContext().req;
    return user;
  }

  getSection(context: GqlExecutionContext) {
    const sectionArgName = this.reflector.get<string>(
      'sectionArgName',
      context.getHandler(),
    );
    const args = context.getArgs();
    return args[sectionArgName];
  }

  async validateSectionTeacher(loggedUser, sectionInput) {
    try {
      const course = await this.coursesService.findBySection(sectionInput._id);

      if (!course) {
        throw new NotFoundException();
      }

      const isCourseTeacher = course.teachers.find(
        (teacher) => teacher._id == loggedUser._id,
      );

      if (isCourseTeacher) {
        return true;
      }

      throw new UnauthorizedException();
    } catch (thrownError) {
      throw thrownError;
    }
  }
}
