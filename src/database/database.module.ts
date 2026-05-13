import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from './config/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...options,
      autoLoadEntities: true,
      synchronize: false,
    }),
  ],
})
export class DatabaseModule {}
