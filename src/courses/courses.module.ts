import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { Course, CourseSchema } from './entities/course.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { SectionsResolver } from './sections/sections.resolver';
import { SectionsService } from './sections/sections.service';
import { Section, SectionSchema } from './sections/entities/section.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: Section.name, schema: SectionSchema }]),
    UsersModule,
  ],
  providers: [
    CoursesResolver,
    CoursesService,
    SectionsResolver,
    SectionsService,
  ],
  exports: [MongooseModule],
})
export class CoursesModule {}
