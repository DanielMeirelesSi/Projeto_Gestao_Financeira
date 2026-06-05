import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuariosService } from './usuarios.service';

type JwtPayload = {
  sub: string;
  usuario: string;
  admin: boolean;
};

type AuthenticatedRequest = Request & {
  usuario: JwtPayload;
};

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() request: AuthenticatedRequest) {
    if (!request.usuario.admin) {
      throw new ForbiddenException(
        'Acesso permitido apenas para administradores',
      );
    }

    return this.usuariosService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    this.validarAcessoAoUsuario(request, id);

    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    this.validarAcessoAoUsuario(request, id);

    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    this.validarAcessoAoUsuario(request, id);

    return this.usuariosService.remove(id);
  }

  private validarAcessoAoUsuario(
    request: AuthenticatedRequest,
    usuarioId: string,
  ) {
    const usuarioAutenticado = request.usuario;

    const possuiAcesso =
      usuarioAutenticado.admin || usuarioAutenticado.sub === usuarioId;

    if (!possuiAcesso) {
      throw new ForbiddenException(
        'Você não possui permissão para acessar este usuário',
      );
    }
  }
}