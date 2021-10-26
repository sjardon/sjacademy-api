import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CoursesService } from 'src/courses/courses.service';
import { UpdateCourseInput } from 'src/courses/dto/update-course.input';
import { Course } from 'src/courses/entities/course.entity';

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
      return false;
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

      const isCourseTeacher = course.teachers.includes(loggedUser._id);

      return isCourseTeacher;
    } catch (thrownError) {
      return false;
    }
  }
}
