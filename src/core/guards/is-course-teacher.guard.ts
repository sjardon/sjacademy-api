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
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class IsCourseTeacherGuard extends GqlAuthGuard implements CanActivate {
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
    const courseInput = this.getCourse(ctx);
    if (!loggedUser || !courseInput) {
      throw new UnauthorizedException();
    }

    return this.validateCourseTeacher(loggedUser, courseInput);
  }

  getUser(context: GqlExecutionContext) {
    const { user } = context.getContext().req;
    return user;
  }

  getCourse(context: GqlExecutionContext) {
    const courseArgName = this.reflector.get<string>(
      'courseArgName',
      context.getHandler(),
    );
    const args = context.getArgs();

    return args[courseArgName];
  }

  async validateCourseTeacher(loggedUser, courseInput) {
    try {
      const course = await this.coursesService.findOne(courseInput._id);

      if (!course) {
        return false;
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
