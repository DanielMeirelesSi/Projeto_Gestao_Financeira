import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dataNascimento must follow the YYYY-MM-DD format',
  })
  dataNascimento!: string;

  @IsString()
  @IsNotEmpty()
  endereco!: string;

  @IsString()
  @IsNotEmpty()
  usuario!: string;

  @IsString()
  @MinLength(6)
  senha!: string;

  @IsNumber()
  @Min(0)
  salario!: number;
}