import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StudentsService } from './students.service';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { CustomCourseInput } from 'src/courses/dto/custom-course.input';

@Resolver(() => User)
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) {}

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async subscribeUserCourse(
    @CurrentUser() user: User,
    @Args('customCourseInput') customCourseInput: CustomCourseInput,
  ) {
    return await this.studentsService.subscribeCourse(
      user._id,
      customCourseInput._id,
    );
  }
}
