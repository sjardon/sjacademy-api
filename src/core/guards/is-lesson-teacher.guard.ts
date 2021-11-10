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
import { SectionsService } from 'src/courses/sections/sections.service';

@Injectable()
export class IsLessonTeacherGuard extends GqlAuthGuard implements CanActivate {
  constructor(
    @Inject(CoursesService) protected readonly coursesService: CoursesService,
    @Inject(SectionsService)
    protected readonly sectionsService: SectionsService,
    protected readonly reflector: Reflector,
  ) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const ctx = GqlExecutionContext.create(context);
    const loggedUser = this.getUser(ctx);
    const lessonInput = this.getLesson(ctx);
    if (!loggedUser || !lessonInput) {
      throw new UnauthorizedException();
    }

    return this.validateLessonTeacher(loggedUser, lessonInput);
  }

  getUser(context: GqlExecutionContext) {
    const { user } = context.getContext().req;
    return user;
  }

  getLesson(context: GqlExecutionContext) {
    const lessonArgName = this.reflector.get<string>(
      'lessonArgName',
      context.getHandler(),
    );
    const args = context.getArgs();
    return args[lessonArgName];
  }

  async validateLessonTeacher(loggedUser, lessonInput) {
    try {
      const section = await this.sectionsService.findByLesson(lessonInput._id);
      const course = await this.coursesService.findBySection(section._id);
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
