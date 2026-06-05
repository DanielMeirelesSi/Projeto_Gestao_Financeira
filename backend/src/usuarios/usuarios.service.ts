import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioNormalizado = createUsuarioDto.usuario
      .trim()
      .toLowerCase();

    const usuarioExistente = await this.usuarioModel
      .findOne({
        usuario: usuarioNormalizado,
      })
      .exec();

    if (usuarioExistente) {
      throw new ConflictException('Nome de usuário já cadastrado');
    }

    const senhaHash = await hash(createUsuarioDto.senha, 10);

    const novoUsuario = await this.usuarioModel.create({
      nome: createUsuarioDto.nome,
      dataNascimento: createUsuarioDto.dataNascimento,
      endereco: createUsuarioDto.endereco,
      usuario: usuarioNormalizado,
      senha: senhaHash,
      salario: createUsuarioDto.salario,
      admin: false,
    });

    const usuarioSemSenha = novoUsuario.toObject();

    Reflect.deleteProperty(usuarioSemSenha, 'senha');

    return usuarioSemSenha;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel
      .find()
      .select('-senha')
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel
      .findById(id)
      .select('-senha')
      .exec();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const dadosAtualizados: Record<string, unknown> = {};

    if (updateUsuarioDto.nome !== undefined) {
      dadosAtualizados.nome = updateUsuarioDto.nome;
    }

    if (updateUsuarioDto.dataNascimento !== undefined) {
      dadosAtualizados.dataNascimento =
        updateUsuarioDto.dataNascimento;
    }

    if (updateUsuarioDto.endereco !== undefined) {
      dadosAtualizados.endereco = updateUsuarioDto.endereco;
    }

    if (updateUsuarioDto.salario !== undefined) {
      dadosAtualizados.salario = updateUsuarioDto.salario;
    }

    if (updateUsuarioDto.usuario !== undefined) {
      const usuarioNormalizado = updateUsuarioDto.usuario
        .trim()
        .toLowerCase();

      const usuarioExistente = await this.usuarioModel
        .findOne({
          _id: {
            $ne: id,
          },
          usuario: usuarioNormalizado,
        })
        .exec();

      if (usuarioExistente) {
        throw new ConflictException('Nome de usuário já cadastrado');
      }

      dadosAtualizados.usuario = usuarioNormalizado;
    }

    if (updateUsuarioDto.senha) {
      dadosAtualizados.senha = await hash(updateUsuarioDto.senha, 10);
    }

    const usuario = await this.usuarioModel
      .findByIdAndUpdate(id, dadosAtualizados, {
        new: true,
        runValidators: true,
      })
      .select('-senha')
      .exec();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.usuarioModel.findByIdAndDelete(id).exec();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async findByUsernameWithPassword(
    usuario: string,
  ): Promise<UsuarioDocument | null> {
    return this.usuarioModel
      .findOne({
        usuario: usuario.trim().toLowerCase(),
      })
      .select('+senha')
      .exec();
  }
}