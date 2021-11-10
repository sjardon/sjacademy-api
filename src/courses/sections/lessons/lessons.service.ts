import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from 'src/courses/entities/course.entity';
import { Section, SectionDocument } from '../entities/section.entity';
import { CreateLessonInput } from './dto/create-lesson.input';
import { UpdateLessonInput } from './dto/update-lesson.input';
import { Lesson, LessonDocument } from './entities/lesson.entity';
import * as mongoose from 'mongoose';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async create(createLessonInput: CreateLessonInput) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const { sectionId } = createLessonInput;
      const toCreateLesson = new this.lessonModel(createLessonInput);

      const searchedCourse = await this.courseModel
        .findOne({ 'sections._id': new mongoose.Types.ObjectId(sectionId) })
        .exec();

      if (!searchedCourse) {
        throw new NotFoundException();
      }

      const { sections } = searchedCourse;

      const searchedSection = sections.find(
        (section) => section._id == sectionId,
      );

      searchedSection.lessons.push(toCreateLesson);

      await searchedCourse.save();
      await session.commitTransaction();

      return toCreateLesson;
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

  async findBySection(sectionId: string) {
    try {
      const searchedCourse = await this.courseModel
        .findOne(
          { 'sections._id': new mongoose.Types.ObjectId(sectionId) },
          {
            'sections.$': 1,
          },
        )
        .exec();

      if (!searchedCourse) {
        throw new NotFoundException();
      }

      const { sections } = searchedCourse;
      const [searchedSection] = sections;

      return searchedSection.lessons;
    } catch (thrownError) {
      if (thrownError instanceof NotFoundException) {
        throw thrownError;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findOne(_id: string) {
    try {
      const searchedCourse = await this.courseModel
        .findOne(
          { 'sections.lessons._id': new mongoose.Types.ObjectId(_id) },
          {
            'sections.lessons.$': 1,
          },
        )
        .exec();

      if (!searchedCourse) {
        throw new NotFoundException();
      }

      const { sections } = searchedCourse;
      const [searchedSection] = sections;

      const searchedLesson = searchedSection.lessons.find(
        (lesson) => lesson._id == _id,
      );

      return searchedLesson;
    } catch (thrownError) {
      if (thrownError instanceof NotFoundException) {
        throw thrownError;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async update(_id: string, updateLessonInput: UpdateLessonInput) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const toCreateLesson = new this.lessonModel(updateLessonInput);

      const searchedCourse = await this.courseModel
        .findOne({ 'sections.lessons._id': new mongoose.Types.ObjectId(_id) })
        .exec();

      if (!searchedCourse) {
        throw new NotFoundException();
      }

      const { sections } = searchedCourse;

      const searchedSection = sections.find((section) =>
        section.lessons.some((lesson) => lesson._id == _id),
      );

      const searchedLesson = searchedSection.lessons.find(
        (lesson) => lesson._id == _id,
      );

      searchedLesson.updatedAt = Date.now().toString();
      Object.assign(searchedLesson, updateLessonInput);

      await searchedCourse.save();
      await session.commitTransaction();

      return searchedLesson;
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
      const searchedCourse = await this.courseModel
        .findOne({ 'sections.lessons._id': new mongoose.Types.ObjectId(_id) })
        .exec();

      if (!searchedCourse) {
        throw new NotFoundException();
      }

      const { sections } = searchedCourse;

      const searchedSection = sections.find((section) =>
        section.lessons.some((lesson) => lesson._id == _id),
      );

      const searchedLessonIndex = searchedSection.lessons.findIndex(
        (lesson) => lesson._id == _id,
      );

      const deletedLesson = searchedSection.lessons[searchedLessonIndex];
      searchedSection.lessons.splice(searchedLessonIndex, 1);

      await searchedCourse.save();
      await session.commitTransaction();

      return deletedLesson;
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
