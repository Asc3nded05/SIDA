import { IsString, MinLength } from 'class-validator'

export class AssignCommissionDto {
  @IsString()
  @MinLength(1)
  memberId!: string
}