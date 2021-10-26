import { InputType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CustomUserInput extends PickType(User, ['_id'], InputType) {}
