import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApplyStatus } from 'src/common/enums/apply-status.enum';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplyStatus)
  @IsNotEmpty()
  status: ApplyStatus;
}
