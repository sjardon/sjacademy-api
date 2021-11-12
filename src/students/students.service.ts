import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from 'src/courses/entities/course.entity';
import { User, UserDocument } from 'src/users/entities/user.entity';
import * as mongoose from 'mongoose';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async subscribeCourse(userId: string, courseId: string) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException();
      }

      const course = await this.courseModel.findById(courseId);

      if (!course) {
        throw new NotFoundException();
      }

      if (this.isCourseTeacher(user, course)) {
        throw new BadRequestException("Course teacher can't by a student");
      }

      if (this.isCourseSubscriber(user, course)) {
        throw new BadRequestException('User is already subscribed to course');
      }

      user.courses.push(course);

      user.save();

      await session.commitTransaction();

      return user;
    } catch (thrownError) {
      await session.abortTransaction();

      if (
        thrownError instanceof NotFoundException ||
        thrownError instanceof BadRequestException
      ) {
        throw thrownError;
      } else {
        throw new InternalServerErrorException();
      }
    } finally {
      session.endSession();
    }
  }

  private isCourseTeacher(user, course): boolean {
    let userIsTeacher;

    if (user.isTeacher) {
      userIsTeacher = course.teachers.find((teacher) =>
        user._id.equals(teacher._id),
      );
    }

    return userIsTeacher ? true : false;
  }

  private isCourseSubscriber(user, course): boolean {
    const isSubscriber = user.courses.find((userCourse) =>
      course._id.equals(userCourse._id),
    );

    return isSubscriber ? true : false;
  }
}
