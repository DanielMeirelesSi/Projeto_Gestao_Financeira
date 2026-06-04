import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateGastoDto {
  @IsString()
  @IsNotEmpty()
  descricao!: string;

  @IsString()
  @IsNotEmpty()
  categoria!: string;

  @IsIn(['Fixo', 'Variável', 'Obrigatório'])
  tipo!: 'Fixo' | 'Variável' | 'Obrigatório';

  @IsNumber()
  @Min(0)
  valor!: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'data must follow the YYYY-MM-DD format',
  })
  data!: string;

  @IsString()
  @IsNotEmpty()
  usuarioId!: string;
}