import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VoteOption, Voto } from './voto.entity';
import { AssociadoService } from '../associado/associado.service';
import { Pauta } from 'src/pautas/pauta.entity';
import { Result } from 'src/common/result';
import { Associado } from '../associado/associado.entity';
import { HttpError } from 'src/common/httpError';
import { ResultadoVotacaoResource } from './resultado/resultado.resource';

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
    if (!pauta.isInitialized()) {
      return new Result(
        null,
        new HttpError(
          'Pauta não está em sessão',
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    }

    const associado = await this.associadoService.verifyAssociateByCpf(cpf);

    if (!associado) {
      return new Result(
        null,
        new HttpError('Associado não cadastrado.', HttpStatus.NOT_FOUND),
      );
    }

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

  async obterVotosPorPauta(pauta: Pauta): Promise<Voto[]> {
    return await this.votoRepository.find({
      where: {
        pauta: {
          id: pauta.id,
        },
      },
    });
  }

  obterPosicaoVencedora(sim: number, nao: number): VoteOption {
    if (sim == nao) {
      return null;
    }

    return sim > nao ? VoteOption.SIM : VoteOption.NAO;
  }

  async obterResultado(
    pauta: Pauta,
  ): Promise<Result<ResultadoVotacaoResource, HttpError>> {
    if (!pauta.isEnded()) {
      return new Result(
        null,
        new HttpError('Resultado ainda não disponível.', HttpStatus.NOT_FOUND),
      );
    }

    const votos: Voto[] = await this.obterVotosPorPauta(pauta);

    const qtdSim = votos.filter((v) => v.voteOption == VoteOption.SIM).length;
    const qtdNao = votos.filter((v) => v.voteOption == VoteOption.NAO).length;

    const posicaoVencedora = this.obterPosicaoVencedora(qtdSim, qtdNao);

    const resultado = new ResultadoVotacaoResource();

    resultado.pauta = pauta.descricao;
    resultado.abertura = pauta.abertura;
    resultado.encerramento = pauta.fechamento;
    resultado.totalVotos = votos.length;
    resultado.quantidadeSim = qtdSim;
    resultado.quantidadeNao = qtdNao;
    resultado.opcaoGanhadora = posicaoVencedora;

    return new Result(resultado, null);
  }
}
