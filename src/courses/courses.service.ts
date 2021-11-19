import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { Course, CourseDocument } from './entities/course.entity';
import * as mongoose from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createCourseInput: CreateCourseInput) {
    return await this.courseModel.create(createCourseInput);
  }

  async findAll() {
    return await this.courseModel.find().populate('teachers');
  }

  async findByTeacher(teacherId: string) {
    return await this.courseModel
      .find({
        teachers: teacherId,
      } as FilterQuery<CourseDocument>)
      .exec();
  }

  async findBySection(sectionId: string) {
    try {
      const searchedCourse = await this.courseModel
        .findOne({ 'sections._id': new mongoose.Types.ObjectId(sectionId) })
        .populate('teachers');

      if (!searchedCourse) {
        throw new NotFoundException();
      }

      return searchedCourse;
    } catch (thrownError) {
      if (thrownError instanceof NotFoundException) {
        throw thrownError;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findOne(_id: string) {
    return await this.courseModel.findOne({ _id }).populate('teachers');
  }

  async update(_id: string, updateCourseInput: UpdateCourseInput) {
    return await this.courseModel
      .findByIdAndUpdate(_id, updateCourseInput as UpdateQuery<CourseDocument>)
      .exec();
  }

  async removeTeacher(teacherId: string) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      let courses = await this.courseModel
        .find({
          teachers: teacherId,
        } as FilterQuery<CourseDocument>)
        .exec();

      if (courses) {
        courses = courses.map((course) => {
          const searchedTeacherIndex = course.teachers.findIndex((teacher) => {
            return teacher._id.toString() == teacherId;
          });

          if (searchedTeacherIndex == -1) {
            return course;
          }

          course.teachers.splice(searchedTeacherIndex, 1);
          course.save();
          return course;
        });
      }

      await session.commitTransaction();

      return courses;
    } catch (thrownError) {
      await session.abortTransaction();

      if (thrownError instanceof NotFoundException) {
        throw thrownError;
      } else {
        throw new InternalServerErrorException();
      }
    } finally {
      session.endSession();
    }
  }

  async remove(_id: string) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const removedCourse = await this.courseModel.findOneAndDelete({ _id });

      if (!removedCourse) {
        throw new NotFoundException();
      }

      this.eventEmitter.emit('course.removed', removedCourse);

      return removedCourse;
    } catch (thrownError) {
      await session.abortTransaction();

      if (thrownError instanceof NotFoundException) {
        throw thrownError;
      } else {
        throw new InternalServerErrorException();
      }
    } finally {
      session.endSession();
    }
  }
}
