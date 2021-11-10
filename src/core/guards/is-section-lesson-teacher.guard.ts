import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IsCourseTeacherGuard } from './is-course-teacher.guard';

@Injectable()
export class IsSectionLessonTeacherGuard extends IsCourseTeacherGuard {
  async validateCourseTeacher(loggedUser, lessonInput) {
    try {
      const course = await this.coursesService.findBySection(
        lessonInput.sectionId,
      );

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
