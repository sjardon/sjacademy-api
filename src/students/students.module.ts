import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsResolver } from './students.resolver';
import { CoursesModule } from 'src/courses/courses.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [CoursesModule, UsersModule],
  providers: [StudentsResolver, StudentsService],
})
export class StudentsModule {}
