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
import { IsCourseTeacherGuard } from './is-course-teacher.guard';

@Injectable()
export class IsCourseSectionTeacherGuard extends IsCourseTeacherGuard {
  async validateCourseTeacher(loggedUser, courseInput) {
    try {
      const course = await this.coursesService.findOne(courseInput.courseId);

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
      return thrownError;
    }
  }
}
