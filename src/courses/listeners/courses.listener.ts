import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class CoursesListener {
  constructor(
    @Inject(StudentsService)
    protected readonly studentsService: StudentsService,
  ) {}

  @OnEvent('course.removed')
  async handleCourseRemovedEvent(removedCourse) {
    // console.log(event);
    await this.studentsService.unsubscribeAllByCourse(removedCourse._id);
  }
}
