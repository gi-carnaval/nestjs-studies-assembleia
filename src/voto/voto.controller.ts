import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { PautasService } from 'src/pautas/pautas.service';
import { VotoService } from './voto.service';
import { VoteRegisterResource } from './voto.resource';
import { Response } from 'express';

@Controller('pautas/:id/votos')
export class VotoController {
  constructor(
    private readonly pautasService: PautasService,
    private readonly votoService: VotoService,
  ) {}

  @Post()
  async voteRegister(
    @Param('id') idPAuta: string,
    @Body() resource: VoteRegisterResource,
    @Res() response: Response,
  ) {
    return response.status(HttpStatus.ACCEPTED).send();
  }
}
