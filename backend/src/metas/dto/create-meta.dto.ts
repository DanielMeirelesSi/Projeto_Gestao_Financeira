import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateMetaDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsNumber()
  @Min(0.01)
  valorObjetivo!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorAtual?: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dataLimite must follow the YYYY-MM-DD format',
  })
  dataLimite!: string;

  @IsString()
  @IsNotEmpty()
  usuarioId!: string;
}