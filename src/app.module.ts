import {MiddlewareConsumer, RequestMethod, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
//import { TestModule } from './test/test.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { CurrentUserMiddleware } from './users/utility/middlewares/current-user.middleware';
//import { TestModule } from './test/test.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      // Enable synchronize for development (disable in production)
      synchronize: process.env.NODE_ENV !== 'production',
    }), 
    UsersModule, 
    CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
   configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes({path: '*', method: RequestMethod.ALL});
   }
}
