import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CustomCourseInput } from './dto/custom-course.input';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { User } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { IsTeacherGuard } from 'src/core/guards/is-teacher.guard';
import { IsCourseTeacherGuard } from 'src/core/guards/is-course-teacher.guard';
import { CourseArgName } from 'src/core/decorators/course-arg-name.decorator';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Mutation(() => Course)
  @UseGuards(IsTeacherGuard)
  async createCourse(
    @CurrentUser() currentUser,
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
  ) {
    createCourseInput.teachers = [];
    createCourseInput.teachers.push(currentUser);

    return await this.coursesService.create(createCourseInput);
  }

  @Query(() => [Course], { name: 'courses' })
  async findAll() {
    return await this.coursesService.findAll();
  }

  @Query(() => Course, { name: 'course' })
  async findOne(
    @Args('customCourseInput') customCourseInput: CustomCourseInput,
  ) {
    return await this.coursesService.findOne(customCourseInput._id);
  }

  @Query(() => [Course], { name: 'myTeacherCourses' })
  @UseGuards(IsTeacherGuard)
  async findMyTeacherCourses(@CurrentUser() user: User) {
    return await this.coursesService.findByTeacher(user._id);
  }

  @Mutation(() => Course)
  @CourseArgName('updateCourseInput')
  @UseGuards(IsCourseTeacherGuard)
  async updateCourse(
    @CurrentUser() user: User,
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
  ) {
    return await this.coursesService.update(
      updateCourseInput._id,
      updateCourseInput,
    );
  }

  @Mutation(() => Course)
  @CourseArgName('customCourseInput')
  @UseGuards(IsCourseTeacherGuard)
  async removeCourse(
    @Args('customCourseInput') customCourseInput: CustomCourseInput,
  ) {
    return await this.coursesService.remove(customCourseInput._id);
  }
}
