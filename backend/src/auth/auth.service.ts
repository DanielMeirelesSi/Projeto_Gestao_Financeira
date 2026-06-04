import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usuariosService: UsuariosService) {}

  async login(loginDto: LoginDto) {
    const usuario = await this.usuariosService.findByUsernameWithPassword(
      loginDto.usuario,
    );

    if (!usuario) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const senhaValida = await compare(loginDto.senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const usuarioSemSenha = usuario.toObject();

    Reflect.deleteProperty(usuarioSemSenha, 'senha');

    return {
      message: 'Login realizado com sucesso',
      usuario: usuarioSemSenha,
    };
  }
}