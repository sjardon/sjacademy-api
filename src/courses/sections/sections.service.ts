import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
      course.sections.push(toCreateSection);
      await course.save();
      await session.commitTransaction();
      return toCreateSection;
    } catch (thrownError) {
      await session.abortTransaction();
      throw new InternalServerErrorException();
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
    // try {
    //   const searchedCourse = await this.courseModel
    //     .findOneAndUpdate(
    //       { 'sections._id': new mongoose.Types.ObjectId(_id) },
    //       {
    //         $set: {
    //           'sections.$': updateSectionInput,
    //         },
    //       },
    //     )
    //     .exec();
    //   if (!searchedCourse) {
    //     throw new NotFoundException();
    //   }
    //   const { sections } = searchedCourse;
    //   const [searchedSection] = sections;
    //   return searchedSection;
    // } catch (thrownError) {
    //   if (thrownError instanceof NotFoundException) {
    //     throw thrownError;
    //   } else {
    //     throw new InternalServerErrorException();
    //   }
    // }
  }

  remove(id: number) {
    return `This action removes a #${id} section`;
  }
}
