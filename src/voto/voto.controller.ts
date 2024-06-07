import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { PautasService } from 'src/pautas/pautas.service';
import { VotoService } from './voto.service';
import { VoteRegisterResource } from './voto.resource';
import { Response } from 'express';
import { ErrorResponse } from 'src/common/error.resource';

@Controller('pautas/:id/votos')
export class VotoController {
  constructor(
    private readonly pautasService: PautasService,
    private readonly votoService: VotoService,
  ) {}

  @Post()
  async voteRegister(
    @Param('id') idPauta: string,
    @Body() resource: VoteRegisterResource,
    @Res() response: Response,
  ) {
    const pauta = await this.pautasService.findById(idPauta);

    if (!pauta) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send(new ErrorResponse('Pauta não encontrada.'));
    }

    const result = await this.votoService.registrarVoto(
      pauta,
      resource.cpf,
      resource.voteOption,
    );

    if (result.isError()) {
      const error = result.error;

      return response
        .status(error.status)
        .send(new ErrorResponse(error.message));
    }

    return response.status(HttpStatus.ACCEPTED).send();
  }
}
