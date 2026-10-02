import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateCommissionDto {
  @IsString()
  @MaxLength(120)
  title!: string

  @IsString()
  @MaxLength(3000)
  description!: string

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  requirements?: string

  @IsString()
  @MaxLength(120)
  contactName!: string

  @IsEmail()
  @MaxLength(254)
  email!: string

  @IsString()
  @MaxLength(80)
  category!: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  timeline?: string

  @IsOptional()
  @IsDateString()
  dueDate?: string
}