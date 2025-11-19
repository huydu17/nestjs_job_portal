import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [TypeOrmModule.forFeature([Package]), PaginationModule],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService],
})
export class PackagesModule {}
