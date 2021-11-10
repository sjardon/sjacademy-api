import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import * as mongoose from 'mongoose';
import { Course, CourseDocument } from 'src/courses/entities/course.entity';
import { CreateSectionInput } from './dto/create-section.input';
import { UpdateSectionInput } from './dto/update-section.input';
import { Section, SectionDocument } from './entities/section.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async create(createSectionInput: CreateSectionInput): Promise<Section> {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const toCreateSection = new this.sectionModel(createSectionInput);
      const course = await this.courseModel.findById(
        createSectionInput.courseId,
      );

      if (!course) {
        throw new NotFoundException();
      }

      course.sections.push(toCreateSection);

      await course.save();
      await session.commitTransaction();

      return toCreateSection;
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

  async findByCourse(courseId): Promise<Section[]> {
    try {
      const course = await this.courseModel.findById(courseId);

      if (!course) {
        throw new NotFoundException();
      }

      return course.sections;
    } catch (thrownError) {
      if (thrownError instanceof NotFoundException) {
        throw thrownError;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findByLesson(lessonId: string) {
    try {
      const searchedCourse = await this.courseModel.findOne(
        { 'sections.lessons._id': new mongoose.Types.ObjectId(lessonId) },
        {
          'sections.$': 1,
        },
      );

      if (!searchedCourse) {
        throw new NotFoundException();
      }

      const { sections } = searchedCourse;
      const [searchedSection] = sections;

      return searchedSection;
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
          { 'sections._id': new mongoose.Types.ObjectId(_id) },
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

      return searchedSection;
    } catch (thrownError) {
      if (thrownError instanceof NotFoundException) {
        throw thrownError;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async update(_id: string, updateSectionInput: UpdateSectionInput) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const searchedCourse = await this.courseModel
        .findOne({ 'sections._id': new mongoose.Types.ObjectId(_id) })
        .exec();

      if (!searchedCourse) {
        throw new NotFoundException();
      }
      const { sections } = searchedCourse;
      const searchedSection = sections.find((section) => section._id == _id);

      searchedSection.updatedAt = Date.now().toString();
      Object.assign(searchedSection, updateSectionInput);

      await searchedCourse.save();

      await session.commitTransaction();

      return searchedSection;
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
        .findOne({ 'sections._id': new mongoose.Types.ObjectId(_id) })
        .exec();
      if (!searchedCourse) {
        throw new NotFoundException();
      }

      const searchedSectionIndex = searchedCourse.sections.findIndex(
        (section) => section._id == _id,
      );
      if (searchedSectionIndex == -1) {
        throw new NotFoundException();
      }

      const deletedSection = searchedCourse.sections[searchedSectionIndex];
      searchedCourse.sections.splice(searchedSectionIndex, 1);

      await searchedCourse.save();
      await session.commitTransaction();

      return deletedSection;
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
