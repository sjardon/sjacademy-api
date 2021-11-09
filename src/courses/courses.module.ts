import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { Course, CourseSchema } from './entities/course.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { SectionsResolver } from './sections/sections.resolver';
import { SectionsService } from './sections/sections.service';
import { Section, SectionSchema } from './sections/entities/section.entity';
import {
  Lesson,
  LessonSchema,
} from './sections/lessons/entities/lesson.entity';
import { LessonsResolver } from './sections/lessons/lessons.resolver';
import { LessonsService } from './sections/lessons/lessons.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: Section.name, schema: SectionSchema }]),
    MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]),
    UsersModule,
  ],
  providers: [
    CoursesResolver,
    CoursesService,
    SectionsResolver,
    SectionsService,
    LessonsResolver,
    LessonsService,
  ],
  exports: [MongooseModule],
})
export class CoursesModule {}
