import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VoteOption, Voto } from './voto.entity';
import { AssociadoService } from './associado/associado.service';
import { Pauta } from 'src/pautas/pauta.entity';
import { Result } from 'src/common/result';
import { Associado } from './associado/associado.entity';
import { HttpError } from 'src/common/httpError';

@Injectable()
export class VotoService {
  constructor(
    @Inject('VOTO_REPOSITORY')
    private readonly votoRepository: Repository<Voto>,
    private readonly associadoService: AssociadoService,
  ) {}

  async registrarVoto(
    pauta: Pauta,
    cpf: string,
    opcaoVoto: VoteOption,
  ): Promise<Result<Voto, HttpError>> {
    if (!pauta.isInitialized) {
      return new Result(
        null,
        new HttpError(
          'Pauta não está em sessão',
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    }

    const associado = await this.associadoService.recuperarOuCadastrar(cpf);

    const votoJaRegistrado: boolean = await this.existeVotoPara(
      pauta,
      associado,
    );

    if (votoJaRegistrado) {
      return new Result(
        null,
        new HttpError('Voto já registrado anteriormente!', HttpStatus.CONFLICT),
      );
    }

    const voto = new Voto();
    voto.associado = associado;
    voto.pauta = pauta;
    voto.voteOption = opcaoVoto;

    await this.votoRepository.save(voto);
    return new Result(voto, null);
  }

  async existeVotoPara(pauta: Pauta, associado: Associado): Promise<boolean> {
    const voto: Voto = await this.votoRepository.findOne({
      where: {
        pauta: {
          id: pauta.id,
        },
        associado: {
          id: associado.id,
        },
      },
    });

    return !!voto;
  }
}
