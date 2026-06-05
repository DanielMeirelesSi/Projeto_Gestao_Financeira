import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateGastoDto {
  @IsString()
  @IsNotEmpty()
  descricao!: string;

  @IsString()
  @IsNotEmpty()
  categoria!: string;

  @IsString()
  @IsIn(['Fixo', 'Variável', 'Obrigatório'])
  tipo!: 'Fixo' | 'Variável' | 'Obrigatório';

  @IsNumber()
  @IsPositive()
  valor!: number;

  @IsDateString()
  data!: string;
}