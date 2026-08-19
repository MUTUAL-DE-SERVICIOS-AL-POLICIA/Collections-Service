import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { CollectionsModule } from './collections/collections.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, CommonModule, CollectionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
