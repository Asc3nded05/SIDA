import { IsEnum } from 'class-validator'

export enum CommissionStatus {
  SUBMITTED = 'SUBMITTED',
  REVIEWING = 'REVIEWING',
  MATCHED = 'MATCHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DECLINED = 'DECLINED',
}

export class UpdateCommissionStatusDto {
  @IsEnum(CommissionStatus)
  status!: CommissionStatus
}