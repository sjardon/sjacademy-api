import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class UsersListener {
  constructor(
    @Inject(CoursesService)
    protected readonly coursesService: CoursesService,
  ) {}

  @OnEvent('user.removed')
  async handleUserRemovedEvent(removedUser) {
    this.coursesService.removeTeacher(removedUser._id);
  }
}
