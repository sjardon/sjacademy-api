import { Module } from '@nestjs/common';
import { CoursesModule } from 'src/courses/courses.module';
import { CoursesListener } from 'src/courses/listeners/courses.listener';
import { StudentsModule } from 'src/students/students.module';
import { UsersListener } from 'src/users/listeners/users.listener';

@Module({
  imports: [CoursesModule, StudentsModule],
  providers: [CoursesListener, UsersListener],
})
export class EventsModule {}
