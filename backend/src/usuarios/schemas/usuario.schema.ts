import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true, trim: true })
  nome!: string;

  @Prop({ required: true })
  dataNascimento!: string;

  @Prop({ required: true, trim: true })
  endereco!: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  usuario!: string;

  @Prop({
    required: true,
    select: false,
  })
  senha!: string;

  @Prop({
    required: true,
    min: 0,
  })
  salario!: number;

  @Prop({
    default: false,
  })
  admin!: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);