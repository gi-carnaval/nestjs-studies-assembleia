import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Pauta } from './pauta.entity';
import { Result } from 'src/common/result';

@Injectable()
export class PautasService {
  static PAUTA_DEFAULT_TIME = 10;

  constructor(
    @Inject('PAUTA_REPOSITORY')
    private readonly pautaRepository: Repository<Pauta>,
  ) {}

  async save(pauta: Pauta): Promise<Result<Pauta>> {
    const { descricao } = pauta;

    const possivelPauta = await this.pautaRepository.findOne({
      where: {
        descricao: descricao,
      },
    });
    if (possivelPauta) {
      return new Result(null, new Error('pauta existente'));
    }

    pauta = await this.pautaRepository.save(pauta);

    return new Result(pauta, null);
  }

  async findAdll(): Promise<Pauta[]> {
    return await this.pautaRepository.find();
  }

  async iniciarSessao(
    pauta: Pauta,
    minutes: number = PautasService.PAUTA_DEFAULT_TIME,
  ): Promise<boolean> {
    if (!pauta.isAbbleToInit()) return false;

    pauta.abertura = new Date();
    pauta.fechamento = new Date(pauta.abertura.getTime() + minutes * 60000);

    await this.pautaRepository.update(pauta.id, pauta);

    return true;
  }

  async findById(id: string): Promise<Pauta> {
    return await this.pautaRepository.findOneBy({
      id: id,
    });
  }
}
