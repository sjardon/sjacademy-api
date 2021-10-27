import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsIn, IsNotEmpty, MaxLength } from 'class-validator';
import * as mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type CourseDocument = Course & Document;

const validCourseStatus: string[] = ['draft', 'published', 'removed'];

@Schema()
@ObjectType()
export class Course {
  @Field()
  _id: string;

  @IsNotEmpty({
    message: 'Title is empty',
  })
  @MaxLength(100, {
    message: 'Title is too long',
  })
  @Prop({ required: true })
  @Field()
  name: string;

  @IsNotEmpty({
    message: 'Description is empty',
  })
  @MaxLength(500, {
    message: 'Description is too long',
  })
  @Prop({ default: '' })
  @Field({ nullable: true })
  description: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => User }],
    required: true,
  })
  @Field((type) => [User!])
  teachers: User[];

  @Prop({ default: 0.0 })
  @Field(() => Float, { nullable: true })
  price: number;

  @IsIn(validCourseStatus)
  @Prop({ default: 'draft' })
  @Field({ nullable: true })
  status: string;

  @Prop({ type: Date, default: Date.now })
  @Field({ nullable: true })
  publishedAt: string;

  @Prop({ type: Date, default: Date.now })
  @Field({ nullable: true })
  createdAt: string;

  @Prop({ type: Date, default: Date.now })
  @Field({ nullable: true })
  updatedAt: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
