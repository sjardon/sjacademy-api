import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { User } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { IsTeacherGuard } from 'src/core/guards/is-teacher.guard';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Mutation(() => Course)
  @UseGuards(GqlAuthGuard)
  @UseGuards(IsTeacherGuard)
  createCourse(
    @CurrentUser() currentUser,
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
  ) {
    createCourseInput.teachers = [];
    createCourseInput.teachers.push(currentUser);

    return this.coursesService.create(createCourseInput);
  }

  @Query(() => [Course], { name: 'courses' })
  findAll() {
    return this.coursesService.findAll();
  }

  @Query(() => Course, { name: 'course' })
  findOne(@Args('_id', { type: () => String }) _id: string) {
    return this.coursesService.findOne(_id);
  }

  @Mutation(() => Course)
  @UseGuards(GqlAuthGuard)
  updateCourse(
    // @CurrentUser() user: User,
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
  ) {
    return this.coursesService.update(updateCourseInput._id, updateCourseInput);
  }

  @Mutation(() => Course)
  removeCourse(@Args('_id', { type: () => String }) _id: string) {
    return this.coursesService.remove(_id);
  }
}
