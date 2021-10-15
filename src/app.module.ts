import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AllExceptionFilter } from './core/all-exeptions.filter';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // formatError: (error) => {
      //   const graphQLFormattedError = {
      //     message:
      //       error.extensions?.exception?.response?.message || error.message,
      //     code: error.extensions?.code || 'SERVER_ERROR',
      //     name: error.extensions?.exception?.name || error.name,
      //   };
      //   return graphQLFormattedError;
      // },
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}`,
    ),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionFilter,
    // },
  ],
})
export class AppModule {}
