import { Module } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Benefit } from './entities/benefit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Benefit])],
  controllers: [BenefitsController],
  providers: [BenefitsService],
  exports: [BenefitsService],
})
export class BenefitsModule {}
