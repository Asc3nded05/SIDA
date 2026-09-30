import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator'

export class CreateWorkDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  category!: string

  @IsUrl({ require_protocol: true })
  mediaUrl!: string

  @IsOptional()
  @IsUrl({ require_protocol: true })
  thumbnailUrl?: string
}