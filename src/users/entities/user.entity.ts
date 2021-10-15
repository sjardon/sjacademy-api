import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
@ObjectType()
export class User {
  @Field()
  _id: string;

  @Prop({ required: true })
  @Field({ description: 'User name' })
  name: string;

  @Prop({ required: true })
  @Field()
  password: string;

  @Prop({ required: true })
  @Field()
  email: string;

  @Prop()
  @Field({ description: 'Profile picture', nullable: true })
  picture: string;

  @Prop({ default: false })
  @Field()
  isTeacher: boolean;

  @Prop({ type: Date, default: Date.now })
  @Field()
  createdAt: string;

  @Prop({ type: Date, default: Date.now })
  @Field()
  updatedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
