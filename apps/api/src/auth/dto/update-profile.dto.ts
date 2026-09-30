import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator'

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string | null

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string | null

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  disciplines?: string[]

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string

  @IsOptional()
  @IsUrl()
  profileImage?: string | null
}