import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const usuario =
      await this.usuariosService.findByUsernameWithPassword(loginDto.usuario);

    if (!usuario) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const senhaCorreta = await compare(loginDto.senha, usuario.senha);

    if (!senhaCorreta) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const payload = {
      sub: usuario._id.toString(),
      usuario: usuario.usuario,
      admin: usuario.admin,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const { senha, ...usuarioSeguro } = usuario.toObject();

    return {
      message: 'Login realizado com sucesso',
      usuario: usuarioSeguro,
      accessToken,
    };
  }
}