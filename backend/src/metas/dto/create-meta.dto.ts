import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateMetaDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsNumber()
  @IsPositive()
  valorObjetivo!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorAtual?: number;

  @IsDateString()
  dataLimite!: string;
}