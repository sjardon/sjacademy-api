import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { Course, CourseDocument } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async create(createCourseInput: CreateCourseInput) {
    return await this.courseModel.create(createCourseInput);
  }

  async findAll() {
    return await this.courseModel.find();
  }

  async findOne(_id: string) {
    return await this.courseModel.findOne({ _id });
  }

  async update(_id: string, updateCourseInput: UpdateCourseInput) {
    return await this.courseModel
      .findByIdAndUpdate(_id, updateCourseInput as UpdateQuery<CourseDocument>)
      .exec();
  }

  async remove(_id: string) {
    return await this.courseModel.findOneAndDelete({ _id });
  }
}
